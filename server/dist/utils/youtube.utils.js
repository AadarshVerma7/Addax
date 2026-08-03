export function extractYoutubeVideoId(url) {
    try {
        const parsedUrl = new URL(url);
        // youtu.be/<id>
        if (parsedUrl.hostname === "youtu.be") {
            return parsedUrl.pathname.slice(1);
        }
        // youtube.com/watch?v=<id>
        if (parsedUrl.hostname.includes("youtube.com") &&
            parsedUrl.pathname === "/watch") {
            return parsedUrl.searchParams.get("v");
        }
        // youtube.com/embed/<id>
        if (parsedUrl.pathname.startsWith("/embed/")) {
            return parsedUrl.pathname.split("/")[2];
        }
        // youtube.com/shorts/<id>
        if (parsedUrl.pathname.startsWith("/shorts/")) {
            return parsedUrl.pathname.split("/")[2];
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=youtube.utils.js.map