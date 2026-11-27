import { Router } from "express";
import { controllerGetShipmentsRecord, controllerListShipments } from "./controller.js";

export function factoryShipmentsRouter(): Router {
  const router = Router();
  router.get("/", controllerListShipments);
  router.get("/:recordId", controllerGetShipmentsRecord);
  return router;
}
