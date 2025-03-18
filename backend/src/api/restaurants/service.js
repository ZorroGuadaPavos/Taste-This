import { getPopularDishesModelConfig } from "../../ai-providers/gemini/config.js";
import { scraper } from "../../scraper/index.js";
import { getPlaceUrl, searchPlaceById } from "../../scraper/searchPlaceById.js";
import { saveResponseData } from "../../utils/saveResponse.js";

export async function fetchRestaurantInfo(query) {
	const placeData = await searchPlaceById(query);

	if (!placeData || !placeData.placeUrlId) {
		throw new Error("Restaurant not found");
	}

	const placeUrl = getPlaceUrl(placeData.placeUrlId);
	console.log(`Fetching restaurant data from: ${placeUrl}`);

	// Fetch reviews with highest rated images
	const reviewsData = await scraper(placeUrl, {
		sort_type: "highest_rating",
		pages: "1",
		clean: true, // Parse the reviews to get a cleaner structure
	});

	// Extract up to 5 images from the reviews
	const images = filterImages(reviewsData);
	console.log(`Found ${images.length} images for restaurant`);

	return {
		query,
		placeUrlId: placeData.placeUrlId,
		mainImage: placeData.imageUrl,
		images,
	};
}

// Helper function to extract and filter images from scraped data
function filterImages(imagesData) {
	if (!imagesData) {
		return [];
	}

	const imageUrls = [];

	if (Array.isArray(imagesData) && imagesData.length > 0) {
		for (const review of imagesData) {
			if (review.images) {
				for (const img of review.images) {
					if (img.url && typeof img.url === "string" && imageUrls.length < 6) {
						imageUrls.push(img.url);
					}
				}
			}
		}
	}
	return imageUrls;
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
			// saveResponseData({ result }, "result");
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
