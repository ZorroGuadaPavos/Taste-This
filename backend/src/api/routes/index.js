import { OpenAPIHono } from "@hono/zod-openapi";
import analysisRouter from "../analysis/api.js";

const apiRouter = new OpenAPIHono();

apiRouter.route("/analysis", analysisRouter);

export default apiRouter;
