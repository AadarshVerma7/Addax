import dotenv from "dotenv";
dotenv.config();
import prisma from "../lib/prisma.js";
import summaryService from "../services/summary.service.js";
async function main() {
    const transcript = await prisma.transcript.findFirst({
        where: {
            videoId: "6a649ae0451c0f554f58ab2b",
        }
    });
    if (!transcript) {
        throw new Error("Transcript not found");
    }
    console.log("Generating summary...\n");
    const summary = await summaryService.generateSummary("6a649ae0451c0f554f58ab2b", transcript.fullText);
    console.log(summary);
}
main();
//# sourceMappingURL=test-summary.js.map