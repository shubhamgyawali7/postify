import prisma from "../config/prisma.js";

const getAllPosts = async () => {
  return prisma.post.findMany({
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const createPost = async (data) => {
  return prisma.post.create({ data });
};

const getPostById = async (id, userId) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { comments: true } },
    },
  });

  if (!post) return null;

  let likedByMe = false;
  if (userId) {
    const like = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId: id } },
    });
    likedByMe = !!like;
  }

  return { ...post, likedByMe };
};

const updatePost = async (id, data) => {
  return prisma.post.update({ where: { id }, data });
};

const deletePost = async (id) => {
  return prisma.post.delete({ where: { id } });
};

const toggleLike = async (postId, userId) => {
  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
    const post = await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { decrement: 1 } },
    });
    return { liked: false, likesCount: post.likesCount };
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
    const post = await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });
    return { liked: true, likesCount: post.likesCount };
  }
};

export { getAllPosts, getPostById, createPost, updatePost, deletePost, toggleLike };
