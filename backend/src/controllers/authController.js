import * as authService from "../services/auth.service.js";
import { createToken } from "../middleware/createJwtToken.js";
import env from "../config/env.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    if (name.length < 2 || name.length > 50) {
      return res
        .status(400)
        .json({ success: false, error: "Name must be 2-50 characters" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email format" });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      });
    }

    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "Email already in use" });
    }
    const user = await authService.createUser({ name, email, password });

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email format" });
    }

    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    const isMatch = await authService.comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out" });
};

export { register, login, getAllUsers, getMe, logout };
