import { Router } from "express";
import { controllerGetDisputeEventsRecord, controllerListDisputeEvents } from "./controller.js";

export function factoryDisputeEventsRouter(): Router {
  const router = Router();
  router.get("/", controllerListDisputeEvents);
  router.get("/:recordId", controllerGetDisputeEventsRecord);
  return router;
}
