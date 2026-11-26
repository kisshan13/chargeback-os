import { Router } from "express";
import {
  controllerGetChargebackDashboard,
  controllerGetChargebackDispute,
  controllerGetChargebackDisputes
} from "./controller.js";

export function factoryChargebacksRouter(): Router {
  const router = Router();

  router.get("/", controllerGetChargebackDashboard);
  router.get("/disputes", controllerGetChargebackDisputes);
  router.get("/disputes/:disputeId", controllerGetChargebackDispute);

  return router;
}
