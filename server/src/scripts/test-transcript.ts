import dotenv from "dotenv";
dotenv.config();

import transcriptService from "../services/transcript.service.js";

async function main() {
    try {
        // Replace this with a real Video document's ObjectId
        const videoId = "6a63500b65f94d0da16966ff";

        // Replace this with the corresponding YouTube ID
        const youtubeId = "M3_pLsDdeuU";

        const transcript = await transcriptService.saveTranscript(
            videoId,
            youtubeId
        );

        console.log("Transcript saved successfully!");
        console.log(transcript);

    } catch (error) {
        console.error(error);
    }
}



main();