import { Router } from "express";
import conversationController from "../controllers/conversation.controller.js";
import { authMiddleWare } from "../middleware/auth.middleware.js";
const conversationRouter = Router();
conversationRouter.get("/", authMiddleWare, conversationController.getUserConversations);
conversationRouter.get("/:conversationId/messages", authMiddleWare, conversationController.getConversationMessages);
export default conversationRouter;
//# sourceMappingURL=conversation.routes.js.map