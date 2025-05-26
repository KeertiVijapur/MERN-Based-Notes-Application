const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("🔐 Incoming auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("❌ No Bearer token found");
    return res.status(401).json({ error: "Unauthorized: Token missing or malformed" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log("❌ Token extraction failed");
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    console.log("✅ Token verified, decoded user:", decoded);
    req.user = decoded; // { userId: ... }
    next();
  });
}

module.exports = {
  authenticateToken,
};
