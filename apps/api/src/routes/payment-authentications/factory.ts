import { Router } from "express";
import { controllerGetPaymentAuthenticationsRecord, controllerListPaymentAuthentications } from "./controller.js";

export function factoryPaymentAuthenticationsRouter(): Router {
  const router = Router();
  router.get("/", controllerListPaymentAuthentications);
  router.get("/:recordId", controllerGetPaymentAuthenticationsRecord);
  return router;
}
