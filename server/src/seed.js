import "dotenv/config";
import mongoose from "mongoose";
import Course from "./models/Course.js";

const courses = [
  { title: "Complete Quran Learning Course", slug: "complete-quran-learning-course", description: "A structured learning path with guided lessons and practice.", instructor: "EduGuru Learning Team", category: "Religious Studies", level: "Beginner", price: 0, lessonsCount: 24 },
  { title: "Foundations of Web Development", slug: "foundations-of-web-development", description: "Learn the core concepts behind modern websites and web applications.", instructor: "EduGuru Learning Team", category: "Technology", level: "Beginner", price: 0, lessonsCount: 18 },
  { title: "JavaScript for Practical Projects", slug: "javascript-for-practical-projects", description: "Build confidence with JavaScript through practical examples.", instructor: "EduGuru Learning Team", category: "Technology", level: "Intermediate", price: 2500, lessonsCount: 30 },
  { title: "Study Skills and Exam Preparation", slug: "study-skills-exam-preparation", description: "Build better learning habits, revision routines, and exam strategies.", instructor: "EduGuru Learning Team", category: "Personal Development", level: "Beginner", price: 0, lessonsCount: 12 }
];

try {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const course of courses) await Course.updateOne({ slug: course.slug }, { $setOnInsert: course }, { upsert: true });
  console.log("Sample courses seeded.");
} finally { await mongoose.disconnect(); }