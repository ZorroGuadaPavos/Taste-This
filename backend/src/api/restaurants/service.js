import { getPopularDishesModelConfig } from "../../ai-providers/gemini/config.js";
import { reviews_scraper } from "../../scraper/index.js";
import parsePlace from "../../scraper/parsers/place.js";
import { fetchPlaceData } from "../../scraper/public_endpoints/place.js";
import { getFeatureID, getPlaceIds } from "../../scraper/searchPlaceById.js";
import { saveResponseData } from "../../utils/saveResponse.js";

export async function fetchRestaurants(restaurantName) {
	try {
		const placeIdsResult = await getPlaceIds(restaurantName);
		if (!placeIdsResult.success) {
			return { success: false, error: placeIdsResult.error || "Failed to retrieve place IDs" };
		}

		const placeIds = placeIdsResult.placeIds;

		const restaurantsData = await Promise.all(
			placeIds.slice(0, 5).map(async (placeId) => {
				try {
					const featureId = await getFeatureID(placeId);
					if (!featureId) {
						console.warn(`Feature ID not found for place ID: ${placeId}`);
						return null;
					}
					const placeData = await fetchPlaceData(featureId);
					const parsedData = await parsePlace(placeData);
					// saveResponseData(parsedData, "PlaceData");
					return parsedData;
				} catch (error) {
					console.error(`Error processing place ID ${placeId}:`, error.message);
					return null;
				}
			}),
		);

		const filteredRestaurants = restaurantsData.filter((data) => data !== null);

		return {
			success: true,
			restaurants: filteredRestaurants,
		};
	} catch (error) {
		console.error("Failed to fetch restaurants:", error.message);
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
