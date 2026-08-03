import prisma from "../lib/prisma.js";

async function testDatabase() {
  try {
    console.log("Testing database...");

    // Create a demo video
    const video = await prisma.video.create({
      data: {
        youtubeId: "M3_pLsDdeuU",
        url: "https://www.youtube.com/watch?v=M3_pLsDdeuU",
        title: "G-1. Introduction to Graph | Types | Different Conventions Used",
        description: "Demo video for testing Addax database",

        tags: [
          "graph",
          "graph theory",
          "dsa",
          "graph algorithms",
        ],

        categoryId: "27",

        channelId: "UCJskGeByzRRSvmOyZOz61ig",
        channelTitle: "take U forward",

        thumbnailUrl:
          "https://i.ytimg.com/vi/M3_pLsDdeuU/maxresdefault.jpg",

        defaultLanguage: "en",
        defaultAudioLanguage: "en",

        publishedAt: new Date("2022-08-04T06:48:26Z"),

        viewCount: 2008846,
        likeCount: 27621,
        commentCount: 648,

        status: "PENDING",
      },
    });

    console.log("Video created successfully:");
    console.log(video);

    // Read the video back from MongoDB
    const foundVideo = await prisma.video.findUnique({
      where: {
        youtubeId: "M3_pLsDdeuU",
      },
    });

    console.log("\nVideo retrieved successfully:");
    console.log(foundVideo);
  } catch (error) {
    console.error("Database test failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();