import * as commentService from "../services/comment.service.js";

const addComment = async (req, res) => {
  const postId = Number(req.params.postId);
  const { text } = req.body;

  if (isNaN(postId)) {
    return res.status(400).json({ success: false, error: "Invalid post ID" });
  }

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, error: "Comment text is required" });
  }

  try {
    const comment = await commentService.createComment(postId, req.user.id, text.trim());
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getComments = async (req, res) => {
  const postId = Number(req.params.postId);

  if (isNaN(postId)) {
    return res.status(400).json({ success: false, error: "Invalid post ID" });
  }

  try {
    const comments = await commentService.getCommentsByPostId(postId);
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  const commentId = Number(req.params.commentId);

  if (isNaN(commentId)) {
    return res.status(400).json({ success: false, error: "Invalid comment ID" });
  }

  try {
    const comment = await commentService.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: "Comment not found" });
    }

    if (comment.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await commentService.deleteComment(commentId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export { addComment, getComments, deleteComment };
