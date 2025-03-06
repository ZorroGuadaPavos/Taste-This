import { OpenAPIHono } from "@hono/zod-openapi";
import { popularDishesEndpointDefinition } from "./openapi.js";
import { AnalysisErrorResponseSchema, PopularDishesResponseSchema } from "./schemas.js";
import { fetchAndAnalyzePopularDishes } from "./service.js";

const analysisRouter = new OpenAPIHono();

analysisRouter.openapi(popularDishesEndpointDefinition, async (c) => {
	const { query } = c.req.valid("query");
	let result;

	try {
		result = await fetchAndAnalyzePopularDishes(query);
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

	return c.json(
		PopularDishesResponseSchema.parse({
			success: true,
			query,
			totalReviewsAnalyzed: result.totalReviewsAnalyzed,
			popularDishes: result.popularDishes,
		}),
		200,
	);
});

export default analysisRouter;
