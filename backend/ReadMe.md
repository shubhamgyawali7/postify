# Blogify - Backend API

RESTful API server for the **Blogify** blogging platform. Handles user authentication, post management with image uploads, comments, likes, and role-based admin features.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Express 5** | Web framework for building the REST API |
| **Prisma** | Type-safe ORM for database access and migrations |
| **PostgreSQL** | Relational database for storing all application data |
| **JWT (jsonwebtoken)** | Stateless authentication via tokens (24h expiry) |
| **bcrypt** | Secure password hashing with salt rounds |
| **Cloudinary** | Cloud-based image hosting for post images |
| **Multer** | Multipart file upload handling (in-memory) |
| **Helmet** | Security HTTP headers middleware |
| **CORS** | Cross-Origin Resource Sharing for frontend integration |
| **Morgan** | HTTP request logging (development mode) |
| **cookie-parser** | Parsing JWT tokens from cookies |
| **dotenv** | Environment variable management |

## Project Structure

```
backend/
├── .env.example              # Environment variable template
├── .gitignore
├── nodemon.json              # Dev server auto-restart config
├── package.json
├── ReadMe.md
│
├── prisma/
│   ├── schema.prisma         # Database schema (User, Post, Comment, Like)
│   └── migrations/
│       ├── 20260820072757_init/              # User + Post tables
│       ├── 20260820125637_add_post_image/    # Image columns on Post
│       └── 20260820202200_init/              # Comment + Like tables, likesCount
│
└── src/
    ├── app.js                # Entry point: Express server setup & startup
    │
    ├── config/
    │   ├── env.js            # Centralized environment variable loader
    │   └── prisma.js         # Singleton PrismaClient instance
    │
    ├── controllers/
    │   ├── authController.js     # Register, login, logout, getMe, getAllUsers
    │   ├── commentController.js  # Add, list, delete comments
    │   └── postController.js     # Post CRUD, like toggle, image upload
    │
    ├── middleware/
    │   ├── createJwtToken.js     # JWT token creation helper
    │   ├── optionalAuth.js       # Optional JWT verification (sets req.user or null)
    │   ├── roleBasedAuth.js      # Role-based access control
    │   └── verifyAuth.js         # Required JWT verification
    │
    ├── routes/
    │   ├── auth.routes.js        # /api/auth/*
    │   ├── comment.routes.js     # /api/posts/:postId/comments/*
    │   ├── health.routes.js      # /api/health
    │   └── post.routes.js        # /api/posts/*
    │
    ├── services/
    │   ├── auth.service.js       # User DB operations, password hashing
    │   ├── comment.service.js    # Comment DB operations
    │   └── post.service.js       # Post DB operations, like toggle logic
    │
    └── utils/
        ├── cloudinary.js         # Cloudinary upload/remove helpers
        └── multer.js             # Multer memory-storage config (images only, 5MB)
```

## Why Each Dependency

| Package | Why It's Used |
|---|---|
| `express` | Fast, minimal framework for building REST APIs with middleware support |
| `@prisma/client` | Eliminates raw SQL queries, provides type-safe database access with automatic query optimization |
| `bcrypt` | Industry-standard password hashing — never stores plain-text passwords |
| `jsonwebtoken` | Enables stateless auth — no session storage needed on the server |
| `cloudinary` | Offloads image storage/CDN to a cloud provider, keeps the server lightweight |
| `multer` | Handles `multipart/form-data` parsing for file uploads from the frontend |
| `cors` | Allows the React frontend (different port) to make API requests to this server |
| `helmet` | Sets security headers (XSS protection, content-type sniffing prevention, etc.) |
| `morgan` | Logs incoming requests during development for debugging |
| `cookie-parser` | Reads JWT tokens from httpOnly cookies set during login |
| `dotenv` | Loads secrets and config from `.env` instead of hardcoding them |
| `nodemon` | Auto-restarts the server on file changes during development |
| `prisma` | CLI tool for running migrations and opening Prisma Studio |

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/blogify
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## API Routes

### Health
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Server health check |

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a new user account |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| POST | `/api/auth/logout` | Public | Clear auth cookie |
| GET | `/api/auth/me` | Required | Get current user profile |
| GET | `/api/auth/users` | Admin | List all users |

### Posts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/posts` | Public | List all posts with author info and comment counts |
| GET | `/api/posts/:id` | Optional | Get single post with like status |
| POST | `/api/posts` | Required | Create post with image upload |
| PUT | `/api/posts/:id` | Required | Update post (owner or admin) |
| PATCH | `/api/posts/:id` | Required | Update post (alias) |
| DELETE | `/api/posts/:id` | Required | Delete post (owner or admin) |
| POST | `/api/posts/:id/like` | Required | Toggle like on a post |

### Comments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/posts/:postId/comments` | Public | List comments for a post |
| POST | `/api/posts/:postId/comments` | Required | Add comment to a post |
| DELETE | `/api/posts/:postId/comments/:commentId` | Required | Delete comment (owner or admin) |

## Database Schema

- **User** — id, name, email (unique), password, role (USER/ADMIN), timestamps
- **Post** — id, title, content, image URL, imagePublicId, authorId, likesCount, timestamps
- **Comment** — id, text, userId, postId, timestamp
- **Like** — id, userId, postId, timestamp (unique constraint on userId+postId)

All foreign keys use cascade deletion — deleting a user removes their posts, comments, and likes.

## NPM Scripts

```bash
npm run dev              # Start development server with hot-reload (nodemon)
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client from schema
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (browser DB GUI)
```

## Architecture

The backend follows a **layered architecture**:

```
Routes  →  Controllers  →  Services  →  Database (Prisma)
```

- **Routes** define URL mappings and apply middleware chains (auth, file upload)
- **Controllers** handle HTTP concerns: request parsing, validation, response formatting
- **Services** encapsulate business logic and all database operations
- **Config** provides singleton instances (PrismaClient, env vars)
- **Utils** handle external service integrations (Cloudinary, Multer)

### Key Patterns

- **Three-tier auth**: public routes, optional auth (for "liked by me"), required auth, and role-gated admin routes
- **Owner-or-admin authorization**: Post/comment modifications check ownership or ADMIN role
- **Denormalized likes count**: `likesCount` on Post is maintained via increment/decrement for read performance
- **Dual token delivery**: JWT set as httpOnly cookie AND returned in response body
- **Cascade deletion**: Database-level cascading removes dependent records automatically
