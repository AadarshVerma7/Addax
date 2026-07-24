import { extractYoutubeVideoId } from "../utils/youtube.utils.js";

const urls = [
  "https://www.youtube.com/watch?v=M3_pLsDdeuU",
  "https://youtu.be/M3_pLsDdeuU",
  "https://youtube.com/embed/M3_pLsDdeuU",
  "https://youtube.com/shorts/M3_pLsDdeuU",
  "https://youtube.com/watch?v=M3_pLsDdeuU&t=120",
  "invalid-url",
];

for (const url of urls) {
  console.log(url);
  console.log("Video ID:", extractYoutubeVideoId(url));
  console.log("-------------------------");
}