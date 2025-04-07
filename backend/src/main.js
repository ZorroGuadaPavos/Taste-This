import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRouter from "./api/routes/index.js";
import settings from "./core/config.js";

const app = new Hono();

if (settings.BACKEND_CORS_ORIGINS.length > 0) {
	app.use(
		"*",
		cors({
			origin: settings.BACKEND_CORS_ORIGINS,
			allowMethods: ["GET", "POST"],
		}),
	);
}

app.route(settings.API_V1_STR, apiRouter);

app.get("/docs", swaggerUI({ url: `${settings.API_V1_STR}/openapi.json` }));

app.get(`${settings.API_V1_STR}/openapi.json`, (c) => {
	return c.json(
		apiRouter.getOpenAPIDocument({
			openapi: "3.0.0",
			info: {
				title: "Google Maps Reviews API",
				version: "1.0.0",
				description: "API for scraping reviews from Google Maps",
			},
			servers: [
				{
					url: settings.API_V1_STR,
					description: "API v1",
				},
			],
		}),
	);
});

export default {
	port: settings.PORT,
	fetch: app.fetch,
};
