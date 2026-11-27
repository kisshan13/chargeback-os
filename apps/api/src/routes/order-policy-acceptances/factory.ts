import { Router } from "express";
import { controllerGetOrderPolicyAcceptancesRecord, controllerListOrderPolicyAcceptances } from "./controller.js";

export function factoryOrderPolicyAcceptancesRouter(): Router {
  const router = Router();
  router.get("/", controllerListOrderPolicyAcceptances);
  router.get("/:recordId", controllerGetOrderPolicyAcceptancesRecord);
  return router;
}
