// import { saveResponseData } from "../utils/saveResponse.js";
/**
 * Searches for a place on Google Maps and returns the first result URL
 * @param {string} placeId - Google maps cid eg: placeId=5158916063863294215
 * @returns {Promise<string>} - The Google Maps URL for the place
 * @throws {Error} - If no results are found or if the search fails
 */
export async function searchPlaceById(placeId) {
	const searchUrl = `https://maps.google.com/?cid=${placeId}`;

	const response = await fetch(searchUrl);

	if (!response.ok) {
		const error = new Error(`Search request failed: ${response.statusText}`);
		error.status = response.status;
		throw error;
	}

	const html = await response.text();
	// saveResponseData(html, "byId", false);

	// Pattern: 0x0:0x...
	const placeIdRegex = /0x[0-9a-f]+:0x[0-9a-f]+/g;
	const matches = html.match(placeIdRegex);

	if (matches && matches.length > 0) {
		const match = matches[0];
		return `https://www.google.com/maps/place/${match}/@0,0,15z/data=!4m5!3m4!1s${match}!8m2!3d0!4d0`;
	}

	const error = new Error(`No valid place ID found for: ${placeId}`);
	error.status = 404;
	throw error;
}
