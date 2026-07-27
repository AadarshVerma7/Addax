import prisma from "../lib/prisma.js";

class ConversationService {
    async createConversation(
        userId: string,
        videoId: string
    ) {

        const conversation = await prisma.conversation.create({
            data: {
                userId,
                videoId,
            }
        });

        return conversation;
    }

    async getConversationMessages(conversationId: string) {
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        return conversation.messages;
    }
}

export default new ConversationService();