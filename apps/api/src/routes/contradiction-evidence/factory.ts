import { Router } from "express";
import { controllerGetContradictionEvidenceRecord, controllerListContradictionEvidence } from "./controller.js";

export function factoryContradictionEvidenceRouter(): Router {
  const router = Router();
  router.get("/", controllerListContradictionEvidence);
  router.get("/:recordId", controllerGetContradictionEvidenceRecord);
  return router;
}
