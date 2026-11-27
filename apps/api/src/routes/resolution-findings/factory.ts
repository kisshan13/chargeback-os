import { Router } from "express";
import { controllerGetResolutionFindingsRecord, controllerListResolutionFindings } from "./controller.js";

export function factoryResolutionFindingsRouter(): Router {
  const router = Router();
  router.get("/", controllerListResolutionFindings);
  router.get("/:recordId", controllerGetResolutionFindingsRecord);
  return router;
}
