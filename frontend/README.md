# Blogify - Frontend

Single-Page Application (SPA) for the **Blogify** blogging platform. Built with React 19 and styled with Tailwind CSS v4. Features user registration, post creation with image uploads, comments, likes, search/sort, and an admin dashboard.

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library with concurrent features and hooks |
| **React Router v7** | Client-side routing and navigation |
| **Tailwind CSS v4** | Utility-first CSS framework for styling |
| **Axios** | HTTP client for API communication |
| **Lucide React** | Lightweight, tree-shakeable icon library |
| **React Hot Toast** | Toast notification system for user feedback |
| **Vite 8** | Build tool with HMR dev server |
| **ESLint 10** | JavaScript/JSX linting |

## Project Structure

```
frontend/
├── index.html              # SPA entry point (loads Google Fonts, mounts React)
├── package.json
├── vite.config.js          # Vite config (React + Tailwind plugins)
├── eslint.config.js        # ESLint flat config
├── .env                    # Environment variables
├── .gitignore
│
└── src/
    ├── main.jsx            # App bootstrap (StrictMode + BrowserRouter)
    ├── App.jsx             # Root component (AuthProvider, Toaster, Navbar, Routes)
    ├── index.css           # Global styles, Tailwind import, design tokens
    │
    ├── api/
    │   ├── axios.js        # Pre-configured Axios instance (baseURL, credentials)
    │   ├── auth.js         # Auth API calls (login, register, logout, getMe, getUsers)
    │   ├── posts.js        # Posts API calls (CRUD, like toggle, image upload)
    │   └── comments.js     # Comments API calls (list, add, delete)
    │
    ├── components/
    │   ├── Navbar.jsx          # Sticky nav with glass effect, user dropdown, mobile menu
    │   ├── PostCard.jsx        # Post card with image, title, preview, likes, comments
    │   ├── ProtectedRoute.jsx  # Route guard (auth check + role-based access)
    │   ├── Loading.jsx         # Skeleton grid or centered spinner
    │   ├── ConfirmDialog.jsx   # Modal confirmation dialog for destructive actions
    │   └── Comment.jsx         # Single comment with author info, time, delete button
    │
    ├── context/
    │   └── AuthContext.jsx     # Global auth state (user, login, register, logout)
    │
    ├── pages/
    │   ├── Home.jsx            # Post listing with search, sort, and responsive grid
    │   ├── Login.jsx           # Login form with show/hide password
    │   ├── Register.jsx        # Registration form with validation
    │   ├── PostDetails.jsx     # Single post view with comments and like button
    │   ├── CreatePost.jsx      # New post form with image upload and preview
    │   ├── EditPost.jsx        # Edit post form with existing image handling
    │   └── AdminDashboard.jsx  # Admin: stats, posts table, users table
    │
    └── routes/
        ├── Routes.jsx          # Route definitions with guards
        └── route.js            # Route path constants and helper functions
```

## Why Each Dependency

| Package | Why It's Used |
|---|---|
| `react` | Declarative component-based UI with hooks for state and effects |
| `react-dom` | Renders React components into the browser DOM |
| `react-router-dom` | Enables SPA navigation without page reloads, URL params, nested routes |
| `axios` | Configurable HTTP client with `withCredentials` for cookie-based auth |
| `tailwindcss` | Rapid UI development with utility classes, no custom CSS files needed |
| `@tailwindcss/vite` | Integrates Tailwind CSS v4 directly into the Vite build pipeline |
| `lucide-react` | Lightweight icons (Heart, Search, Menu, etc.) that tree-shake for small bundle size |
| `react-hot-toast` | Non-intrusive success/error notifications that auto-dismiss |
| `vite` | Lightning-fast dev server with instant HMR and optimized production builds |
| `@vitejs/plugin-react` | JSX transform and React Fast Refresh for development |
| `eslint` | Catches bugs and enforces code quality during development |
| `eslint-plugin-react-hooks` | Enforces Rules of Hooks and exhaustive-deps for correct hook usage |
| `eslint-plugin-react-refresh` | Ensures components work with React Fast Refresh (no state loss on HMR) |

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000
```

This is the base URL for the backend API server.

## Pages & Routes

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | Home | Public | Browse all posts with search and sort |
| `/login` | Login | Public | Sign in to your account |
| `/register` | Register | Public | Create a new account |
| `/posts/:id` | PostDetails | Public | View a single post with comments and likes |
| `/posts/create` | CreatePost | Authenticated | Create a new post with image upload |
| `/posts/:id/edit` | EditPost | Owner/Admin | Edit an existing post |
| `/admin` | AdminDashboard | Admin only | Manage posts and view all users |

## Key Features

- **Post Management** — Create, edit, delete posts with image uploads (Cloudinary)
- **Search & Sort** — Filter posts by title, content, or author name; sort by latest, most liked, or alphabetical
- **Likes** — Toggle likes on posts with real-time count updates
- **Comments** — Add and delete comments on posts
- **Authentication** — Cookie-based sessions with httpOnly cookies (no localStorage)
- **Role-Based Access** — USER and ADMIN roles with route-level and UI-level guards
- **Admin Dashboard** — View all posts and users, manage content
- **Responsive Design** — Mobile-first with hamburger menu and responsive grid
- **Loading States** — Skeleton shimmer grids and spinners for smooth UX

## NPM Scripts

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint on the project
```

## Architecture

The frontend follows a **feature-based folder structure**:

```
src/
  api/        → Data layer (all HTTP calls, one file per domain)
  components/ → Reusable UI primitives
  context/    → Global state providers (auth only)
  pages/      → Route-level components (one per URL)
  routes/     → Route definitions and path constants
```

### Key Patterns

- **Centralized API Layer** — All HTTP requests go through a single pre-configured Axios instance (`api/axios.js`). Domain-specific API functions are organized into separate modules (`auth.js`, `posts.js`, `comments.js`).
- **Context-Based Auth** — A single `AuthContext` provides global auth state. The session is cookie-based (httpOnly) and rehydrated on page load via `GET /api/auth/me`.
- **Route Protection via Wrapper** — `ProtectedRoute` component handles authentication checks and role-based access control as route wrappers.
- **Local Component State** — All UI state (forms, loading, search, sort) uses `useState` in individual components. Only auth is global.
- **Optimistic UI Updates** — Post/comment deletion and like toggling update local state immediately after API calls for instant feedback.
- **FormData for Uploads** — Post creation and editing use `FormData` objects for multipart/form-data submission to support image uploads.
- **Centralized Route Constants** — All route paths defined as constants in `route.js` with helper functions for parameterized URLs, avoiding hardcoded strings.
- **Reusable Loading States** — `Loading` component provides both skeleton grids (page loads) and spinners (inline operations) with CSS shimmer animation.
