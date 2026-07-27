import dotenv from "dotenv";
dotenv.config();

import chatService from "../services/chat.service.js";

async function main() {
    try {
        console.log("======================================");
        console.log("        ADDAX CHAT TEST");
        console.log("======================================\n");

        const question =
            "What was the the person taking about at around 3mins 30seconds?";

        console.log("Question:");
        console.log(question);
        console.log("\nGenerating response...\n");

        const start = Date.now();
        const videoId = "6a649ae0451c0f554f58ab2b"
        const response = await chatService.chat(videoId, question);

        const end = Date.now();

        console.log("======================================");
        console.log("ADDAX RESPONSE");
        console.log("======================================\n");

        console.log(response);

        console.log("\n======================================");
        console.log(`Response Time: ${end - start} ms`);
        console.log("======================================");

    } catch (error) {
        console.error("Error while testing ChatService:");
        console.error(error);
    }
}

main();