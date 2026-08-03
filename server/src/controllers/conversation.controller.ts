import { Request, Response } from "express";
import conversationService from "../services/conversation.service.js";
import prisma from "../lib/prisma.js";

class ConversationController {
    async getUserConversations(req: Request, res: Response) {
        try {
            const userId = req.userId;
                        
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const conversations = await conversationService.getUserConversations(userId);
            if(!conversations){
                return res.status(200).json({
                success: true,
                conversations : "",
                })
            }
            return res.status(200).json({
                success: true,
                conversations,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

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