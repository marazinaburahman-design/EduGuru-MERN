# EduGuru MERN — environment setup

## Required server environment variables

Set these in your local `server/.env` and in the API project's deployment settings. Never commit real secrets.

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<long-random-secret-at-least-32-characters>
CLIENT_URL=http://localhost:5173,https://eduguru-mern-web.vercel.app
```

- `MONGODB_URI`: MongoDB Atlas connection string; allow the deployed server's network access in Atlas.
- `JWT_SECRET`: private random secret used to sign access tokens. Keep it identical across server instances.
- `CLIENT_URL`: comma-separated exact allowed browser origins. Include the local Vite origin and the actual production frontend origin(s), without trailing paths.

## Frontend environment

Optional `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL=https://eduguru-mern-api.vercel.app/api` in the frontend project if using a different API domain. Vite variables are public and must never contain secrets.

## API modules

- `GET /api/health` — process health check (does not prove the database is reachable).
- `GET /api/courses` and `GET /api/courses/:slug` — published course catalogue and lesson outline.
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` — student authentication.
- `GET /api/enrollments`, `POST /api/enrollments` — current learner's enrollments.
- `POST /api/enrollments/:id/lessons/:lessonId/complete` — mark an enrolled course lesson complete and recalculate progress.
- `GET /api/lessons/courses/:courseId/lessons`, `GET /api/lessons/:lessonId` — lesson outline/content access.
- `POST /api/lessons/courses/:courseId/lessons`, `PATCH /api/lessons/:lessonId`, `DELETE /api/lessons/:lessonId` — administrator lesson management.
- `GET /api/admin/courses`, `POST /api/admin/courses`, `PATCH /api/admin/courses/:id`, `DELETE /api/admin/courses/:id` — administrator course management.

Admin routes require a user whose role is already `admin` in MongoDB. Public registration deliberately ignores any requested role and creates student accounts only. Promote a trusted admin directly in the database; do not add a public admin-registration endpoint.

## Run locally

1. Install dependencies in both `server` and `client` using `npm install`.
2. Configure `server/.env` with the variables above.
3. Run `npm run dev` in `server` (API defaults to port 5000).
4. Run `npm run dev` in `client` and use the Vite URL printed in the terminal.
5. Configure the exact same frontend origin in `CLIENT_URL`.

Before relying on a deployment, verify the API health endpoint, database-backed course list, sign-in, enrollment, and admin flows against the deployed environment. A successful build/deployment status alone does not verify those runtime paths.
