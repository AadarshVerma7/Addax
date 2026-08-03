import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import messagesController from "../controllers/messages.controller.js";

const messagesRouter = Router();


messagesRouter.post('/', authMiddleWare, messagesController.sendMessage);
export default messagesRouter;
