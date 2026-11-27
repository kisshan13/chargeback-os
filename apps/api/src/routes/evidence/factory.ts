import { Router } from "express";
import { controllerGetEvidenceRecord, controllerListEvidence } from "./controller.js";

export function factoryEvidenceRouter(): Router {
  const router = Router();
  router.get("/", controllerListEvidence);
  router.get("/:recordId", controllerGetEvidenceRecord);
  return router;
}
