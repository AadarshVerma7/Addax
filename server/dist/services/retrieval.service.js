import embeddingService from "./embedding.service.js";
import prisma from "../lib/prisma.js";
class RetrievalService {
    async retrieveRelevantChunks(videoID, question, topK = 5) {
        const queryEmbeddings = await embeddingService.generateEmbeddings(question);
        const result = await prisma.$runCommandRaw({
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
        });
        // console.log(result);
        // console.log(result.cursor.firstBatch);
        const chunks = result.cursor.firstBatch.map(chunk => ({
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
//# sourceMappingURL=retrieval.service.js.map