# Blogify

A full-stack blogging platform where users can register, create posts with images, like posts, leave comments, and manage content through an admin dashboard.

**Live at:** [https://github.com/shubhamgyawali7/postify](https://github.com/shubhamgyawali7/postify)

---

## Table of Contents

- [What Is This Project?](#what-is-this-project)
- [Why I Built It This Way](#why-i-built-it-this-way)
- [Tech Stack Overview](#tech-stack-overview)
- [Full Project Structure](#full-project-structure)
- [How Authentication Works](#how-authentication-works)
- [How Image Upload Works](#how-image-upload-works)
- [Database Design](#database-design)
- [API Design](#api-design)
- [Frontend Architecture](#frontend-architecture)
- [Security Measures](#security-measures)
- [Key Design Decisions & Trade-offs](#key-design-decisions--trade-offs)
- [How to Run Locally](#how-to-run-locally)
- [Challenges Faced](#challenges-faced)
- [What I Would Improve](#what-i-would-improve)

---

## What Is This Project?

Blogify is a full-stack blogging application with three main features:

1. **Blog Posts** — Users can create, edit, and delete posts with titles, content, and featured images
2. **Social Interaction** — Users can like posts and leave comments
3. **Admin Dashboard** — Admins can manage all posts and view all registered users

The app has two user roles: **USER** (default) and **ADMIN**. Admins have additional privileges to edit/delete any post and view the user management dashboard.

---

## Why I Built It This Way

### Why a Full-Stack Monorepo (Separate Frontend + Backend)?

| Reason | Explanation |
|---|---|
| **Separation of concerns** | Frontend and backend have completely different responsibilities, dependencies, and deployment needs |
| **Independent scaling** | Frontend can be served via CDN while backend runs on a server |
| **Security** | Backend secrets (database URL, API keys) never touch the frontend |
| **Team-friendly** | Frontend and backend developers can work independently |

### Why Node.js + Express for Backend?

| Reason | Explanation |
|---|---|
| **JavaScript everywhere** | Same language frontend and backend — no context switching |
| **Express ecosystem** | Largest middleware ecosystem of any Node framework |
| **Express 5** | Chosen over v4 for native async error handling (no need for `express-async-errors`) |
| **Lightweight** | Minimal overhead, easy to understand and debug |

### Why React for Frontend?

| Reason | Explanation |
|---|---|
| **Component-based** | Reusable UI components (PostCard, Comment, Navbar) reduce duplication |
| **Hooks** | `useState`, `useEffect`, `useMemo`, `useContext` provide clean state management |
| **React 19** | Latest version with concurrent features for better UX |
| **Huge ecosystem** | React Router, Lucide icons, React Hot Toast — all mature libraries |

### Why PostgreSQL Over MongoDB?

| Factor | PostgreSQL | MongoDB |
|---|---|---|
| **Data relationships** | Posts belong to Users, Comments belong to both — relational fits naturally | Requires manual referencing/embedding |
| **Unique constraints** | Enforces one-like-per-user at database level | Requires application-level checks |
| **Cascade deletion** | Automatic — deleting a user removes their posts, comments, and likes | Manual cleanup required |
| **Data integrity** | Foreign keys and constraints prevent orphaned records | No built-in referential integrity |
| **ACID compliance** | Guarantees data consistency even on crashes | Eventual consistency model |

### Why Prisma Over Raw SQL or Sequelize?

| Reason | Explanation |
|---|---|
| **Type safety** | Auto-generated client catches errors at development time |
| **Migrations** | Version-controlled schema changes with rollback support |
| **Readable queries** | `prisma.post.findMany({ include: { author: true } })` vs complex SQL JOINs |
| **Zero config** | Schema file IS the source of truth — no separate model definitions |
| **Prisma Studio** | Built-in browser GUI for viewing/editing data during development |

### Why Tailwind CSS Over CSS Modules or Styled-Components?

| Reason | Explanation |
|---|---|
| **Speed** | Utility classes let you build UI without leaving JSX |
| **No naming overhead** | No `PostCard.module.css` files to manage |
| **Consistent design** | Built-in spacing scale, color palette, and responsive prefixes |
| **Small production CSS** | Purged CSS only includes classes you actually use |
| **Tailwind v4** | CSS-first configuration via `@import "tailwindcss"` — no `tailwind.config.js` needed |

---

## Tech Stack Overview

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | 19.2.x | UI library |
| React Router DOM | 7.18.x | Client-side routing |
| Tailwind CSS | 4.3.x | Styling |
| Axios | 1.19.x | HTTP client |
| Lucide React | 1.33.x | Icons |
| React Hot Toast | 2.6.x | Notifications |
| Vite | 8.2.x | Build tool & dev server |
| ESLint | 10.8.x | Code quality |

### Backend
| Technology | Version | Role |
|---|---|---|
| Express | 5.2.x | Web framework |
| Prisma | 6.12.x | ORM & migrations |
| PostgreSQL | - | Database |
| jsonwebtoken | 9.0.x | Authentication |
| bcrypt | 6.0.x | Password hashing |
| Cloudinary | 2.10.x | Image hosting |
| Multer | 2.2.x | File upload handling |
| Helmet | 8.3.x | Security headers |
| CORS | 2.8.x | Cross-origin requests |
| Morgan | 1.10.x | Request logging |

---

## Full Project Structure

```
postify/
├── .gitignore
├── README.md                    ← You are here
│
├── backend/
│   ├── .env.example             # Environment variable template
│   ├── nodemon.json             # Dev server config
│   ├── package.json
│   ├── ReadMe.md                # Backend-specific docs
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema (4 models)
│   │   └── migrations/          # 3 migration steps
│   └── src/
│       ├── app.js               # Server entry point
│       ├── config/              # Env vars, Prisma client
│       ├── controllers/         # HTTP request handlers
│       ├── middleware/           # Auth, role checks
│       ├── routes/              # URL → controller mapping
│       ├── services/            # Database operations
│       └── utils/               # Cloudinary, Multer config
│
└── frontend/
    ├── index.html               # SPA entry point
    ├── vite.config.js           # Vite + Tailwind plugins
    ├── package.json
    ├── README.md                # Frontend-specific docs
    └── src/
        ├── main.jsx             # React bootstrap
        ├── App.jsx              # Root component
        ├── index.css            # Global styles
        ├── api/                 # API call functions
        ├── components/          # Reusable UI components
        ├── context/             # Auth state (React Context)
        ├── pages/               # Route-level pages
        └── routes/              # Route definitions
```

---

## How Authentication Works

### End-to-End Auth Flow

```
1. REGISTER / LOGIN
   Frontend                    Backend                     Database
      |                           |                           |
      |-- POST /api/auth/login -->|                           |
      |                           |-- findUserByEmail() ----->|
      |                           |<-- user record -----------|
      |                           |-- bcrypt.compare()        |
      |                           |-- jwt.sign({id, email, role})
      |                           |-- Set-Cookie: token=...   |
      |<-- { user, token } -------|                           |

2. SUBSEQUENT REQUESTS
   Frontend                    Backend                     Database
      |                           |                           |
      |-- GET /api/posts -------->|                           |
      |   (Cookie: token=...)     |-- cookie-parser           |
      |                           |-- jwt.verify()            |
      |                           |-- req.user = {id, role}   |
      |                           |-- findMany() ------------>|
      |<-- posts data ------------|                           |

3. PAGE REFRESH
   Frontend                    Backend
      |                           |
      |-- GET /api/auth/me ------>|
      |   (Cookie: token=...)     |-- jwt.verify()
      |<-- { user } --------------|
      | AuthContext.setUser()     |
```

### Why httpOnly Cookies Over localStorage?

| Factor | httpOnly Cookie | localStorage |
|---|---|---|
| **XSS protection** | Token inaccessible to JavaScript | Any XSS attack can steal the token |
| **Automatic sending** | Browser sends cookie with every request | Must manually attach `Authorization` header |
| **Expiration** | Browser handles expiry | Must implement manual cleanup |
| **Security** | Cannot be read by client-side code | Fully accessible to any script on the page |

### Why JWT Over Session-Based Auth?

| Factor | JWT | Server Sessions |
|---|---|---|
| **Scalability** | Stateless — any server instance can verify | Requires shared session store (Redis) |
| **No server storage** | Token is self-contained | Each session stored in memory/DB |
| **Microservices** | Works across multiple services | Tied to one server or shared store |

### Three Levels of Auth Middleware

```
No Auth        →  Public routes (home, post listing)
Optional Auth  →  Routes that behave differently for logged-in users (post detail shows "liked by me")
Required Auth  →  Routes that need authentication (create post, like, comment)
Role-Based     →  Admin-only routes (admin dashboard, user management)
```

### Token Payload

```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "USER",
  "iat": 1787221592,
  "exp": 1787307992
}
```

---

## How Image Upload Works

### Upload Flow

```
User selects image
       |
       v
Frontend: FormData.append("image", file)
       |
       v
Axios: POST /api/posts (Content-Type: multipart/form-data)
       |
       v
Multer: Memory storage → file.buffer (no disk writes)
       |
       v
Controller: Buffer → Base64 data URI → Cloudinary upload
       |
       v
Cloudinary returns: { secure_url, public_id }
       |
       v
Database: Store URL + public_id in Post record
```

### Why Cloudinary?

| Alternative | Why Cloudinary Won |
|---|---|
| Local file storage | Doesn't scale, hard to deploy, no CDN |
| AWS S3 | More complex setup, requires additional SDK |
| Firebase Storage | Vendor lock-in to Google ecosystem |
| **Cloudinary** | Free tier, built-in image transformations, easy API, CDN included |

### Why Multer Memory Storage?

- **No temp files** — Images go directly from request buffer to Cloudinary
- **Simpler deployment** — No need to manage disk space or temp directories
- **Security** — No files written to server disk means no file cleanup or path traversal risks

### Image Lifecycle

| Action | What Happens |
|---|---|
| **Create post** | Upload new image to Cloudinary, store URL + public_id |
| **Update post with new image** | Delete old image from Cloudinary, upload new one |
| **Delete post** | Delete image from Cloudinary, then delete record from DB |

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    User      │       │    Post      │
├─────────────┤       ├─────────────┤
│ id          │──┐    │ id          │
│ name        │  │    │ title       │
│ email       │  │    │ content     │
│ password    │  ├───>│ authorId    │
│ role        │  │    │ image       │
│ createdAt   │  │    │ imagePublicId│
│ updatedAt   │  │    │ likesCount  │
└─────────────┘  │    │ createdAt   │
       │         │    │ updatedAt   │
       │         │    └──────┬──────┘
       │         │           │
       │    ┌────┴───────────┴────┐
       │    │                      │
       │    v                      v
  ┌────┴──────┐          ┌──────────────┐
  │  Comment   │          │     Like      │
  ├───────────┤          ├──────────────┤
  │ id        │          │ id           │
  │ text      │          │ userId       │
  │ userId ───┤          │ postId       │
  │ postId ───┤          │ createdAt    │
  │ createdAt │          └──────────────┘
  └───────────┘             UNIQUE(userId, postId)
```

### Why These Design Choices?

| Choice | Reason |
|---|---|
| **`likesCount` on Post** | Denormalized count avoids expensive `COUNT(*)` queries on every post listing. Maintained via atomic increment/decrement in `toggleLike`. |
| **`imagePublicId` alongside `image` URL** | URL is for display; public_id is needed to delete/update images on Cloudinary |
| **Unique constraint on Like(userId, postId)** | Prevents duplicate likes at the database level — one like per user per post |
| **Cascade deletion on foreign keys** | Deleting a User automatically removes their Posts, Comments, and Likes — no orphaned records |
| **Role enum (USER/ADMIN)** | Database-level enum prevents invalid role values |
| **Indexes on foreign keys** | `authorId`, `userId`, `postId` are indexed for fast JOIN queries |

### Why Not Store Likes as an Array of User IDs?

- Arrays don't scale — reading all likes requires loading the entire array
- No referential integrity — can't enforce "user must exist"
- Can't efficiently query "has user X liked this post?"
- The junction table (Like model) is the standard relational pattern and performs better at scale

---

## API Design

### RESTful Conventions

| Convention | Implementation |
|---|---|
| **Nouns for resources** | `/api/posts`, `/api/auth`, `/api/posts/:id/comments` |
| **HTTP verbs for actions** | GET (read), POST (create), PUT/PATCH (update), DELETE (remove) |
| **Consistent responses** | `{ success: true, data: {...} }` or `{ success: false, error: "..." }` |
| **Proper status codes** | 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 500 (Server Error) |
| **Nested resources** | Comments are nested under posts: `/api/posts/:postId/comments` |

### Route Summary

| Domain | Routes | Auth Levels |
|---|---|---|
| **Health** | `GET /api/health` | Public |
| **Auth** | register, login, logout, me, users | Public / Required / Admin |
| **Posts** | CRUD + like toggle | Public (read) / Required (write) |
| **Comments** | list, add, delete (nested under posts) | Public (read) / Required (write) |

### Why PATCH and PUT for Post Updates?

- **PUT** replaces the entire resource — all fields must be sent
- **PATCH** partially updates — only changed fields need to be sent
- Both are supported to allow flexibility; the frontend uses PATCH for partial updates

---

## Frontend Architecture

### State Management Strategy

| State Type | Solution | Why |
|---|---|---|
| **Auth state** (user, loading) | React Context | Shared across all components, changes infrequently |
| **Page state** (posts, comments, search) | Local `useState` | Page-specific, doesn't need global sharing |
| **Form state** (inputs, validation) | Local `useState` | Ephemeral, only relevant during form interaction |
| **UI state** (dropdowns, modals, menus) | Local `useState` | Component-specific, no cross-component needs |

**Why not Redux/Zustand?** The app is small enough that React Context + local state covers all needs without adding bundle size or complexity.

### Component Architecture

```
App
├── AuthProvider (Context)
│   ├── Toaster
│   ├── Navbar
│   └── AppRoutes
│       ├── Home → PostCard[] → Comment[]
│       ├── Login
│       ├── Register
│       ├── PostDetails → Comment[]
│       ├── CreatePost
│       ├── EditPost
│       └── AdminDashboard → ConfirmDialog
```

### Key Frontend Patterns

| Pattern | Implementation |
|---|---|
| **Centralized API layer** | All HTTP calls in `api/` folder, one file per domain (auth, posts, comments) |
| **Pre-configured Axios** | Single instance with `baseURL` and `withCredentials: true` — every API call inherits this config |
| **Protected routes** | `ProtectedRoute` wrapper checks auth + role before rendering children |
| **Route constants** | All paths in `route.js` — no hardcoded strings scattered across components |
| **Optimistic updates** | UI updates immediately after API calls (delete post → remove from list instantly) |
| **Skeleton loading** | Loading component mimics the layout it replaces (grid of cards, centered spinner) |
| **FormData for uploads** | Post create/edit use `FormData` for multipart image uploads |
| **Responsive design** | Mobile hamburger menu, responsive grid (1/2/3 columns), Tailwind responsive prefixes |

### Why `useMemo` for Sorting/Filtering?

The Home page uses `useMemo` to avoid re-computing filtered/sorted posts on every render:

```jsx
const filteredPosts = useMemo(() => {
  return posts
    .filter(post => /* search match */)
    .sort((a, b) => /* sort logic */)
}, [posts, searchQuery, sortBy])
```

Without `useMemo`, the filter+sort would run on every keystroke in the search box, even when posts haven't changed.

---

## Security Measures

| Layer | Measure | Implementation |
|---|---|---|
| **Password** | Hashing | bcrypt with 10 salt rounds — never stored plain text |
| **Auth tokens** | httpOnly cookies | JWT inaccessible to JavaScript, prevents XSS theft |
| **Auth tokens** | Secure flag (production) | Cookies only sent over HTTPS in production |
| **Auth tokens** | SameSite: strict | Prevents CSRF attacks |
| **Auth tokens** | 24-hour expiry | Tokens expire automatically |
| **Headers** | Helmet | Sets X-Content-Type-Options, X-Frame-Options, etc. |
| **CORS** | Origin whitelist | Only `CLIENT_URL` (localhost:5173) can make requests |
| **Input** | Validation | Name (2-50 chars), email (regex), password (8+ chars), title (<200), content (<5000) |
| **Input** | Size limits | JSON body limited to 10kb, image upload limited to 5MB |
| **Authorization** | Owner-or-admin | Only post owner or ADMIN can edit/delete |
| **Authorization** | Role checks | Admin routes verify `req.user.role === "ADMIN"` |
| **Env vars** | .env file | Secrets never committed to git (in .gitignore) |

---

## Key Design Decisions & Trade-offs

### Denormalized `likesCount` on Post

**Decision:** Store `likesCount` directly on the Post table instead of computing `COUNT(*)` from the Like table.

**Trade-off:**
- **Pro:** Post listing query is fast — no aggregation needed
- **Con:** Extra write on every like/unlike (increment/decrement)
- **Verdict:** Read-heavy application — reads outnumber writes, so this optimization is worth it

### Cookie-Based Auth Over Bearer Token

**Decision:** Store JWT in httpOnly cookie instead of requiring `Authorization: Bearer` header from frontend.

**Trade-off:**
- **Pro:** Automatic sending, XSS protection, simpler frontend code
- **Con:** CORS must be configured correctly, harder to test with tools like Postman
- **Verdict:** Better security posture for a web application

### Separate Services Layer

**Decision:** Controllers don't access the database directly — they call service functions.

**Trade-off:**
- **Pro:** Business logic reusable across controllers, easier to test, cleaner separation
- **Con:** More files and indirection for a small app
- **Verdict:** Good practice even for small apps — scales better as features grow

### No TypeScript

**Decision:** Used plain JavaScript (JSX) instead of TypeScript.

**Trade-off:**
- **Pro:** Faster to write, no type definitions needed, simpler setup
- **Con:** No compile-time type checking, less IDE support
- **Verdict:** `@types/react` installed for editor intellisense — practical compromise for an intern project

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- PostgreSQL running locally
- Cloudinary account (free tier)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, Cloudinary credentials

# Run database migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Test Credentials

| Role | Email | Password |
|---|---|---|
| USER | alice@test.com | pass123 |
| USER | bob@test.com | pass123 |
| ADMIN | contact@post.com | admin123 |

---

## Challenges Faced

### 1. JWT in Cookies + CORS
**Problem:** Cookies weren't being sent with cross-origin requests.
**Solution:** Set `credentials: "include"` on Axios, `withCredentials: true` on CORS, and configured `sameSite: "strict"`.

### 2. Image Upload Pipeline
**Problem:** Files needed to go from browser → server → Cloudinary without writing to disk.
**Solution:** Used Multer's memory storage to get a buffer, converted to base64 data URI, uploaded directly to Cloudinary.

### 3. Like Toggle Logic
**Problem:** Like button needed to add or remove a like based on current state.
**Solution:** Check if Like record exists → if yes, delete it and decrement `likesCount`; if no, create it and increment `likesCount`. Unique constraint prevents duplicates.

### 4. Owner-or-Admin Authorization
**Problem:** Both the post owner and admins should be able to edit/delete posts.
**Solution:** Inline check in controllers: `if (post.authorId !== user.id && user.role !== "ADMIN") return 403`.

### 5. Optional Auth for Post Detail
**Problem:** Post detail should show "liked by me" for logged-in users but work for guests too.
**Solution:** `optionalAuth` middleware that sets `req.user = null` if no token, instead of returning 401.

---

## What I Would Improve

| Area | Improvement |
|---|---|
| **Testing** | Add unit tests for services and integration tests for API routes (Jest + Supertest) |
| **TypeScript** | Migrate both frontend and backend to TypeScript for type safety |
| **Pagination** | Add cursor-based pagination for post listings instead of loading all posts |
| **Search** | Server-side full-text search using PostgreSQL's `tsvector` instead of client-side filtering |
| **Rate limiting** | Add `express-rate-limit` to prevent API abuse |
| **Image optimization** | Use Cloudinary's auto-format and quality transformations |
| **Error tracking** | Integrate Sentry or similar for production error monitoring |
| **CI/CD** | Add GitHub Actions for automated testing and deployment |
| **Comments pagination** | Paginate comments for posts with many comments |
| **Real-time updates** | WebSocket notifications for new comments and likes |
| **E2E tests** | Playwright or Cypress tests for critical user flows |
