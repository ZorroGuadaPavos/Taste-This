import { saveResponseData } from "../utils/saveResponse.js";

/**
 * Generates a URL to fetch a Google Maps place by its ID
 * @param {string} placeId - Google maps cid eg: placeId=5158916063863294215
 * @returns {string} - The URL to fetch the place
 */
export function generatePlaceUrl(placeId) {
	return `https://maps.google.com/?cid=${placeId}`;
}

/**
 * Fetches HTML content for a Google Maps place by its ID
 * @param {string} placeId - Google maps cid eg: placeId=5158916063863294215
 * @returns {Promise<string>} - The HTML content of the place page
 * @throws {Error} - If the request fails
 */
export async function fetchPlaceById(placeId) {
	const searchUrl = generatePlaceUrl(placeId);

	const response = await fetch(searchUrl);

	if (!response.ok) {
		const error = new Error(`Search request failed: ${response.statusText}`);
		error.status = response.status;
		throw error;
	}

	return await response.text();
}

/**
 * Extracts the image URL from HTML content
 * @param {string} html - HTML content of the place page
 * @returns {string|null} - The image URL or null if not found
 */
export function extractImageUrl(html) {
	const imageRegex =
		/<meta\s+(?:content="([^"]+)"\s+(?:itemprop="image"|property="og:image")|(?:itemprop="image"|property="og:image")\s+content="([^"]+)")/i;
	const imageMatch = html.match(imageRegex);
	return imageMatch ? imageMatch[1] || imageMatch[2] : null;
}

export function extractPlaceUrlId(html) {
	// Pattern: 0x0:0x...
	const placeIdRegex = /0x[0-9a-f]+:0x[0-9a-f]+/g;
	const matches = html.match(placeIdRegex);

	if (matches && matches.length > 0) {
		return matches[0];
	}

	return null;
}

/**
 * Searches for a place on Google Maps and returns the first result URL and image URL
 * @param {string} placeId - Google maps cid eg: placeId=5158916063863294215
 * @returns {Promise<{placeUrl: string, imageUrl: string|null}>} - The Google Maps URL and image URL for the place
 * @throws {Error} - If no results are found or if the search fails
 */
export async function searchPlaceById(placeId) {
	const html = await fetchPlaceById(placeId);

	const placeUrlId = extractPlaceUrlId(html);
	const imageUrl = extractImageUrl(html);

	if (placeUrlId) {
		return {
			placeUrlId,
			imageUrl,
		};
	}

	const error = new Error("No valid place ID found in the HTML content");
	error.status = 404;
	throw error;
}

/**
 * Generates a Google Maps URL for place details/reviews based on the placeId
 * @param {string} placeId - Google Maps place ID (format: 0x0:0x...)
 * @returns {string} - Formatted Google Maps URL for accessing place details and reviews
 */
export function getPlaceUrl(placeId) {
	if (!placeId) {
		throw new Error("Place ID is required");
	}
	return `https://www.google.com/maps/place/${placeId}/@0,0,15z/data=!4m5!3m4!1s${placeId}!8m2!3d0!4d0`;
}
