import { Router } from "express";
import { controllerGetMessagesRecord, controllerListMessages } from "./controller.js";

export function factoryMessagesRouter(): Router {
  const router = Router();
  router.get("/", controllerListMessages);
  router.get("/:recordId", controllerGetMessagesRecord);
  return router;
}
