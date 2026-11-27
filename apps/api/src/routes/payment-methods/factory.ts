import { Router } from "express";
import { controllerGetPaymentMethodsRecord, controllerListPaymentMethods } from "./controller.js";

export function factoryPaymentMethodsRouter(): Router {
  const router = Router();
  router.get("/", controllerListPaymentMethods);
  router.get("/:recordId", controllerGetPaymentMethodsRecord);
  return router;
}
