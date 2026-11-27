import { Router } from "express";
import { controllerGetSettlementEntriesRecord, controllerListSettlementEntries } from "./controller.js";

export function factorySettlementEntriesRouter(): Router {
  const router = Router();
  router.get("/", controllerListSettlementEntries);
  router.get("/:recordId", controllerGetSettlementEntriesRecord);
  return router;
}
