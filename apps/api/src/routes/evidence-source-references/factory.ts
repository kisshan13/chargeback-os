import { Router } from "express";
import { controllerGetEvidenceSourceReferencesRecord, controllerListEvidenceSourceReferences } from "./controller.js";

export function factoryEvidenceSourceReferencesRouter(): Router {
  const router = Router();
  router.get("/", controllerListEvidenceSourceReferences);
  router.get("/:recordId", controllerGetEvidenceSourceReferencesRecord);
  return router;
}
