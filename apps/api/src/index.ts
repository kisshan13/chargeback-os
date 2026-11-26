import "./config/env.js";
import "./lib/chargeback-runtime.js";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env, corsOrigins } from "./config/env.js";
import { createOpenApiDocument } from "./openapi/document.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import { chargebackEventsRoutes, chargebacksRoutes, exampleRoutes } from "./routes/index.js";

const app: Express = express();

app.set("trust proxy", 1);
app.use(loggerMiddleware);
app.use(helmet());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/openapi.json", (_req, res) => {
  res.json(createOpenApiDocument());
});

app.use("/api/v1/example", exampleRoutes);
app.use("/api/v1/chargebacks/events", chargebackEventsRoutes);
app.use("/api/v1/chargebacks", chargebacksRoutes);
app.use(errorMiddleware);

if (env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

export default app;
