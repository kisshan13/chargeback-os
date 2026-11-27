import { Router } from "express";
import { controllerGetRefundTransactionsRecord, controllerListRefundTransactions } from "./controller.js";

export function factoryRefundTransactionsRouter(): Router {
  const router = Router();
  router.get("/", controllerListRefundTransactions);
  router.get("/:recordId", controllerGetRefundTransactionsRecord);
  return router;
}
