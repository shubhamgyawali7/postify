import express from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import auth from "../middleware/verifyAuth.js";
import optionalAuth from "../middleware/optionalAuth.js";
import photoUpload from "../utils/multer.js";
import commentRoutes from "./comment.routes.js";

const router = express.Router();

router.use("/:postId/comments", commentRoutes);

router.get("/", getAllPosts);
router.get("/:id", optionalAuth, getPostById);

router.post("/", auth, photoUpload.single("image"), createPost);
router.put("/:id", auth, photoUpload.single("image"), updatePost);
router.patch("/:id", auth, photoUpload.single("image"), updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/like", auth, toggleLike);

export default router;
