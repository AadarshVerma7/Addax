import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/prisma.js";
import videoRouter from "./routes/video.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/videos",videoRouter);

const PORT = 8000;

app.get("/", (req, res) => {
  res.json({
    message: "Addax API is running",
  });
});

app.get("/db-test", async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      success: true,
      message: "Connected to MongoDB successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});