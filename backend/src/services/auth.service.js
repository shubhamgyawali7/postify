import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
};

const getUsersByRole = async (role) => {
  return prisma.user.findMany({
    where: { role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
};

const updateUserRole = async (id, role) => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
};

export {
  findUserByEmail,
  createUser,
  comparePassword,
  getAllUsers,
  getUsersByRole,
  getUserById,
  updateUserRole,
};
