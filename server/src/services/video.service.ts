import prisma from "../lib/prisma.js";
import { extractYoutubeVideoId } from "../utils/youtube.utils.js";
import youtubeService from "./youtube.service.js";
import transcriptService from "./transcript.service.js";
import conversationService from "./conversation.service.js";
interface CreateVideoDto{
    url : string
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

        const metadata = await youtubeService.getVideoMetaData(youtubeId);

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
                duration: metadata.duration,
                publishedAt: new Date(metadata.publishedAt),
                viewCount: metadata.viewCount,
                likeCount: metadata.likeCount,
                commentCount: metadata.commentCount,
                status: "PENDING"
            }
        })
        const transcript = await transcriptService.saveTranscript(video.id, video.youtubeId);
        const conversation = await conversationService.createConversation(user.id, video.id);
        return {
            success: true,
            video,
            transcript,
            conversation,
        };
    }
}

export default new VideoService();