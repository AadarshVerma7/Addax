import { Router } from "express";
import conversationController from "../controllers/conversation.controller.js";

const conversationRouter = Router();

conversationRouter.get(
    "/:conversationId/messages",
    conversationController.getConversationMessages
);

export default conversationRouter;