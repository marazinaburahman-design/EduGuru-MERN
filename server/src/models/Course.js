import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  instructor: { type: String, default: "EduGuru Instructor" },
  category: { type: String, default: "General", index: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  price: { type: Number, min: 0, default: 0 },
  imageUrl: { type: String, default: "" },
  lessonsCount: { type: Number, min: 0, default: 0 },
  published: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);