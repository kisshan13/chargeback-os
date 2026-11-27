import { Router } from "express";
import { controllerGetFindingEvidenceRecord, controllerListFindingEvidence } from "./controller.js";

export function factoryFindingEvidenceRouter(): Router {
  const router = Router();
  router.get("/", controllerListFindingEvidence);
  router.get("/:recordId", controllerGetFindingEvidenceRecord);
  return router;
}
