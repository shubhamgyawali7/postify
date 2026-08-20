import prisma from "../config/prisma.js";

const createComment = async (postId, userId, text) => {
  return prisma.comment.create({
    data: { text, userId, postId },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

const getCommentsByPostId = async (postId) => {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const deleteComment = async (commentId) => {
  return prisma.comment.delete({ where: { id: commentId } });
};

const getCommentById = async (commentId) => {
  return prisma.comment.findUnique({ where: { id: commentId } });
};

export { createComment, getCommentsByPostId, deleteComment, getCommentById };
