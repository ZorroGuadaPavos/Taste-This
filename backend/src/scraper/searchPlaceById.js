import settings from "../core/config";

export async function getPlaceIds(query) {
	try {
		if (!query.trim()) return { success: false, error: "Please enter a search query" };

		const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": settings.MAPS_API_KEY,
				"X-Goog-FieldMask": "places.id",
			},
			body: JSON.stringify({ textQuery: query }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
			return {
				success: false,
				error: `Failed to search places: ${response.status} ${errorData.message || "Unknown API error"}`,
			};
		}
		const data = await response.json();
		const placeIdArray = data.places?.map((place) => place.id) || [];

		if (placeIdArray.length === 0) {
			return { success: false, error: "No places found matching the query" };
		}

		return { success: true, placeIds: placeIdArray };
	} catch (error) {
		console.error("Error in getPlaceIds:", error);
		return { success: false, error: "An internal error occurred while searching for place IDs." };
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

export async function getFeatureID(placeId) {
	if (!placeId) return null;
	try {
		const response = await fetch(`https://google.com/maps/place/?q=place_id:${placeId}`);
		const data = await response.text();
		const featureId = extractFeatureId(data);

		return featureId;
	} catch (error) {
		throw new Error(`Failed to fetch feature ID: ${error.message}`);
	}
}
