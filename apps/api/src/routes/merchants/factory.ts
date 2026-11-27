import { Router } from "express";
import { controllerGetMerchantsRecord, controllerListMerchants } from "./controller.js";

export function factoryMerchantsRouter(): Router {
  const router = Router();
  router.get("/", controllerListMerchants);
  router.get("/:recordId", controllerGetMerchantsRecord);
  return router;
}
