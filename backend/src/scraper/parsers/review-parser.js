/**
 * Parses an array of raw Google Maps reviews into a structured format.
 * @param {Array} reviews - The array of raw review data.
 * @returns {Array} An array of parsed review objects.
 */
export default function parseReviews(rawReviews) {
	if (!Array.isArray(rawReviews)) {
		console.error("parseReviews expected an array, but received:", typeof rawReviews);
		return [];
	}

	const parsedReviews = rawReviews.map(([review]) => {
		if (!review) return null;

		// const authorData = review[1]?.[4]?.[5];
		const reviewData = review[2];
		// const responseData = review[3]?.[14]?.[0];
		const photosData = reviewData?.[2] || [];

		// const photos = photosData.map((image) => image?.[1]?.[6]?.[0]?.split("=")[0]).filter(Boolean);

		return {
			review_id: review[0],
			// time_published_at: review[1]?.[2] || null,
			// time_last_edited_at: review[1]?.[3] || null,
			// author_name: authorData?.[0] || null,
			// author_profile_url: authorData?.[1] || null,
			// author_url: authorData?.[2]?.[0] || null,
			// author_id: authorData?.[3] || null,
			rating: reviewData?.[0]?.[0] || null,
			review_text: reviewData?.[15]?.[0]?.[0] || null,
			// review_language: reviewData?.[14]?.[0] || null,
			// photos: photos.length > 0 ? photos : null,
			// source: review[1]?.[13]?.[0] || null,
			// response_text: responseData?.[0] || null,
			// response_time_published_at: review[3]?.[1] || null,
			// response_time_last_edited_at: review[3]?.[2] || null,
		};
	});

	return parsedReviews.filter(Boolean);
}
