import prisma from "../lib/prisma.js";
import { extractYoutubeVideoId } from "../utils/youtube.utils.js";
import youtubeService from "./youtube.service.js";
import transcriptService from "./transcript.service.js";
import conversationService from "./conversation.service.js";
class VideoService {
    async createVideo(data, userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            throw new Error("No user found");
        const { url } = data;
        const youtubeId = extractYoutubeVideoId(url);
        if (!youtubeId) {
            throw new Error("Invalid Youtube Url");
        }
        const existingVideo = await prisma.video.findUnique({
            where: {
                youtubeId
            }
        });
        if (existingVideo) {
            if (existingVideo.duration && existingVideo.duration > 3600) {
                throw new Error("Video duration must be less than or equal to 1 hour.");
            }
            let conversation = await prisma.conversation.findFirst({
                where: {
                    userId: user.id,
                    videoId: existingVideo.id
                }
            });
            if (!conversation) {
                conversation = await conversationService.createConversation(user.id, existingVideo.id);
            }
            return {
                success: true,
                video: existingVideo,
                conversation,
            };
        }
        const metadata = await youtubeService.getVideoMetaData(youtubeId);
        if (metadata.duration && metadata.duration > 3600) {
            throw new Error("Video duration must be less than or equal to 1 hour.");
        }
        let video;
        try {
            video = await prisma.video.create({
                data: {
                    youtubeId: metadata.youtubeId,
                    url,
                    title: metadata.title,
                    description: metadata.description,
                    tags: metadata.tags,
                    categoryId: metadata.categoryId,
                    channelId: metadata.channelId,
                    channelTitle: metadata.channelTitle,
                    thumbnailUrl: metadata.thumbnailUrl,
                    defaultLanguage: metadata.defaultLanguage,
                    defaultAudioLanguage: metadata.defaultAudioLanguage,
                    duration: metadata.duration || 0,
                    publishedAt: new Date(metadata.publishedAt),
                    viewCount: metadata.viewCount,
                    likeCount: metadata.likeCount,
                    commentCount: metadata.commentCount,
                    status: "PENDING"
                }
            });
        }
        catch (createError) {
            // Check if this is a unique constraint failure on youtubeId
            if (createError.code === "P2002" || createError.message?.includes("Unique constraint") || createError.message?.includes("duplicate key")) {
                const concurrentlyCreatedVideo = await prisma.video.findUnique({
                    where: { youtubeId }
                });
                if (concurrentlyCreatedVideo) {
                    let conversation = await prisma.conversation.findFirst({
                        where: {
                            userId: user.id,
                            videoId: concurrentlyCreatedVideo.id
                        }
                    });
                    if (!conversation) {
                        conversation = await conversationService.createConversation(user.id, concurrentlyCreatedVideo.id);
                    }
                    return {
                        success: true,
                        video: concurrentlyCreatedVideo,
                        conversation,
                    };
                }
            }
            throw createError;
        }
        // Start transcript and embedding generation in the background
        transcriptService.saveTranscript(video.id, video.youtubeId)
            .then(() => prisma.video.update({ where: { id: video.id }, data: { status: "READY" } }))
            .catch((err) => {
            console.error("Background transcript generation failed:", err);
            prisma.video.update({ where: { id: video.id }, data: { status: "FAILED" } }).catch(console.error);
        });
        const conversation = await conversationService.createConversation(user.id, video.id);
        return {
            success: true,
            video,
            conversation,
        };
    }
}
export default new VideoService();
//# sourceMappingURL=video.service.js.map