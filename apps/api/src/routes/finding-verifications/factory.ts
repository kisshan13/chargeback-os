import { Router } from "express";
import { controllerGetFindingVerificationsRecord, controllerListFindingVerifications } from "./controller.js";

export function factoryFindingVerificationsRouter(): Router {
  const router = Router();
  router.get("/", controllerListFindingVerifications);
  router.get("/:recordId", controllerGetFindingVerificationsRecord);
  return router;
}
