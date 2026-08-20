import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const authHeader = req.headers?.authorization;
  let authToken;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    authToken = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    authToken = req.cookies.token;
  }

  if (!authToken || authToken === "null" || authToken === "undefined") {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  jwt.verify(authToken, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    req.user = data;
    next();
  });
}

export default auth;
