import { Router } from "express";
import { controllerGetProductPricesRecord, controllerListProductPrices } from "./controller.js";

export function factoryProductPricesRouter(): Router {
  const router = Router();
  router.get("/", controllerListProductPrices);
  router.get("/:recordId", controllerGetProductPricesRecord);
  return router;
}
