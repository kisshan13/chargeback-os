import { Router } from "express";
import { controllerGetResolutionsRecord, controllerListResolutions } from "./controller.js";

export function factoryResolutionsRouter(): Router {
  const router = Router();
  router.get("/", controllerListResolutions);
  router.get("/:recordId", controllerGetResolutionsRecord);
  return router;
}
