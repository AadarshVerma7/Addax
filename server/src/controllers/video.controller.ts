import { Request, Response } from "express";
import VideoService from "../services/video.service.js"
import prisma from "../lib/prisma.js";
import { extractYoutubeVideoId } from "../utils/youtube.utils.js";


interface CreateVideoBody{
    url: string;
}

class VideoController{
    async createVideo(req: Request<{},{}, CreateVideoBody>, res: Response){
        try {
            const { url } = req.body;

            if(!url){
                return res.status(500).json({
                    success : false,
                    message: "Please Enter a Link"
                })
            }

            const result = await VideoService.createVideo({url});
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
                return res.status(500).json({
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
}

export default new VideoController();