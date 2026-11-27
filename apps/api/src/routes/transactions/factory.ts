import { Router } from "express";
import { controllerGetTransactionsRecord, controllerListTransactions } from "./controller.js";

export function factoryTransactionsRouter(): Router {
  const router = Router();
  router.get("/", controllerListTransactions);
  router.get("/:recordId", controllerGetTransactionsRecord);
  return router;
}
