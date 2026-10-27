import { Router } from "express";
import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Published lesson outlines are visible to everyone; lesson content is only
// returned to enrolled learners or admins.
router.get("/courses/:courseId/lessons", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }
    const course = await Course.findOne({ _id: req.params.courseId, published: true }).select("_id title").lean();
    if (!course) return res.status(404).json({ message: "Course not found." });

    const lessons = await Lesson.find({ course: course._id, published: true })
      .select("title slug description durationMinutes order")
      .sort({ order: 1 })
      .lean();
    res.json({ course, lessons });
  } catch (error) { next(error); }
});

router.get("/:lessonId", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID." });
    }
    const lesson = await Lesson.findOne({ _id: req.params.lessonId, published: true }).populate("course", "title slug published");
    if (!lesson || !lesson.course?.published) return res.status(404).json({ message: "Lesson not found." });

    if (req.user.role !== "admin") {
      const enrolled = await Enrollment.exists({ user: req.user.id, course: lesson.course._id });
      if (!enrolled) return res.status(403).json({ message: "Enroll in this course to access the lesson." });
    }
    res.json({ lesson });
  } catch (error) { next(error); }
});

router.post("/courses/:courseId/lessons", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }
    const title = String(req.body.title || "").trim();
    const slug = String(req.body.slug || "").trim().toLowerCase();
    const order = Number(req.body.order);
    if (title.length < 2 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !Number.isInteger(order) || order < 1) {
      return res.status(400).json({ message: "Provide a title, URL-safe slug, and positive lesson order." });
    }
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });
    const lesson = await Lesson.create({
      course: course._id, title, slug, order,
      description: String(req.body.description || "").trim(),
      content: String(req.body.content || ""),
      videoUrl: String(req.body.videoUrl || "").trim(),
      durationMinutes: Math.max(0, Number(req.body.durationMinutes) || 0),
      published: req.body.published === true
    });
    res.status(201).json({ lesson });
  } catch (error) { next(error); }
});

router.patch("/:lessonId", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID." });
    }
    const allowed = ["title", "slug", "description", "content", "videoUrl", "durationMinutes", "order", "published"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (updates.title !== undefined) updates.title = String(updates.title).trim();
    if (updates.slug !== undefined) updates.slug = String(updates.slug).trim().toLowerCase();
    if (updates.durationMinutes !== undefined) updates.durationMinutes = Math.max(0, Number(updates.durationMinutes) || 0);
    const lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, updates, { new: true, runValidators: true });
    if (!lesson) return res.status(404).json({ message: "Lesson not found." });
    res.json({ lesson });
  } catch (error) { next(error); }
});

router.delete("/:lessonId", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID." });
    }
    const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found." });
    res.json({ message: "Lesson deleted." });
  } catch (error) { next(error); }
});

export default router;
