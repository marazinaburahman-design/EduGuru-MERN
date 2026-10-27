import "dotenv/config";
import app from "../src/app.js";

// The Express application handles database connection failures for database-backed
// routes while keeping /api/health available as a lightweight process check.
export default function handler(req, res) {
  return app(req, res);
}
