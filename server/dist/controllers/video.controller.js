import VideoService from "../services/video.service.js";
import prisma from "../lib/prisma.js";
import { extractYoutubeVideoId } from "../utils/youtube.utils.js";
import youtubeService from "../services/youtube.service.js";
class VideoController {
    async createVideo(req, res) {
        try {
            const { url, title, thumbnailUrl, channelTitle } = req.body;
            if (!url) {
                return res.status(500).json({
                    success: false,
                    message: "Please Enter a Link"
                });
            }
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            const result = await VideoService.createVideo({
                url,
                title,
                thumbnailUrl,
                channelTitle
            }, userId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getVideo(req, res) {
        try {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({
                    success: false,
                    message: "Please Enter a Link"
                });
            }
            const youtubeId = extractYoutubeVideoId(url);
            if (!youtubeId) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch Video id"
                });
            }
            const result = await prisma.video.findFirst({
                where: {
                    youtubeId
                }
            });
            return res.status(200).json({
                result
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getVideoDetails(req, res) {
        try {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({
                    success: false,
                    message: "Please Enter a Link"
                });
            }
            const youtubeId = extractYoutubeVideoId(url);
            if (!youtubeId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Youtube Url"
                });
            }
            const metadata = await youtubeService.getVideoMetaData(youtubeId);
            return res.status(200).json({
                success: true,
                data: metadata
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getTranscript(req, res) {
        try {
            const { videoId } = req.body;
            if (!videoId) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide the videoId"
                });
            }
            const transcriptChunks = await prisma.transcriptChunk.findMany({
                where: {
                    videoId: videoId,
                },
                orderBy: {
                    chunkIndex: "asc"
                }
            });
            const transcript = transcriptChunks.map(chunk => ({
                content: chunk.content,
                startTime: chunk.startTime,
                endTime: chunk.endTime,
            }));
            return res.status(200).json({
                success: true,
                transcript: transcript
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
export default new VideoController();
//# sourceMappingURL=video.controller.js.map