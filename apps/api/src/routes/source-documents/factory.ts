import { Router } from "express";
import { controllerGetSourceDocumentsRecord, controllerListSourceDocuments } from "./controller.js";

export function factorySourceDocumentsRouter(): Router {
  const router = Router();
  router.get("/", controllerListSourceDocuments);
  router.get("/:recordId", controllerGetSourceDocumentsRecord);
  return router;
}
