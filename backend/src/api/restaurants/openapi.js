import { createRoute } from "@hono/zod-openapi";
import {
	DishesResponseSchema,
	ErrorResponseSchema,
	RestaurantIdRequestSchema,
	RestaurantsResponseSchema,
} from "./schemas.js";

export const restaurantEndpointDefinition = createRoute({
	method: "get",
	path: "/",
	tags: ["restaurants"],
	summary: "Get restaurants matching query",
	description: "Returns a list of restaurants matching the search query",
	request: {
		query: RestaurantIdRequestSchema,
	},
	responses: {
		200: {
			description: "Restaurants found successfully",
			content: {
				"application/json": {
					schema: RestaurantsResponseSchema,
				},
			},
		},
		400: {
			description: "Bad request or no restaurants found",
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
