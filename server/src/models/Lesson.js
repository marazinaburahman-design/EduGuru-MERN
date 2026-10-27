import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, trim: true, lowercase: true },
  description: { type: String, default: "", maxlength: 3000 },
  content: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  durationMinutes: { type: Number, min: 0, default: 0 },
  order: { type: Number, min: 1, required: true },
  published: { type: Boolean, default: false, index: true }
}, { timestamps: true });

lessonSchema.index({ course: 1, slug: 1 }, { unique: true });
lessonSchema.index({ course: 1, order: 1 }, { unique: true });

export default mongoose.model("Lesson", lessonSchema);
