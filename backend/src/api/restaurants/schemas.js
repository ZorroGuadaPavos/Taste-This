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

const RestaurantSchema = z.object({
	id: z.string().nullable(),
	name: z.string().nullable(),
	rating: z.number().nullable(),
	reviewCount: z.number().nullable(),
	categories: z.array(z.string()).nullable(),
	address: z.string().nullable(),
	priceLevel: z.string().nullable(),
	openNow: z.boolean(),
	phone: z.string().nullable(),
	website: z.string().nullable(),
	photos: z.array(z.string()),
	// videos: z.array(z.string()),
	accessibility: z.array(z.string()).nullable(),
});

const RestaurantsResponseSchema = z.object({
	success: z.boolean(),
	restaurants: z.array(RestaurantSchema),
	error: z.string().optional(),
});

const ErrorResponseSchema = z.object({
	success: z.boolean(),
	error: z.string(),
});

export {
	RestaurantIdRequestSchema,
	DishesResponseSchema,
	RestaurantsResponseSchema,
	ErrorResponseSchema,
	DishSchema,
	RestaurantSchema,
};
