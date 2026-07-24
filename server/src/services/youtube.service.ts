import axios from "axios";
import dotenv from "dotenv"
import { parseDuration } from "../utils/duration.utils.js";
dotenv.config();
class YoutubeService{
    async getVideoMetaData(videId : string){
        const apiKey = process.env.YOUTUBE_API_KEY;
        const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet,statistics,contentDetails",
                    id: videId,
                    key: apiKey,
                },
            }
        );

        const item = response.data.items[0];

        if(!item){
            throw new Error("Video not found");
        }   

        return {
            youtubeId: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            tags: item.snippet.tags ?? [],
            categoryId: item.snippet.categoryId,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            thumbnailUrl: item.snippet.thumbnails.high?.url,
            defaultLanguage: item.snippet.defaultLanguage,
            defaultAudioLanguage: item.snippet.defaultAudioLanguage,
            publishedAt: item.snippet.publishedAt,
            duration: parseDuration(item.contentDetails.duration),
            viewCount: Number(item.statistics.viewCount ?? 0),
            likeCount: Number(item.statistics.likeCount ?? 0),
            commentCount: Number(item.statistics.commentCount ?? 0)
        }
    }
}

export default new YoutubeService();