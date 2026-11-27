import { Router } from "express";
import { controllerGetDisputeItemsRecord, controllerListDisputeItems } from "./controller.js";

export function factoryDisputeItemsRouter(): Router {
  const router = Router();
  router.get("/", controllerListDisputeItems);
  router.get("/:recordId", controllerGetDisputeItemsRecord);
  return router;
}
