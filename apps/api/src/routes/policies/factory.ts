import { Router } from "express";
import { controllerGetPoliciesRecord, controllerGetPolicyOverview, controllerListPolicies } from "./controller.js";

export function factoryPoliciesRouter(): Router {
  const router = Router();
  router.get("/", controllerListPolicies);
  router.get("/:recordId/overview", controllerGetPolicyOverview);
  router.get("/:recordId", controllerGetPoliciesRecord);
  return router;
}
