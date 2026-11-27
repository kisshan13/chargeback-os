import { Router } from "express";
import { controllerGetDisputeRequirementsRecord, controllerListDisputeRequirements } from "./controller.js";

export function factoryDisputeRequirementsRouter(): Router {
  const router = Router();
  router.get("/", controllerListDisputeRequirements);
  router.get("/:recordId", controllerGetDisputeRequirementsRecord);
  return router;
}
