import { fetchPlaceData, getFeatureID, getPlaceIds } from "./api/places.js";
import { fetchReviews } from "./api/reviews.js";
import parsePlace from "./parsers/place-parser.js";
import parseReviews from "./parsers/review-parser.js";
import { SortEnum } from "./types/enums.js";
import { paginateReviews } from "./utils/pagination.js";
import { validateParams } from "./utils/validation.js";

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

/**
 * Scrapes place information based on a search query.
 *
 * @param {string} query - The search query (e.g., restaurant name).
 * @param {Object} options - The options for scraping.
 * @param {number} [options.limit=5] - Maximum number of places to return.
 * @returns {Promise<{success: boolean, places?: Array<object>, error?: string}>}
 */
export async function places_scraper(query, { limit = 5 } = {}) {
	try {
		const placeIds = await getPlaceIds(query);

		const placesData = await Promise.all(
			placeIds.slice(0, limit).map(async (placeId) => {
				try {
					const featureId = await getFeatureID(placeId);
					const placeData = await fetchPlaceData(featureId);
					const parsedData = await parsePlace(placeData);
					return parsedData;
				} catch (error) {
					console.error(`Error processing place ID ${placeId} within places_scraper:`, error.message);
					return null;
				}
			}),
		);

		const filteredPlaces = placesData.filter((data) => data !== null);

		if (filteredPlaces.length === 0) {
			console.warn(`places_scraper found IDs for query "${query}" but failed to process any.`);
			return { success: false, error: `Found place IDs for "${query}" but failed to fetch/parse details for any.` };
		}

		return {
			success: true,
			places: filteredPlaces,
		};
	} catch (error) {
		console.error(`Failed to scrape places for query "${query}":`, error.message);
		return { success: false, error: error.message };
	}
}
