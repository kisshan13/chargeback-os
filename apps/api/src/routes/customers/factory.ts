import { Router } from "express";
import { controllerGetCustomerOverview, controllerGetCustomersRecord, controllerListCustomers } from "./controller.js";

export function factoryCustomersRouter(): Router {
  const router = Router();
  router.get("/", controllerListCustomers);
  router.get("/:recordId/overview", controllerGetCustomerOverview);
  router.get("/:recordId", controllerGetCustomersRecord);
  return router;
}
