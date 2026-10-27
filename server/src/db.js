import mongoose from "mongoose";
let connectionPromise;
export async function connectDB() {
 if (mongoose.connection.readyState === 1) return mongoose.connection;
 if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
 if (!connectionPromise) connectionPromise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 }).catch(error => { connectionPromise = undefined; throw error; });
 await connectionPromise;
 return mongoose.connection;
}
