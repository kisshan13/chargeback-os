import { Router } from "express";
import { controllerGetAddressesRecord, controllerListAddresses } from "./controller.js";

export function factoryAddressesRouter(): Router {
  const router = Router();
  router.get("/", controllerListAddresses);
  router.get("/:recordId", controllerGetAddressesRecord);
  return router;
}
