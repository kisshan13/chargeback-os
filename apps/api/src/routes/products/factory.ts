import { Router } from "express";
import { controllerGetProductOverview, controllerGetProductsRecord, controllerListProducts } from "./controller.js";

export function factoryProductsRouter(): Router {
  const router = Router();
  router.get("/", controllerListProducts);
  router.get("/:recordId/overview", controllerGetProductOverview);
  router.get("/:recordId", controllerGetProductsRecord);
  return router;
}
