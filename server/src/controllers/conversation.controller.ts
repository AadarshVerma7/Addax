import { Request, Response } from "express";
import conversationService from "../services/conversation.service.js";

class ConversationController {

    async getConversationMessages(
        req: Request<{ conversationId: string }>,
        res: Response
    ) {
        try {
            const conversationId = req.params;
            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    message: "Conversation id is required."
                });
            }

            const messages = await conversationService.getConversationMessages(conversationId.conversationId);

            return res.status(200).json({
                success: true,
                messages,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}


export default new ConversationController();