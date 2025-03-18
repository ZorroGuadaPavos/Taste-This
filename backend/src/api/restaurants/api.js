import { OpenAPIHono } from "@hono/zod-openapi";
import { GeminiModel } from "../../ai-providers/gemini/provider.js";
import settings from "../../core/config.js";
import { restaurantDishesEndpointDefinition, restaurantEndpointDefinition } from "./openapi.js";
import {
	RestaurantDishesResponseSchema,
	RestaurantErrorResponseSchema,
	RestaurantUrlResponseSchema,
} from "./schemas.js";
import { analyzePopularDishes, fetchPlaceUrl, fetchRestaurantReviews } from "./service.js";

const RestaurantRouter = new OpenAPIHono();

const geminiModel = new GeminiModel(settings.AI_MODEL, settings.AI_API_KEY);

RestaurantRouter.use("*", async (c, next) => {
	c.set("geminiModel", geminiModel);
	await next();
});

RestaurantRouter.openapi(restaurantEndpointDefinition, async (c) => {
	const { query } = c.req.valid("query");

	try {
		const { placeUrl, imageUrl } = await fetchPlaceUrl(query);
		return c.json(
			RestaurantUrlResponseSchema.parse({
				success: true,
				query,
				placeUrl,
				imageUrl,
			}),
			200,
		);
	} catch (error) {
		console.log(error);
		return c.json(
			RestaurantErrorResponseSchema.parse({
				success: false,
				query,
				error: error.message,
			}),
			error.status || 500,
		);
	}
});

RestaurantRouter.openapi(restaurantDishesEndpointDefinition, async (c) => {
	const { query } = c.req.valid("query");
	const geminiModel = c.get("geminiModel");

	try {
		const reviewsData = await fetchRestaurantReviews(query);
		const filteredReviews = reviewsData.reviews.map(({ review_id, review }) => ({ review_id, review }));
		const analysisResult = await analyzePopularDishes(filteredReviews, geminiModel);
		return c.json(
			RestaurantDishesResponseSchema.parse({
				success: true,
				totalReviewsAnalyzed: reviewsData.totalReviewsAnalyzed,
				popularDishes: analysisResult.popularDishes,
			}),
			200,
		);
	} catch (error) {
		console.log(error);
		return c.json(
			RestaurantErrorResponseSchema.parse({
				success: false,
				error: error.message,
			}),
			error.status || 500,
		);
	}
});
export default RestaurantRouter;
