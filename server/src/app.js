import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Course from "./models/Course.js";
import User from "./models/User.js";
import Enrollment from "./models/Enrollment.js";
import Lesson from "./models/Lesson.js";
import ContactMessage from "./models/ContactMessage.js";
import { requireAuth, requireAdmin } from "./middleware/auth.js";
import { connectDB } from "./db.js";
import lessonsRouter from "./routes/lessons.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map(v => v.trim()).filter(Boolean);
// Allow only the configured site(s) and deployment previews belonging to this EduGuru Vercel project.
const isTrustedEduGuruPreview = origin =>
  /^https:\/\/eduguru-mern-[a-z0-9-]+-abdur-rahman7\.vercel\.app$/.test(origin);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isTrustedEduGuruPreview(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "EduGuru API" }));
app.use(async (_req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) return res.status(503).json({ message: "Database is not configured." });
    await connectDB();
    return next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return res.status(503).json({ message: "Database temporarily unavailable. Check the server database configuration." });
  }
});

app.post("/api/contact", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const message = String(req.body.message || "").trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 5000) {
      return res.status(400).json({ message: "Enter your name, a valid email, and a message between 10 and 5000 characters." });
    }
    await ContactMessage.create({ name, email, message });
    return res.status(201).json({ message: "Your message has been sent to the EduGuru support team." });
  } catch (error) { return next(error); }
});

app.get("/api/courses", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim().slice(0, 100);
    const category = String(req.query.category || "").trim().slice(0, 80);
    const free = req.query.free === "true";
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const limit = Math.min(48, Math.max(1, Math.floor(Number(req.query.limit) || 12)));
    const filter = { published: true };
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ title: { $regex: safeSearch, $options: "i" } }, { description: { $regex: safeSearch, $options: "i" } }, { instructor: { $regex: safeSearch, $options: "i" } }];
    }
    if (category) filter.category = category;
    if (free) filter.price = 0;
    const [courses, total, categories] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Course.countDocuments(filter),
      Course.distinct("category", { published: true })
    ]);
    return res.json({ courses, categories: categories.filter(Boolean).sort(), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
});
app.get("/api/courses/:slug", async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, published: true }).lean();
    if (!course) return res.status(404).json({ message: "Course not found." });
    const lessons = await Lesson.find({ course: course._id, published: true }).select("title slug description durationMinutes order").sort({ order: 1 }).lean();
    return res.json({ course: { ...course, lessonsCount: lessons.length || course.lessonsCount }, lessons });
  } catch (error) { return next(error); }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (name.length < 2 || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: "Enter a name, valid email, and password between 8 and 128 characters." });
    }
    if (!process.env.JWT_SECRET) return res.status(503).json({ message: "Authentication is not configured." });
    if (await User.exists({ email })) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name, email, password, age: req.body.age, gender: req.body.gender });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d", algorithm: "HS256" });
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { return next(error); }
});
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!process.env.JWT_SECRET) return res.status(503).json({ message: "Authentication is not configured." });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: "Invalid email or password." });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d", algorithm: "HS256" });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { return next(error); }
});
app.get("/api/auth/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Account not found." });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } });
  } catch (error) { return next(error); }
});

