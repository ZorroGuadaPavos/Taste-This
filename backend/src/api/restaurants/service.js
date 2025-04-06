import { getPopularDishesModelConfig } from "../../ai-providers/gemini/config.js";
import { places_scraper, reviews_scraper } from "../../scraper/index.js";
import { saveResponseData } from "../../utils/saveResponse.js";

export async function fetchRestaurants(restaurantName) {
	try {
		const scrapeResult = await places_scraper(restaurantName, { limit: 5 });

		if (!scrapeResult.success) {
			return { success: false, error: scrapeResult.error };
		}

		return {
			success: true,
			restaurants: scrapeResult.places,
		};
	} catch (error) {
		console.error("Failed to fetch restaurants in service:", error.message);
		return { success: false, error: "Failed to fetch restaurants information" };
	}
}

export async function fetchRestaurantReviews(placeId) {
	const reviews = await reviews_scraper(placeId, { sort_type: "relevant", pages: "3", clean: true });
	if (!Array.isArray(reviews) || reviews.length === 0) {
		console.log(`No reviews found or invalid format from scraper for placeId: ${placeId}`);
		return {
			placeId,
			totalReviewsAnalyzed: 0,
			reviews: [],
		};
	}

	return {
		placeId,
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
