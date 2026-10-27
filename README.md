# EduGuru MERN

A fresh MERN implementation inspired by the public EduGuru learning platform. This is a rebuild based on observable public behavior and visual references, not a copy of the original site's proprietary source.

## Stack
- React + Vite frontend
- Node.js + Express API
- MongoDB Atlas + Mongoose
- JWT authentication and bcrypt password hashing
- Vercel deployment as separate frontend and API projects

## Local setup
1. Install Node.js 20+.
2. In `server`, copy `.env.example` to `.env` and configure `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
3. Run `npm install` and `npm run dev` inside `server`.
4. In `client`, copy `.env.example` to `.env`, set `VITE_API_URL=http://localhost:5000/api`, then run `npm install` and `npm run dev`.
5. Seed sample courses with `npm run seed` from `server`.

## Included in this foundation
- Responsive homepage and course discovery UI
- Course search, free-only filtering, detail pages
- Register/login endpoints and password hashing
- Course listing/detail API, JWT middleware, admin-only create endpoint
- Demo course seeding and environment templates

## Next implementation targets
- Full parity for all public routes (about, terms, privacy, contact, help, resources, app download)
- Secure session storage, protected profile/dashboard APIs, logout
- Course lessons, enrollments, progress tracking, and admin CRUD
- Playwright regression tests, production environment configuration, and deployment verification

Never commit real credentials. Do not expose MongoDB connection strings or JWT secrets in frontend environment variables.
