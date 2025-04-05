import parseReviews from "./parsers/reviews.js";
import { fetchReviews } from "./public_endpoints/reviews.js";
import { SortEnum } from "./types.js";

/**
 * Validates parameters for the Google Maps review scraper.
 *
 * @param {string} placeId - The Google Maps place ID.
 * @param {string} sort_type - Must be a valid key in SortEnum.
 * @param {string|number} pages - "max" or a number.
 * @param {boolean} clean - Must be a boolean.
 * @throws {Error} If any parameter is invalid.
 */
export function validateParams(placeId, sort_type, pages, clean) {
	if (!placeId) {
		throw new Error("Place ID is required");
	}
	if (!SortEnum[sort_type]) {
		throw new Error(`Invalid sort type: ${sort_type}`);
	}
	if (pages !== "max" && Number.isNaN(Number(pages))) {
		throw new Error(`Invalid pages value: ${pages}`);
	}
	if (typeof clean !== "boolean") {
		throw new Error(`Invalid value for 'clean': ${clean}`);
	}
}

/**
 * Paginates through reviews for a given place ID.
 *
 * @param {string} placeId - The Google Maps place ID.
 * @param {string} sort - Sorting parameter for reviews.
 * @param {string|number} pages - Number of pages or "max".
 * @param {string} search_query - Search query to filter reviews.
 * @param {boolean} clean - Whether to clean and parse the data.
 * @param {Array} initialData - Initial data containing reviews and next page token.
 * @returns {Promise<Array>} Array of reviews or parsed reviews.
 */
export async function paginateReviews(placeId, sort, pages, search_query, clean, initialData) {
	let reviews = initialData[2];
	let nextPage = initialData[1]?.replace(/"/g, "");
	let currentPage = 2;
	while (nextPage && (pages === "max" || currentPage <= +pages)) {
		const data = await fetchReviews(placeId, sort, nextPage, search_query);
		reviews = [...reviews, ...data[2]];
		nextPage = data[1]?.replace(/"/g, "");
		if (!nextPage) break;
		currentPage++;
	}
	return clean ? await parseReviews(reviews) : reviews;
}
