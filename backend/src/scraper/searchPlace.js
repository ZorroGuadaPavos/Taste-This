import { saveResponseData } from "../utils/saveResponse.js";

/**
 * Searches for a place on Google Maps and returns the first result URL
 * @param {string} placeName - The name of the place to search for
 * @returns {Promise<string>} - The Google Maps URL for the place
 * @throws {Error} - If no results are found or if the search fails
 */
export async function searchPlace(placeName) {
	const encodedQuery = encodeURIComponent(placeName);
	const searchUrl = `https://www.google.com/maps/search/${encodedQuery}`;

	const response = await fetch(searchUrl);

	if (!response.ok) {
		const error = new Error(`Search request failed: ${response.statusText}`);
		error.status = response.status;
		throw error;
	}

	const html = await response.text();
	saveResponseData(html, "search", false);

	// Use the same regex pattern as searchPlaceById
	const placeIdRegex = /0x[0-9a-f]+:0x[0-9a-f]+/g;
	const matches = html.match(placeIdRegex);

	if (matches && matches.length > 0) {
		const match = matches[0];
		console.log("match", match);
		return `https://www.google.com/maps/place/${encodedQuery}/@0,0,15z/data=!4m5!3m4!1s${match}!8m2!3d0!4d0`;
	}

	const error = new Error(`No valid place ID found for: ${placeName}`);
	error.status = 404;
	throw error;
}
