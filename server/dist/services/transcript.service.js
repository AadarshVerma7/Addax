import { YoutubeTranscript } from "youtube-transcript";
import prisma from "../lib/prisma.js";
import { TRANSCRIPT_SOURCE } from "@prisma/client";
import embeddingService from "./embedding.service.js";
class TranscriptService {
    async getTranscript(youtubeId) {
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(youtubeId);
            const formattedTranscript = transcript.map(item => ({
                text: item.text,
                startTime: item.offset / 1000,
                endTime: (item.offset + item.duration) / 1000,
                duration: item.duration / 1000
            }));
            return formattedTranscript;
        }
        catch (error) {
            throw new Error("Failed to fetch transcript");
        }
    }
    async saveTranscript(videoId, youtubeId) {
        const transcript = await this.getTranscript(youtubeId);
        const fullText = transcript.map(segment => segment.text).join(" ");
        const savedTranscript = await prisma.transcript.create({
            data: {
                videoId,
                language: null,
                source: TRANSCRIPT_SOURCE.YOUTUBE_CAPTIONS,
                fullText,
            }
        });
        const chunks = this.createChunks(transcript);
        for (const chunk of chunks) {
            const embedding = await embeddingService.generateEmbeddings(chunk.content);
            chunk.embedding = embedding;
        }
        await prisma.transcriptChunk.createMany({
            data: chunks.map(chunk => ({
                videoId,
                transcriptId: savedTranscript.id,
                content: chunk.content,
                startTime: chunk.startTime,
                endTime: chunk.endTime,
                chunkIndex: chunk.chunkIndex,
                embedding: chunk.embedding,
            }))
        });
        return savedTranscript;
    }
    createChunks(transcript) {
        const chunks = [];
        const MAX_TOKENS = 400;
        const OVERLAP_TOKENS = 75; // Add overlap later (For context in each chunk from the previous chunk)
        let i = 0;
        while (i < transcript.length) {
            let currentChunk = [];
            let currentToken = 0;
            while (i < transcript.length && currentToken < MAX_TOKENS) {
                const segment = transcript[i];
                currentChunk.push(segment);
                currentToken += this.estimateTokens(segment.text);
                i++;
            }
            if (currentChunk.length === 0) { // just incase the transcript is empty
                break;
            }
            const content = currentChunk.map(segment => segment.text).join(" ");
            const startTime = currentChunk[0].startTime;
            const endTime = currentChunk[currentChunk.length - 1].endTime;
            chunks.push({
                content,
                startTime,
                endTime,
                chunkIndex: chunks.length,
                embedding: [],
            });
        }
        return chunks;
    }
    estimateTokens(text) {
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words * 1.3);
    }
}
export default new TranscriptService();
//# sourceMappingURL=transcript.service.js.map