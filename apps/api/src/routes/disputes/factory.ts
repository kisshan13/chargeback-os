import { Router } from "express";
import { controllerCreateDispute, controllerDecideDisputeApproval, controllerGetDisputeOverview, controllerGetDisputeRun, controllerGetDisputesRecord, controllerListDisputes, controllerStartDisputeDemoRun } from "./controller.js";

export function factoryDisputesRouter(): Router {
  const router = Router();
  router.get("/", controllerListDisputes);
  router.post("/demo-runs", controllerStartDisputeDemoRun);
  router.post("/", controllerCreateDispute);
  router.get("/:recordId/overview", controllerGetDisputeOverview);
  router.get("/:recordId/run", controllerGetDisputeRun);
  router.post("/:recordId/approvals/:approvalId", controllerDecideDisputeApproval);
  router.get("/:recordId", controllerGetDisputesRecord);
  return router;
}
