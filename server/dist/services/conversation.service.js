import prisma from "../lib/prisma.js";
class ConversationService {
    async createConversation(userId, videoId) {
        const conversation = await prisma.conversation.create({
            data: {
                userId,
                videoId,
            }
        });
        return conversation;
    }
    async getUserConversations(userId) {
        const conversations = await prisma.conversation.findMany({
            where: { userId },
            include: {
                video: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
        return conversations;
    }
    async getConversationMessages(conversationId) {
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
//# sourceMappingURL=conversation.service.js.map