import { Router } from "express";
import { controllerGetSourceSystemsRecord, controllerListSourceSystems } from "./controller.js";

export function factorySourceSystemsRouter(): Router {
  const router = Router();
  router.get("/", controllerListSourceSystems);
  router.get("/:recordId", controllerGetSourceSystemsRecord);
  return router;
}
