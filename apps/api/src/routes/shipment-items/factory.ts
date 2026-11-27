import { Router } from "express";
import { controllerGetShipmentItemsRecord, controllerListShipmentItems } from "./controller.js";

export function factoryShipmentItemsRouter(): Router {
  const router = Router();
  router.get("/", controllerListShipmentItems);
  router.get("/:recordId", controllerGetShipmentItemsRecord);
  return router;
}
