import { Router } from "express";
import { controllerGetShipmentEventsRecord, controllerListShipmentEvents } from "./controller.js";

export function factoryShipmentEventsRouter(): Router {
  const router = Router();
  router.get("/", controllerListShipmentEvents);
  router.get("/:recordId", controllerGetShipmentEventsRecord);
  return router;
}
