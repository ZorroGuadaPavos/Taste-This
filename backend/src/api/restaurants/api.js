import { OpenAPIHono } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { GeminiModel } from "../../ai-providers/gemini/provider.js";

import settings from "../../core/config.js";

import { createRecaptchaMiddleware } from "../../middleware/recaptcha.js";

import { RecaptchaHeaderSchema, restaurantDishesEndpointDefinition, restaurantEndpointDefinition } from "./openapi.js";
import {
	DishesResponseSchema,
	ErrorResponseSchema,
	RestaurantIdRequestSchema,
	RestaurantsResponseSchema,
} from "./schemas.js";
import { analyzePopularDishes, fetchRestaurantReviews, fetchRestaurants } from "./service.js";

const RestaurantRouter = new OpenAPIHono();

const geminiModel = new GeminiModel(settings.AI_MODEL, settings.AI_API_KEY);

RestaurantRouter.use("*", async (c, next) => {
	c.set("geminiModel", geminiModel);
	await next();
});

RestaurantRouter.use(
	"/",
	zValidator("query", RestaurantIdRequestSchema),
	zValidator("header", RecaptchaHeaderSchema),
	createRecaptchaMiddleware("search_restaurants"),
);

RestaurantRouter.openapi(restaurantEndpointDefinition, async (c) => {
	const { query } = c.req.valid("query");

	try {
		const restaurantData = await fetchRestaurants(query);

		if (!restaurantData.success) {
			return c.json(
				ErrorResponseSchema.parse({
					success: false,
					error: restaurantData.error,
				}),
				400,
			);
		}

		return c.json(RestaurantsResponseSchema.parse(restaurantData), 200);
	} catch (error) {
		console.log(error);
		return c.json(
			ErrorResponseSchema.parse({
				success: false,
				query,
				error: error.message,
			}),
			error.status || 500,
		);
	}
});

RestaurantRouter.use(
	"/dishes",
	zValidator("query", RestaurantIdRequestSchema),
	zValidator("header", RecaptchaHeaderSchema),
	createRecaptchaMiddleware("select_restaurant"),
);

RestaurantRouter.openapi(restaurantDishesEndpointDefinition, async (c) => {
	const { query } = c.req.valid("query");
	const geminiModel = c.get("geminiModel");

	try {
		const reviewsData = await fetchRestaurantReviews(query);

		if (!reviewsData || !Array.isArray(reviewsData.reviews) || reviewsData.reviews.length === 0) {
			return c.json(
				DishesResponseSchema.parse({
					success: true,
					totalReviewsAnalyzed: 0,
					popularDishes: [],
				}),
				200,
			);
		}

		const filteredReviews = reviewsData.reviews.map(({ review_id, review_text }) => ({ review_id, review_text }));
		const analysisResult = await analyzePopularDishes(filteredReviews, geminiModel);
		const popularDishes = analysisResult?.popularDishes || [];

		return c.json(
			DishesResponseSchema.parse({
				success: true,
				totalReviewsAnalyzed: reviewsData.totalReviewsAnalyzed,
				popularDishes: popularDishes,
			}),
			200,
		);
	} catch (error) {
		console.error("Error in /dishes endpoint:", error);
		return c.json(
			ErrorResponseSchema.parse({
				success: false,
				error: "An internal error occurred while analyzing dishes.",
			}),
			error.status || 500,
		);
	}
});

export default RestaurantRouter;
