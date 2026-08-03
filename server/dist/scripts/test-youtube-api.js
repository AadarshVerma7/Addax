import youtubeService from "../services/youtube.service.js";
async function test() {
    const metadata = await youtubeService.getVideoMetaData("M3_pLsDdeuU");
    console.log(JSON.stringify(metadata, null, 2));
}
test();
//# sourceMappingURL=test-youtube-api.js.map