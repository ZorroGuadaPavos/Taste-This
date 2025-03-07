import { getPopularDishesModelConfig } from "../../ai-providers/gemini/config.js";
import { scraper } from "../../scraper/index.js";
import { searchPlaceById } from "../../scraper/searchPlaceById.js";
// import { saveResponseData } from "../../utils/saveResponse.js";

export async function fetchRestaurantReviews(query) {
	const placeUrl = await searchPlaceById(query);
	const reviews = await scraper(placeUrl, { sort_type: "relevant", pages: "3", clean: true });
	saveResponseData({ query, placeUrl, reviewsLength: reviews.length, reviews }, "reviews");

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
			// saveResponseData({ result }, "result");
			return result;
		} catch (error) {
			console.error("Error parsing AI response:", error);
			console.log("Raw response:", responseText);
			return { popularDishes: [] };
		}
	} catch (error) {
		console.error("Error during analysis:", error.message);
		return { popularDishes: [] };
	}
}
