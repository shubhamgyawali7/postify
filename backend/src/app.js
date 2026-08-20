import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes.js";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.routes.js";
import env from "./config/env.js";
import prisma from "./config/prisma.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/health", healthRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
