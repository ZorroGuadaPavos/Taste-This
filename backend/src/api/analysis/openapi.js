import { createRoute } from "@hono/zod-openapi";
import { AnalysisErrorResponseSchema, PopularDishesRequestSchema, PopularDishesResponseSchema } from "./schemas.js";

export const popularDishesEndpointDefinition = createRoute({
  method: "get",
  path: "/",
  tags: ["analysis"],
  summary: "Find popular dishes from restaurant reviews",
  description: "Analyzes restaurant reviews to identify the most popular dishes mentioned",
  request: {
    query: PopularDishesRequestSchema,
  },
  responses: {
    200: {
      description: "Popular dishes analysis completed successfully",
      content: {
        "application/json": {
          schema: PopularDishesResponseSchema,
        },
      },
    },
    400: {
      description: "Bad request or analysis error",
      content: {
        "application/json": {
          schema: AnalysisErrorResponseSchema,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: AnalysisErrorResponseSchema,
        },
      },
    },
  },
});
