import { Router } from "express";
import { controllerGetDisputeReasonCodesRecord, controllerListDisputeReasonCodes } from "./controller.js";

export function factoryDisputeReasonCodesRouter(): Router {
  const router = Router();
  router.get("/", controllerListDisputeReasonCodes);
  router.get("/:recordId", controllerGetDisputeReasonCodesRecord);
  return router;
}
