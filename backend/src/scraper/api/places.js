import settings from "../../core/config.js";

/**
 * Fetches place data from Google Maps for a given feature ID.
 * @param {string} featureId - The unique identifier (feature ID) of the place to fetch data for.
 * @returns {Promise<object>} A promise that resolves to the raw place data object.
 * @throws {Error} Throws an error if the fetch operation fails or the response cannot be parsed.
 */
export async function fetchPlaceData(featureId) {
	if (!featureId) throw new Error("Feature ID is required to fetch place data.");
	const url = `https://www.google.com/maps/preview/place?authuser=0&hl=en&gl=lk&pb=!1m20!1s${featureId}!3m15!1m3!1d2897.602952432643!2d79.87687425884405!3d6.9101139243550564!2m3!1f0!2f0!3f0!3m2!1i958!2i918!4f13.1!6m2!1f0!2f0!4m2!3d6.910380211799998!4d79.87802378833295!13m41!2m2!1i408!2i240!3m2!2i10!5b1!7m33!1m3!1e1!2b0!3e3!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e10!2b0!3e4!1m3!1e9!2b1!3e2!2b1!9b0!14m4!1siwXjZ4a6IdbB4-EP37Kr2Q0!3b1!7e81!15i10555!15m49!1m10!4e2!18m7!3b0!6b0!14b1!17b1!20b1!27m1!1b0!20e2!4b1!10m1!8e3!11m1!3e1!17b1!20m2!1e3!1e6!24b1!25b1!26b1!29b1!30m1!2b1!36b1!43b1!52b1!55b1!56m1!1b1!65m5!3m4!1m3!1m2!1i224!2i298!98m3!1b1!2b1!3b1!107m2!1m1!1e1!114m3!1b1!2m1!1b1!22m1!1e81!29m0!30m6!3b1!6m1!2b1!7m1!2b1!9b1!32b1!37i725`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch place data for feature ID ${featureId}: ${response.status} ${response.statusText}`,
			);
		}
		const data = await response.text();
		const parsedData = JSON.parse(data.split(")]}'")[1]);
		if (!parsedData || !parsedData[6]) {
			throw new Error(`Failed to parse place data structure for feature ID ${featureId}`);
		}
		return parsedData[6];
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("Failed to")) {
			throw error;
		}
		throw new Error(`Failed to fetch or parse place data for feature ID ${featureId}: ${error.message}`);
	}
}

/**
 * Searches for Google Maps Place IDs based on a query.
 * @param {string} query - The search query.
 * @returns {Promise<string[]>} A promise that resolves to an array of Place IDs.
 * @throws {Error} Throws an error if the query is empty, the API search fails, or no places are found.
 */
export async function getPlaceIds(query) {
	const trimmedQuery = query?.trim();
	if (!trimmedQuery) {
		throw new Error("Search query cannot be empty");
	}

	try {
		const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": settings.MAPS_API_KEY,
				"X-Goog-FieldMask": "places.id",
			},
			body: JSON.stringify({ textQuery: trimmedQuery }),
		});

		if (!response.ok) {
			let errorDetails = "Unknown API error";
			try {
				const errorData = await response.json();
				errorDetails = errorData.message || JSON.stringify(errorData);
			} catch (parseError) {
				errorDetails = `Failed to parse error response (${parseError.message})`;
			}
			throw new Error(`Places API search failed: ${response.status} ${errorDetails}`);
		}

		const data = await response.json();
		const placeIdArray = data.places?.map((place) => place.id) || [];

		if (placeIdArray.length === 0) {
			throw new Error(`No places found matching the query: ${trimmedQuery}`);
		}

		return placeIdArray;
	} catch (error) {
		if (
			error instanceof Error &&
			(error.message.startsWith("Places API search failed:") || error.message.startsWith("No places found"))
		) {
			throw error;
		}
		throw new Error(
			`An internal error occurred while searching for place IDs for query "${trimmedQuery}": ${error.message}`,
		);
	}
}

function extractFeatureId(html) {
	// Pattern: 0x0:0x...
	const placeIdRegex = /0x[0-9a-f]+:0x[0-9a-f]+/g;
	const matches = html.match(placeIdRegex);
	if (matches && matches.length > 0) {
		return matches[0];
	}

	return null;
}

/**
 * Fetches the Google Maps Feature ID for a given Place ID.
 * @param {string} placeId - The Google Maps Place ID.
 * @returns {Promise<string>} A promise that resolves to the Feature ID.
 * @throws {Error} Throws an error if the Place ID is missing, the fetch fails, or the Feature ID cannot be extracted.
 */
export async function getFeatureID(placeId) {
	if (!placeId) {
		throw new Error("Place ID is required to get Feature ID.");
	}
	try {
		const response = await fetch(`https://google.com/maps/place/?q=place_id:${placeId}`);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch feature ID page for place ID ${placeId}: ${response.status} ${response.statusText}`,
			);
		}
		const data = await response.text();
		const featureId = extractFeatureId(data);

		if (!featureId) {
			throw new Error(`Could not extract feature ID for place ID: ${placeId}`);
		}

		return featureId;
	} catch (error) {
		if (
			error instanceof Error &&
			(error.message.startsWith("Failed to fetch") || error.message.startsWith("Could not extract"))
		) {
			throw error;
		}
		throw new Error(`Failed to get feature ID for place ID ${placeId}: ${error.message}`);
	}
}
