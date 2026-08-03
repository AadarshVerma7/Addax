import { Request, Response } from "express";
import conversationService from "../services/conversation.service.js";

class ConversationController {
    async getUserConversations(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const conversations = await conversationService.getUserConversations(userId);
            return res.status(200).json({ success: true, conversations });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getConversationMessages(
        req: Request<{ conversationId: string }, unknown, unknown, { cursor?: string; limit?: string }>,
        res: Response,
    ) {
        try {
            const { conversationId } = req.params;
            const userId = req.userId;

            if (!conversationId) {
                return res.status(400).json({ success: false, message: "Conversation id is required." });
            }
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const requestedLimit = Number(req.query.limit ?? 15);
            const limit = Number.isFinite(requestedLimit)
                ? Math.min(Math.max(Math.floor(requestedLimit), 1), 15)
                : 15;
            const page = await conversationService.getConversationMessages(
                conversationId,
                userId,
                limit,
                req.query.cursor,
            );

            return res.status(200).json({ success: true, ...page });
        } catch (error: any) {
            const status = error.message === "Conversation not found" ? 404 :
                error.message === "You do not have access to this conversation." ? 403 : 400;
            return res.status(status).json({ success: false, message: error.message });
        }
    }
}

export default new ConversationController();
