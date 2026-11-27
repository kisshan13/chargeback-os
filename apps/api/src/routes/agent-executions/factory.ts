import { Router } from "express";
import { controllerGetAgentExecutionsRecord, controllerListAgentExecutions } from "./controller.js";

export function factoryAgentExecutionsRouter(): Router {
  const router = Router();
  router.get("/", controllerListAgentExecutions);
  router.get("/:recordId", controllerGetAgentExecutionsRecord);
  return router;
}
