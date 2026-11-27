import { Router } from "express";
import { controllerGetEvidenceRequestsRecord, controllerListEvidenceRequests } from "./controller.js";

export function factoryEvidenceRequestsRouter(): Router {
  const router = Router();
  router.get("/", controllerListEvidenceRequests);
  router.get("/:recordId", controllerGetEvidenceRequestsRecord);
  return router;
}
