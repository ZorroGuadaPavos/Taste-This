import parseReviews from "./parsers/reviews.js";
import { fetchReviews } from "./public_endpoints/reviews.js";
import { SortEnum } from "./types.js";
import { paginateReviews, validateParams } from "./utils.js";

/**
 * Scrapes reviews from a Google Maps place using its ID.
 *
 * @param {string} placeId - The Google Maps place ID to scrape reviews from.
 * @param {Object} options - The options for scraping.
 * @param {string} [options.sort_type="relevant"] - The type of sorting for the reviews ("relevant", "newest", "highest_rating", "lowest_rating").
 * @param {string} [options.search_query=""] - The search query to filter reviews.
 * @param {string} [options.pages="max"] - The number of pages to scrape (default is "max"). If set to a number, it will scrape that number of pages (results will be 10 * pages) or until there are no more reviews.
 * @param {boolean} [options.clean=false] - Whether to return clean reviews or not.
 * @returns {Promise<Array|number>} - Returns an array of reviews or 0 if no reviews are found.
 * @throws {Error} - Throws an error if the placeId is not provided or if fetching reviews fails.
 */
export async function reviews_scraper(
	placeId,
	{ sort_type = "relevant", search_query = "", pages = "max", clean = false } = {},
) {
	validateParams(placeId, sort_type, pages, clean);

	const sort = SortEnum[sort_type];
	const initialData = await fetchReviews(placeId, sort, "", search_query);

	if (!initialData || !initialData[2] || !initialData[2].length) return 0;

	if (!initialData[1] || pages === 1) {
		return clean ? await parseReviews(initialData[2]) : initialData[2];
	}

	return await paginateReviews(placeId, sort, pages, search_query, clean, initialData);
}
