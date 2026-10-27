import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db.js";
const port = Number(process.env.PORT) || 5000;
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) { console.error("MONGODB_URI and JWT_SECRET must be configured."); process.exit(1); }
await connectDB();
app.listen(port, () => console.log(`EduGuru API listening on port ${port}`));
