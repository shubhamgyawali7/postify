import express from "express";
import { register, login, getAllUsers, getMe, logout } from "../controllers/authController.js";
import auth from "../middleware/verifyAuth.js";
import roleBaseAccess from "../middleware/roleBasedAuth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getMe);
router.get("/users", auth, roleBaseAccess("ADMIN"), getAllUsers);

export default router;
