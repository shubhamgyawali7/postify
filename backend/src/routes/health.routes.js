import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

export default router;
