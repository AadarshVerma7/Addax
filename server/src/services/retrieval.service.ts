import embeddingService from "./embedding.service.js";
import { RetrievalChunk } from "../types/retrieval.types.js";
import prisma from "../lib/prisma.js";
import { ObjectId } from "bson"
class RetrievalService {
    async retrieveRelevantChunks(
        videoID: string, question: string, topK: number = 5
    ): Promise<RetrievalChunk[]> {

        const queryEmbeddings = await embeddingService.generateEmbeddings(question);

        const result: any = await prisma.$runCommandRaw({
            aggregate: "TranscriptChunk",
            pipeline: [
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding",
                        queryVector: queryEmbeddings,

                        filter: {
                            videoId: {
                                $oid: videoID
                            }
                        },

                        numCandidates: 100,
                        limit: topK,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        content: 1,
                        startTime: 1,
                        endTime: 1,
                        score: {
                            $meta: "vectorSearchScore",
                        },
                    },
                },
            ],
            cursor: {},
        })

        // console.log(result);
        // console.log(result.cursor.firstBatch);

        const chunks = (result.cursor.firstBatch as any[]).map(chunk => ({
            id: chunk._id.$oid ?? chunk._id.toString(),
            content: chunk.content,
            startTime: chunk.startTime,
            endTime: chunk.endTime,
            score: chunk.score,
        }));

        return chunks;
    }
}

export default new RetrievalService();