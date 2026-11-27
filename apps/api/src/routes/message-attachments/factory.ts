import { Router } from "express";
import { controllerGetMessageAttachmentsRecord, controllerListMessageAttachments } from "./controller.js";

export function factoryMessageAttachmentsRouter(): Router {
  const router = Router();
  router.get("/", controllerListMessageAttachments);
  router.get("/:recordId", controllerGetMessageAttachmentsRecord);
  return router;
}
