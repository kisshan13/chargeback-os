import { Router } from "express";
import { controllerGetOrderOverview, controllerGetOrdersRecord, controllerListOrders } from "./controller.js";

export function factoryOrdersRouter(): Router {
  const router = Router();
  router.get("/", controllerListOrders);
  router.get("/:recordId/overview", controllerGetOrderOverview);
  router.get("/:recordId", controllerGetOrdersRecord);
  return router;
}
