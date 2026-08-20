import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";
import auth from "../middleware/verifyAuth.js";

const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", auth, addComment);
router.delete("/:commentId", auth, deleteComment);

export default router;