app.get("/api/enrollments", requireAuth, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id }).populate("course").populate("completedLessons", "title order").sort({ createdAt: -1 }).lean();
    return res.json({ enrollments });
  } catch (error) { return next(error); }
});
app.post("/api/enrollments", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.body.courseId)) return res.status(400).json({ message: "A valid course ID is required." });
    const course = await Course.findOne({ _id: req.body.courseId, published: true });
    if (!course) return res.status(404).json({ message: "Course not found." });
    const existing = await Enrollment.findOne({ user: req.user.id, course: course.id });
    if (existing) return res.status(409).json({ message: "Already enrolled.", enrollment: existing });
    const enrollment = await Enrollment.create({ user: req.user.id, course: course.id });
    return res.status(201).json({ enrollment });
  } catch (error) { return next(error); }
});
app.patch("/api/enrollments/:id/progress", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid enrollment ID." });
    const progress = Number(req.body.progress);
    if (!Number.isFinite(progress) || progress < 0 || progress > 100) return res.status(400).json({ message: "Progress must be between 0 and 100." });
    const enrollment = await Enrollment.findOne({ _id: req.params.id, user: req.user.id });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });
    enrollment.progress = progress;
    enrollment.status = progress === 100 ? "completed" : "active";
    await enrollment.save();
    return res.json({ enrollment });
  } catch (error) { return next(error); }
});
app.post("/api/enrollments/:id/lessons/:lessonId/complete", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.params.lessonId)) {
      return res.status(400).json({ message: "Invalid enrollment or lesson ID." });
    }
    const enrollment = await Enrollment.findOne({ _id: req.params.id, user: req.user.id });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });
    const lesson = await Lesson.findOne({ _id: req.params.lessonId, course: enrollment.course, published: true }).select("_id");
    if (!lesson) return res.status(404).json({ message: "Published lesson not found for this course." });
    if (!enrollment.completedLessons.some(id => String(id) === String(lesson._id))) enrollment.completedLessons.push(lesson._id);
    const lessonCount = await Lesson.countDocuments({ course: enrollment.course, published: true });
    enrollment.progress = lessonCount ? Math.round(enrollment.completedLessons.length / lessonCount * 100) : 0;
    enrollment.status = lessonCount > 0 && enrollment.progress === 100 ? "completed" : "active";
    await enrollment.save();
    return res.json({ enrollment, message: "Lesson marked complete." });
  } catch (error) { return next(error); }
});

app.get("/api/admin/courses", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ courses });
  } catch (error) { return next(error); }
});
app.post("/api/admin/courses", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    const slug = String(req.body.slug || "").trim().toLowerCase();
    const description = String(req.body.description || "").trim();
    if (title.length < 3 || title.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || description.length < 10) {
      return res.status(400).json({ message: "Provide a title, URL-safe slug, and description of at least 10 characters." });
    }
    const course = await Course.create({ title, slug, description, instructor: req.body.instructor, category: req.body.category, level: req.body.level, price: req.body.price, imageUrl: req.body.imageUrl, published: req.body.published === true });
    return res.status(201).json({ course });
  } catch (error) { return next(error); }
});
app.patch("/api/admin/courses/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid course ID." });
    const keys = ["title", "slug", "description", "instructor", "category", "level", "price", "imageUrl", "lessonsCount", "published"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => keys.includes(key)));
    if (updates.title !== undefined) updates.title = String(updates.title).trim();
    if (updates.slug !== undefined) updates.slug = String(updates.slug).trim().toLowerCase();
    if (updates.description !== undefined) updates.description = String(updates.description).trim();
    if (updates.price !== undefined && (!Number.isFinite(Number(updates.price)) || Number(updates.price) < 0)) return res.status(400).json({ message: "Price must be zero or greater." });
    const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found." });
    return res.json({ course });
  } catch (error) { return next(error); }
});
app.delete("/api/admin/courses/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid course ID." });
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    await Promise.all([Lesson.deleteMany({ course: course._id }), Enrollment.deleteMany({ course: course._id })]);
    return res.json({ message: "Course and associated lessons/enrollments deleted." });
  } catch (error) { return next(error); }
});

app.use("/api/lessons", lessonsRouter);
app.use((err, _req, res, _next) => {
  if (err.message === "Origin not allowed by CORS") return res.status(403).json({ message: "This website is not allowed to access the API." });
  if (err.code === 11000) return res.status(409).json({ message: "A record with these details already exists." });
  if (err.name === "ValidationError" || err.name === "CastError") return res.status(400).json({ message: err.message });
  console.error(err);
  return res.status(500).json({ message: "Unexpected server error." });
});
export default app;
