import prisma from "../lib/prisma.js";
import { extractYoutubeVideoId } from "../utils/youtube.utils.js";
import youtubeService from "./youtube.service.js";
import transcriptService from "./transcript.service.js";
import conversationService from "./conversation.service.js";
interface CreateVideoDto{
    url : string;
    title?: string;
    thumbnailUrl?: string;
    channelTitle?: string;
}

class VideoService{
    async createVideo(data : CreateVideoDto){

        const user = await prisma.user.findFirst(); // FIX LATER
        if(!user) throw new Error("No user found");

        const { url } = data;
        const youtubeId = extractYoutubeVideoId(url);
        if(!youtubeId){
            throw new Error("Invalid Youtube Url")
        }

        const existingVideo = await prisma.video.findUnique({
            where:{
                youtubeId
            }
        });

        if(existingVideo){
            const conversation = await conversationService.createConversation(user.id, existingVideo.id);
            return {
                success : true,
                video : existingVideo,
                conversation,
            }
        }

        let metadata: any;
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
        } else {
            metadata = await youtubeService.getVideoMetaData(youtubeId);
        }

        const video = await prisma.video.create({
            data:{
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
        })
        
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