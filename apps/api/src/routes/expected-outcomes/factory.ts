import { Router } from "express";
import { controllerGetExpectedOutcomesRecord, controllerListExpectedOutcomes } from "./controller.js";

export function factoryExpectedOutcomesRouter(): Router {
  const router = Router();
  router.get("/", controllerListExpectedOutcomes);
  router.get("/:recordId", controllerGetExpectedOutcomesRecord);
  return router;
}
