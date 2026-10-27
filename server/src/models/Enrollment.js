import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  progress: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ["active", "completed"], default: "active" }
}, { timestamps: true });

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
export default mongoose.model("Enrollment", enrollmentSchema);
