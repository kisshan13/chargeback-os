import { Router } from "express";
import { controllerGetRefundsRecord, controllerListRefunds } from "./controller.js";

export function factoryRefundsRouter(): Router {
  const router = Router();
  router.get("/", controllerListRefunds);
  router.get("/:recordId", controllerGetRefundsRecord);
  return router;
}
