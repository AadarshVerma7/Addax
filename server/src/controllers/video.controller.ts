import { Request, Response } from "express";
import VideoService from "../services/video.service.js"
import prisma from "../lib/prisma.js";
import { extractYoutubeVideoId } from "../utils/youtube.utils.js";
import conversationService from "../services/conversation.service.js";
import youtubeService from "../services/youtube.service.js";

interface CreateVideoBody{
    url: string;
    title?: string;
    thumbnailUrl?: string;
    channelTitle?: string;
}

interface GetTranscriptBody{
    videoId: string,
}

interface TranscriptSegment {
    content: string;
    startTime: number;
    endTime: number;
}

class VideoController{
    async createVideo(req: Request<{},{}, CreateVideoBody>, res: Response){
        try {
            const { url, title, thumbnailUrl, channelTitle } = req.body;

            if(!url){
                return res.status(500).json({
                    success : false,
                    message: "Please Enter a Link"
                })
            }

            const result = await VideoService.createVideo({
                url,
                title,
                thumbnailUrl,
                channelTitle
            });
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    async getVideo(req: Request<{},{}, CreateVideoBody>, res: Response){
        try {
            const { url } = req.body;
            if(!url){
                return res.status(400).json({
                    success : false,
                    message: "Please Enter a Link"
                })
            }

            const youtubeId = extractYoutubeVideoId(url);
            if(!youtubeId){
                return res.status(500).json({
                    success : false,
                    message: "Unable to fetch Video id"
                })
            }

            const result = await prisma.video.findFirst({
                where:{
                    youtubeId
                }
            })

            return res.status(200).json({
                result
            })
        } catch (error : any) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    async getVideoDetails(req: Request<{},{}, CreateVideoBody>, res: Response){
        try {
            const { url } = req.body;
            if(!url){
                return res.status(400).json({
                    success : false,
                    message: "Please Enter a Link"
                })
            }

            const youtubeId = extractYoutubeVideoId(url);
            if(!youtubeId){
                return res.status(400).json({
                    success : false,
                    message: "Invalid Youtube Url"
                })
            }

            const metadata = await youtubeService.getVideoMetaData(youtubeId);

            return res.status(200).json({
                success: true,
                data: metadata
            })
        } catch (error : any) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    async getTranscript(req: Request<{},{},GetTranscriptBody>, res: Response){
        try {
            const { videoId } = req.body;
            if(!videoId){
                return res.status(400).json({
                    success : false,
                    message: "Please provide the videoId"
                })
            }

            const transcriptChunks = await prisma.transcriptChunk.findMany({
                where:{
                    videoId : videoId,
                },
                orderBy: {
                    chunkIndex: "asc"
                }
            })  

            const transcript: TranscriptSegment[] = transcriptChunks.map(chunk => ({
                content: chunk.content,
                startTime: chunk.startTime,
                endTime: chunk.endTime,
            }));

            return res.status(200).json({
                success: true,
                transcript: transcript
            });

        } catch (error : any) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}

export default new VideoController();