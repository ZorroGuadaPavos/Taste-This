import { z } from "zod";

const PopularDishesRequestSchema = z.object({
	query: z.string().describe("identifier of the restaurant"),
});

const DishSchema = z.object({
	name: z.string().describe("Name of the dish"),
	mentions: z.number().describe("Number of mentions in reviews"),
	rating: z.number().describe("Average rating for this dish (0-5)"),
	sentimentScore: z.number().min(-1).max(1).describe("Sentiment score for this dish"),
	reviewExcerpts: z.array(z.string()).describe("Excerpts from reviews mentioning this dish"),
});

const PopularDishesResponseSchema = z.object({
	success: z.boolean(),
	query: z.string(),
	totalReviewsAnalyzed: z.number(),
	popularDishes: z.array(DishSchema),
});

const AnalysisErrorResponseSchema = z.object({
	success: z.boolean(),
	query: z.string(),
	error: z.string(),
});

export { PopularDishesRequestSchema, PopularDishesResponseSchema, DishSchema, AnalysisErrorResponseSchema };
