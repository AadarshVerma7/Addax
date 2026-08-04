import transcriptService from "../services/transcript.service.js";
async function test() {
    try {
        console.log("Calling getTranscript for BTjxUS_PylA (ByteByteGo system design video)...");
        const segments = await transcriptService.getTranscript("BTjxUS_PylA");
        console.log(`Success! Retrieved ${segments.length} segments.`);
        console.log("First segment:", segments[0]);
        console.log("Last segment:", segments[segments.length - 1]);
    }
    catch (e) {
        console.error("Test failed:", e.message || e);
    }
}
test();
//# sourceMappingURL=test-service-get.js.map