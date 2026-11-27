import { Router } from "express";
import { controllerGetDigitalFulfillmentEventsRecord, controllerListDigitalFulfillmentEvents } from "./controller.js";

export function factoryDigitalFulfillmentEventsRouter(): Router {
  const router = Router();
  router.get("/", controllerListDigitalFulfillmentEvents);
  router.get("/:recordId", controllerGetDigitalFulfillmentEventsRecord);
  return router;
}
