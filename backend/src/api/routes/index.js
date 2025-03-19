import { OpenAPIHono } from "@hono/zod-openapi";
import restaurantsRouter from "../restaurants/api.js";

const apiRouter = new OpenAPIHono();

apiRouter.route("/restaurants", restaurantsRouter);

export default apiRouter;
