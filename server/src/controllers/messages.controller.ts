import { Request, Response } from "express";
import chatService from "../services/chat.service.js";

class MessagesController {
    async sendMessage(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { conversationId, content } = req.body;

            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            if (typeof conversationId !== "string" || !conversationId.trim()) {
                return res.status(400).json({ success: false, message: "conversationId is required." });
            }

            if (typeof content !== "string" || !content.trim()) {
                return res.status(400).json({ success: false, message: "content is required." });
            }

            const { userMessage, assistantMessage } = await chatService.chat(
                conversationId,
                content.trim(),
                userId,
            );

            return res.status(201).json({ success: true, userMessage, assistantMessage });
        } catch (error: any) {
            const message = error.message || "Unable to send message.";
            const status = message === "Conversation Not Found!" ? 404 :
                message === "You do not have access to this conversation." ? 403 : 500;

            return res.status(status).json({ success: false, message });
        }
    }
}

export default new MessagesController();
