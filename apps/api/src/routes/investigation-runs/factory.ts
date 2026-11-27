import { Router } from "express";
import { controllerGetInvestigationRunsRecord, controllerListInvestigationRuns } from "./controller.js";

export function factoryInvestigationRunsRouter(): Router {
  const router = Router();
  router.get("/", controllerListInvestigationRuns);
  router.get("/:recordId", controllerGetInvestigationRunsRecord);
  return router;
}
