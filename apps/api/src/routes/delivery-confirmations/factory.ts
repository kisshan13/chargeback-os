import { Router } from "express";
import { controllerGetDeliveryConfirmationsRecord, controllerListDeliveryConfirmations } from "./controller.js";

export function factoryDeliveryConfirmationsRouter(): Router {
  const router = Router();
  router.get("/", controllerListDeliveryConfirmations);
  router.get("/:recordId", controllerGetDeliveryConfirmationsRecord);
  return router;
}
