import prisma from "../lib/prisma.js";
import { extractYoutubeVideoId } from "../utils/youtube.utils.js";
import youtubeService from "./youtube.service.js";
import transcriptService from "./transcript.service.js";
interface CreateVideoDto{
    url : string
}

class VideoService{
    async createVideo(data : CreateVideoDto){

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
            return existingVideo;
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
        await transcriptService.saveTranscript(video.id, video.youtubeId);
        return {
            success: true,
            video
        };
    }
}

export default new VideoService();