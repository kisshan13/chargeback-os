import { Router } from "express";
import { controllerGetChargebackEventsStream } from "./controller.js";

export function factoryChargebackEventsRouter(): Router {
  const router = Router();

  router.get("/stream", controllerGetChargebackEventsStream);

  return router;
}
