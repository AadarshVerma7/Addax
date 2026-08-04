import prisma from "../lib/prisma.js";
import { extractYoutubeVideoId } from "../utils/youtube.utils.js";
import youtubeService from "./youtube.service.js";
import transcriptService, { TranscriptFetchError } from "./transcript.service.js";
import conversationService from "./conversation.service.js";
import { ERROR_CODE } from "@prisma/client";
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
        let existingVideo = await prisma.video.findUnique({
            where: {
                youtubeId
            }
        });
        if (existingVideo) {
            // A previous request may have failed because YouTube temporarily blocked
            // the server. Requeue only videos that do not already have a transcript.
            if (existingVideo.status === "FAILED") {
                const existingTranscript = await prisma.transcript.findUnique({
                    where: { videoId: existingVideo.id },
                    select: { id: true },
                });
                if (!existingTranscript) {
                    existingVideo = await prisma.video.update({
                        where: { id: existingVideo.id },
                        data: {
                            status: "PENDING",
                            errorCode: null,
                            errorMessage: null,
                        },
                    });
                    this.queueTranscriptGeneration(existingVideo.id, existingVideo.youtubeId);
                }
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
        let metadata;
        if (data.title) {
            metadata = {
                youtubeId,
                title: data.title,
                description: "",
                tags: [],
                categoryId: "0",
                channelId: "",
                channelTitle: data.channelTitle || "",
                thumbnailUrl: data.thumbnailUrl || "",
                defaultLanguage: "en",
                defaultAudioLanguage: "en",
                duration: 0,
                publishedAt: new Date(),
                viewCount: 0,
                likeCount: 0,
                commentCount: 0
            };
        }
        else {
            metadata = await youtubeService.getVideoMetaData(youtubeId);
        }
        const video = await prisma.video.create({
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
        // Start transcript and embedding generation in the background.
        this.queueTranscriptGeneration(video.id, video.youtubeId);
        const conversation = await conversationService.createConversation(user.id, video.id);
        return {
            success: true,
            video,
            conversation,
        };
    }
    queueTranscriptGeneration(videoId, youtubeId) {
        void transcriptService.saveTranscript(videoId, youtubeId)
            .then(() => prisma.video.update({ where: { id: videoId }, data: { status: "READY" } }))
            .catch((err) => {
            console.error("Background transcript generation failed:", err);
            const errorCode = err instanceof TranscriptFetchError
                ? err.code
                : ERROR_CODE.TRANSCRIPT_PROCESSING_FAILED;
            const errorMessage = err instanceof Error
                ? err.message
                : "Transcript generation failed.";
            prisma.video.update({
                where: { id: videoId },
                data: { status: "FAILED", errorCode, errorMessage },
            }).catch(console.error);
        });
    }
}
export default new VideoService();
//# sourceMappingURL=video.service.js.map