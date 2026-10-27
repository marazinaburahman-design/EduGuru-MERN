import "dotenv/config";
import app from "../src/app.js";
import { connectDB } from "../src/db.js";
export default async function handler(req, res) {
 try { if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured."); await connectDB(); return app(req, res); }
 catch (error) { console.error("API initialization failed:", error.message); return res.status(503).json({ message: "API temporarily unavailable. Check server environment configuration." }); }
}
