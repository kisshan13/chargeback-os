import { Router } from "express";
import { controllerGetPolicyClausesRecord, controllerListPolicyClauses } from "./controller.js";

export function factoryPolicyClausesRouter(): Router {
  const router = Router();
  router.get("/", controllerListPolicyClauses);
  router.get("/:recordId", controllerGetPolicyClausesRecord);
  return router;
}
