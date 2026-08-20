function roleBaseAccess(role) {
  return (req, res, next) => {
    if (!req.user.role.includes(role)) {
      return res.status(403).json({ success: false, error: "Forbidden - Access denied" });
    }
    next();
  };
}

export default roleBaseAccess;
