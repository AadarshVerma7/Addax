import { Router } from "express";
import ContactController from "../controllers/contact.controller.js";

const router = Router();

router.post("/", ContactController.createContact);
router.get("/", ContactController.getAllContacts);
router.delete("/:id", ContactController.deleteContact);

export default router;