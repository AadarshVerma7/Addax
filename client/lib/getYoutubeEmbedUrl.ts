export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    let videoId = "";

    // https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1);
    }

    // https://www.youtube.com/watch?v=VIDEO_ID
    else if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") || "";
      }

      // Already an embed URL
      else if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1];
      }

      // Shorts
      else if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      }
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}