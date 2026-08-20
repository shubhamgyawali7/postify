import * as postService from "../services/post.service.js";
import { cloudinaryUploadImage, cloudinaryRemoveImage } from "../utils/cloudinary.js";

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "Image is required" });
    }

    if (title.length > 200) {
      return res.status(400).json({ success: false, error: "Title must be under 200 characters" });
    }

    if (content.length > 5000) {
      return res.status(400).json({ success: false, error: "Content must be under 5000 characters" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinaryUploadImage(dataURI);

    const newPost = await postService.createPost({
      title,
      content,
      image: result.url,
      imagePublicId: result.public_id,
      authorId: req.user.id,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ success: false, error: "Invalid post ID" });
  }

  try {
    const userId = req.user?.id || null;
    const post = await postService.getPostById(postId, userId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const toggleLike = async (req, res) => {
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ success: false, error: "Invalid post ID" });
  }

  try {
    const post = await postService.getPostById(postId, null);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const result = await postService.toggleLike(postId, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const postId = Number(req.params.id);
  const { title, content } = req.body;

  if (isNaN(postId)) {
    return res.status(400).json({ success: false, error: "Invalid post ID" });
  }

  try {
    const existingPost = await postService.getPostById(postId, null);
    if (!existingPost) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Not authorized to edit this post" });
    }

    if (title && title.length > 200) {
      return res.status(400).json({ success: false, error: "Title must be under 200 characters" });
    }

    if (content && content.length > 5000) {
      return res.status(400).json({ success: false, error: "Content must be under 5000 characters" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    if (req.file) {
      await cloudinaryRemoveImage(existingPost.imagePublicId);

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinaryUploadImage(dataURI);

      updateData.image = result.url;
      updateData.imagePublicId = result.public_id;
    }

    const post = await postService.updatePost(postId, updateData);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Error updating post:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ success: false, error: "Invalid post ID" });
  }

  try {
    const existingPost = await postService.getPostById(postId, null);
    if (!existingPost) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Not authorized to delete this post" });
    }

    await cloudinaryRemoveImage(existingPost.imagePublicId);
    await postService.deletePost(postId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export { getAllPosts, createPost, getPostById, updatePost, deletePost, toggleLike };
