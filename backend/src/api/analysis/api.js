import { OpenAPIHono } from "@hono/zod-openapi";
import { GeminiModel } from "../../ai-providers/gemini/provider.js";
import settings from "../../core/config.js";
import { popularDishesEndpointDefinition } from "./openapi.js";
import { AnalysisErrorResponseSchema, PopularDishesResponseSchema } from "./schemas.js";
import { analyzePopularDishes, fetchRestaurantReviews } from "./service.js";

const analysisRouter = new OpenAPIHono();

const geminiModel = new GeminiModel(settings.AI_MODEL, settings.AI_API_KEY);

analysisRouter.use("*", async (c, next) => {
	c.set("geminiModel", geminiModel);
	await next();
});

analysisRouter.openapi(popularDishesEndpointDefinition, async (c) => {
	const { query } = c.req.valid("query");
	const geminiModel = c.get("geminiModel");

	try {
		const reviewsData = await fetchRestaurantReviews(query);
		const filteredReviews = reviewsData.reviews.map(({ review_id, review }) => ({ review_id, review }));
		const analysisResult = await analyzePopularDishes(filteredReviews, geminiModel);
		return c.json(
			PopularDishesResponseSchema.parse({
				success: true,
				query,
				totalReviewsAnalyzed: reviewsData.totalReviewsAnalyzed,
				popularDishes: analysisResult.popularDishes,
			}),
			200,
		);
	} catch (error) {
		console.log(error);
		return c.json(
			AnalysisErrorResponseSchema.parse({
				success: false,
				query,
				error: error.message,
			}),
			error.status || 500,
		);
	}
});

export default analysisRouter;
