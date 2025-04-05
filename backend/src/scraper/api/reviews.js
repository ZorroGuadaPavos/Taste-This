/**
 * Creates a listugcposts endpoint URL from a Google Maps place ID.
 * @param {string} placeId Google Maps place ID.
 * @param {1|2|3|4} so Sorting order (1: Most Relevant, 2: Newest, 3: Highest Rating, 4: Lowest Rating).
 * @param {string} [pg=""] Base64 encoding of the page number.
 * @param {string} [sq=""] Search query for filtering reviews.
 * @returns {string} URL to fetch reviews.
 */
function listugcposts(placeId, so, pg = "", sq = "") {
	if (!placeId) {
		throw new Error("Place ID is required");
	}
	return `https://www.google.com/maps/rpc/listugcposts?authuser=0&hl=en&gl=in&pb=!1m7!1s${placeId}!3s${sq}!6m4!4m1!1e1!4m1!1e3!2m2!1i10!2s${pg}!5m2!1sBnOwZvzePPfF4-EPy7LK0Ak!7e81!8m5!1b1!2b1!3b1!5b1!7b1!11m6!1e3!2e1!3sen!4slk!6m1!1i2!13m1!1e${so}`;
}

/**
 * Fetches reviews for a place using its ID with sorting and pagination options.
 *
 * @param {string} placeId - The Google Maps place ID.
 * @param {string} sort - The sorting option for the reviews.
 * @param {string} [nextPage=""] - Token for the next page, if any.
 * @param {string} [search_query=""] - Search query to filter reviews, if any.
 * @returns {Promise<Object>} Parsed JSON data of reviews.
 * @throws {Error} If the request fails or the response is invalid.
 */
export async function fetchReviews(placeId, sort, nextPage = "", search_query = "") {
	const apiUrl = listugcposts(placeId, sort, nextPage, search_query);

	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch reviews: ${response.statusText}`);
		}
		const textData = await response.text();
		const rawData = textData.split(")]}'")[1];
		return JSON.parse(rawData);
	} catch (error) {
		throw new Error(`Failed to fetch reviews: ${error.message}`);
	}
}
