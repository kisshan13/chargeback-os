import { Router } from "express";
import { controllerGetFindingsRecord, controllerListFindings } from "./controller.js";

export function factoryFindingsRouter(): Router {
  const router = Router();
  router.get("/", controllerListFindings);
  router.get("/:recordId", controllerGetFindingsRecord);
  return router;
}
