import { createRoute } from "@hono/zod-openapi";
import {
	DishesResponseSchema,
	ErrorResponseSchema,
	RestaurantIdRequestSchema,
	RestaurantInfoResponseSchema,
} from "./schemas.js";

export const restaurantEndpointDefinition = createRoute({
	method: "get",
	path: "/",
	tags: ["restaurants"],
	summary: "Get place URL from query",
	description: "Returns the Google Maps URL for a place based on the query",
	request: {
		query: RestaurantIdRequestSchema,
	},
	responses: {
		200: {
			description: "Place URL found successfully",
			content: {
				"application/json": {
					schema: RestaurantInfoResponseSchema,
				},
			},
		},
		400: {
			description: "Bad request or URL not found",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
		500: {
			description: "Server error",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});

export const restaurantDishesEndpointDefinition = createRoute({
	method: "get",
	path: "/dishes",
	tags: ["restaurants"],
	summary: "Find popular dishes from restaurant reviews",
	description: "Analyzes restaurant reviews to identify the most popular dishes mentioned",
	request: {
		query: RestaurantIdRequestSchema,
	},
	responses: {
		200: {
			description: "Popular dishes analysis completed successfully",
			content: {
				"application/json": {
					schema: DishesResponseSchema,
				},
			},
		},
		400: {
			description: "Bad request or analysis error",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
		500: {
			description: "Server error",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});
