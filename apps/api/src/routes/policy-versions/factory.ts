import { Router } from "express";
import { controllerGetPolicyVersionsRecord, controllerListPolicyVersions } from "./controller.js";

export function factoryPolicyVersionsRouter(): Router {
  const router = Router();
  router.get("/", controllerListPolicyVersions);
  router.get("/:recordId", controllerGetPolicyVersionsRecord);
  return router;
}
