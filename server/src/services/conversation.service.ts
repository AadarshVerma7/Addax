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

    async getUserConversations(userId: string) {
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

    async getConversationMessages(conversationId: string, userId: string, limit = 15, cursor?: string) {
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

    async deleteConversation(conversationId: string, userId: string) {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        if (conversation.userId !== userId) {
            throw new Error("You do not have access to delete this conversation.");
        }

        // Delete all associated messages first
        await prisma.message.deleteMany({
            where: { conversationId }
        });

        // Delete the conversation
        await prisma.conversation.delete({
            where: { id: conversationId }
        });

        return {
            success: true,
            message: "Conversation deleted successfully."
        };
    }
}

export default new ConversationService();
