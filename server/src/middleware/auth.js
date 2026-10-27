import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signingSecret() {
  return process.env.JWT_SECRET;
}

export function requireAuth(req, res, next) {
  const secret = signingSecret();
  if (!secret) {
    console.error("JWT_SECRET is not configured.");
    return res.status(503).json({ message: "Authentication is temporarily unavailable." });
  }

  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  if (!token) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (!payload || typeof payload.id !== "string" || !payload.id) {
      return res.status(401).json({ message: "Your session is invalid or expired." });
    }
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid or expired." });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    // Check the current database role so an old JWT cannot preserve admin access
    // after an account is demoted.
    const user = await User.findById(req.user?.id).select("role").lean();
    if (!user) return res.status(401).json({ message: "Please sign in to continue." });
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }
    req.user.role = user.role;
    return next();
  } catch (error) {
    return next(error);
  }
}
