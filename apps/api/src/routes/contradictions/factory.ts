import { Router } from "express";
import { controllerGetContradictionsRecord, controllerListContradictions } from "./controller.js";

export function factoryContradictionsRouter(): Router {
  const router = Router();
  router.get("/", controllerListContradictions);
  router.get("/:recordId", controllerGetContradictionsRecord);
  return router;
}
