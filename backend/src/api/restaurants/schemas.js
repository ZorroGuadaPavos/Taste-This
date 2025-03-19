import { z } from "zod";

const RestaurantIdRequestSchema = z.object({
	query: z.string().describe("identifier of the restaurant"),
});

const DishSchema = z.object({
	name: z.string().describe("Name of the dish"),
	mentions: z.number().describe("Number of mentions in reviews"),
	rating: z.number().describe("Average rating for this dish (0-5)"),
	sentimentScore: z.number().min(-1).max(1).describe("Sentiment score for this dish"),
	reviewExcerpts: z.array(z.string()).describe("Excerpts from reviews mentioning this dish"),
});

const DishesResponseSchema = z.object({
	success: z.boolean(),
	totalReviewsAnalyzed: z.number(),
	popularDishes: z.array(DishSchema),
});

const RestaurantInfoResponseSchema = z.object({
	success: z.boolean(),
	placeUrlId: z.string(),
	placePhoto: z.string().nullable(),
	reviewPhotos: z.array(z.string()).default([]),
});

const ErrorResponseSchema = z.object({
	success: z.boolean(),
	error: z.string(),
});

export {
	RestaurantIdRequestSchema,
	DishesResponseSchema,
	RestaurantInfoResponseSchema,
	ErrorResponseSchema,
	DishSchema,
};
