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
    async getConversationMessages(conversationId, userId, limit = 15, cursor) {
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            }
        });
        if (!conversation) {
            throw new Error("Conversation not found");
        }
        if (conversation.userId !== userId) {
            throw new Error("You do not have access to this conversation.");
        }
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        });
        const hasMore = messages.length > limit;
        const page = hasMore ? messages.slice(0, limit) : messages;
        return {
            messages: page.reverse(),
            hasMore,
            nextCursor: hasMore ? page[page.length - 1].id : null,
        };
    }
}
export default new ConversationService();
//# sourceMappingURL=conversation.service.js.map