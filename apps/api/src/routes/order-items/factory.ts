import { Router } from "express";
import { controllerGetOrderItemsRecord, controllerListOrderItems } from "./controller.js";

export function factoryOrderItemsRouter(): Router {
  const router = Router();
  router.get("/", controllerListOrderItems);
  router.get("/:recordId", controllerGetOrderItemsRecord);
  return router;
}
