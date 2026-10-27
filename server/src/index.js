import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Course from "./models/Course.js";
import User from "./models/User.js";
import { requireAuth, requireAdmin } from "./middleware/auth.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") ?? "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "EduGuru API" }));

app.get("/api/courses", async (req, res, next) => {
  try {
    const { search = "", category = "", free = "", page = "1", limit = "12" } = req.query;
    const filter = { published: true };
    if (search.trim()) filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { instructor: { $regex: search.trim(), $options: "i" } }
    ];
    if (category) filter.category = category;
    if (free === "true") filter.price = 0;
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(48, Math.max(1, Number(limit) || 12));
    const [courses, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSize).limit(pageSize),
      Course.countDocuments(filter)
    ]);
    res.json({ courses, pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
  } catch (error) { next(error); }
});

app.get("/api/courses/:slug", async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, published: true });
    if (!course) return res.status(404).json({ message: "Course not found." });
    res.json({ course });
  } catch (error) { next(error); }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    if (!name || !email || password.length < 8)
      return res.status(400).json({ message: "Name, valid email, and a password of at least 8 characters are required." });
    if (await User.exists({ email })) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password." });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});

app.get("/api/auth/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Account not found." });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});

app.post("/api/admin/courses", requireAuth, requireAdmin, async (req, res, next) => {
  try { res.status(201).json({ course: await Course.create(req.body) }); }
  catch (error) { next(error); }
});

app.use((err, _req, res, _next) => {
  if (err.code === 11000) return res.status(409).json({ message: "A record with that unique value already exists." });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

const port = Number(process.env.PORT) || 5000;
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("MONGODB_URI and JWT_SECRET must be configured.");
  process.exit(1);
}
await mongoose.connect(process.env.MONGODB_URI);
app.listen(port, () => console.log(`EduGuru API listening on port ${port}`));