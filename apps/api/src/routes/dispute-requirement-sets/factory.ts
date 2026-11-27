import { Router } from "express";
import { controllerGetDisputeRequirementSetsRecord, controllerListDisputeRequirementSets } from "./controller.js";

export function factoryDisputeRequirementSetsRouter(): Router {
  const router = Router();
  router.get("/", controllerListDisputeRequirementSets);
  router.get("/:recordId", controllerGetDisputeRequirementSetsRecord);
  return router;
}
