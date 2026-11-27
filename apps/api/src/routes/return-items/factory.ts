import { Router } from "express";
import { controllerGetReturnItemsRecord, controllerListReturnItems } from "./controller.js";

export function factoryReturnItemsRouter(): Router {
  const router = Router();
  router.get("/", controllerListReturnItems);
  router.get("/:recordId", controllerGetReturnItemsRecord);
  return router;
}
