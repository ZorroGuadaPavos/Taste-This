import { getPopularDishesModelConfig } from "../../ai-providers/gemini/config.js";
import { scraper } from "../../scraper/index.js";
import { getPlaceUrl, searchPlaceById } from "../../scraper/searchPlaceById.js";
// import { saveResponseData } from "../../utils/saveResponse.js";

export async function fetchRestaurantInfo(query) {
	const placeData = await searchPlaceById(query);

	if (!placeData || !placeData.placeUrlId) {
		throw new Error("Restaurant not found");
	}

	const placeUrl = getPlaceUrl(placeData.placeUrlId);
	const reviewPhotos = await fetchRestaurantReviewPhotos(placeUrl, 6);

	return {
		query,
		placeUrlId: placeData.placeUrlId,
		placePhoto: placeData.placePhoto,
		reviewPhotos: reviewPhotos,
	};
}

async function fetchRestaurantReviewPhotos(placeUrl, limit = 6) {
	const reviewsData = await scraper(placeUrl, { sort_type: "relevant", pages: "1", clean: true });
	if (!reviewsData || reviewsData === 0) {
		return [];
	}

	const reviewPhotos = [];
	for (const review of reviewsData) {
		if (review.photos) {
			for (const img of review.photos) {
				if (img.url && reviewPhotos.length < limit) {
					reviewPhotos.push(img.url);
				}
				if (reviewPhotos.length >= limit) break;
			}
		}
		if (reviewPhotos.length >= limit) break;
	}
	return reviewPhotos;
}

export async function fetchRestaurantReviews(query) {
	const placeUrl = getPlaceUrl(query);
	const reviews = await scraper(placeUrl, { sort_type: "relevant", pages: "3", clean: true });

	if (reviews === 0 || reviews.length === 0) {
		return {
			query,
			placeUrl,
			totalReviewsAnalyzed: 0,
			reviews: [],
		};
	}

	return {
		query,
		placeUrl,
		totalReviewsAnalyzed: reviews.length,
		reviews: reviews,
	};
}

export async function analyzePopularDishes(reviews, geminiModel) {
	if (!reviews || reviews.length === 0) {
		return { popularDishes: [] };
	}
	const formattedReviews = JSON.stringify(reviews);

	try {
		const modelConfig = getPopularDishesModelConfig(geminiModel.model);
		const responseText = await geminiModel.runModel(modelConfig, formattedReviews);

		try {
			const result = JSON.parse(responseText);
			return result;
		} catch (error) {
			console.error("Error parsing AI response:", error);
			return { popularDishes: [] };
		}
	} catch (error) {
		console.error("Error during analysis:", error.message);
		return { popularDishes: [] };
	}
}
