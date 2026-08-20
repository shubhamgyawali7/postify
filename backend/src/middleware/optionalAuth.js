import jwt from "jsonwebtoken";

function optionalAuth(req, res, next) {
  const authHeader = req.headers?.authorization;
  let authToken;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    authToken = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    authToken = req.cookies.token;
  }

  if (!authToken || authToken === "null" || authToken === "undefined") {
    req.user = null;
    return next();
  }

  jwt.verify(authToken, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      req.user = null;
    } else {
      req.user = data;
    }
    next();
  });
}

export default optionalAuth;
