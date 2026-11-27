import { Router } from "express";
import { controllerGetReturnsRecord, controllerListReturns } from "./controller.js";

export function factoryReturnsRouter(): Router {
  const router = Router();
  router.get("/", controllerListReturns);
  router.get("/:recordId", controllerGetReturnsRecord);
  return router;
}
