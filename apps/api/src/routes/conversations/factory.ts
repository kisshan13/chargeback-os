import { Router } from "express";
import { controllerGetConversationsRecord, controllerListConversations } from "./controller.js";

export function factoryConversationsRouter(): Router {
  const router = Router();
  router.get("/", controllerListConversations);
  router.get("/:recordId", controllerGetConversationsRecord);
  return router;
}
