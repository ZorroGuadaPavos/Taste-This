import { fetchReviews } from "../api/reviews.js";
import parseReviews from "../parsers/review-parser.js";

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
