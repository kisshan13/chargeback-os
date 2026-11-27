import { Router } from "express";
import { controllerGetPaymentOverview, controllerGetPaymentsRecord, controllerListPayments } from "./controller.js";

export function factoryPaymentsRouter(): Router {
  const router = Router();
  router.get("/", controllerListPayments);
  router.get("/:recordId/overview", controllerGetPaymentOverview);
  router.get("/:recordId", controllerGetPaymentsRecord);
  return router;
}
