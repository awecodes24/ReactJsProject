# InkWell — Blog Platform

A modern, full-featured blog platform built with **React 19**, **Vite**, and **Tailwind CSS v4**. Features role-based authentication, an admin dashboard, and a clean publishing experience. Production-ready and deployable to Vercel or Netlify in minutes.

![InkWell](https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | Register / Login with persistent sessions (localStorage) |
| 👑 Admin Panel | Full control — view, edit, delete any post or user |
| ✍️ Rich Post Editor | Title, subtitle, category, tags, image (URL or file upload), preview mode |
| 🔍 Explore & Search | Search by title/author/content, filter by category, sort by date |
| 📱 Responsive | Mobile-first design, hamburger menu, adaptive layouts |
| 🔔 Toast Notifications | All feedback via react-hot-toast (no more `alert()`) |
| 🛡️ Route Protection | Unauthenticated users are redirected; non-admins can't access admin routes |
| 🏷️ Categories & Tags | Posts tagged with categories and comma-separated tags |
| ⏱️ Reading time | Calculated per-post reading time estimate |
| 📄 404 Page | Clean not-found fallback route |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd inkwell-blog

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Admin Access

The admin account is pre-configured for demo purposes:

| Field | Value |
|---|---|
| Email | `admin@inkwell.dev` |
| Password | `admin123` |

> **Note:** In production, replace this with a server-side authentication system (e.g. Firebase, Supabase, or a custom backend).

Admin can:
- View all posts with thumbnail, category, author, and date
- Edit or delete **any** post
- View all registered users and remove them
- See stats: total posts, user count, active categories

Regular users can:
- Register and log in
- Create new posts
- Edit or delete **only their own** posts

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Responsive nav with auth state
│   ├── BlogCard.jsx        # Post preview card with metadata
│   ├── ProtectedRoute.jsx  # Auth/admin guards for routes
│   └── Spinner.jsx         # Loading spinner
├── context/
│   └── AuthContext.jsx     # Global auth state + login/register/logout
├── pages/
│   ├── Home.jsx            # Hero + featured + latest posts
│   ├── Explore.jsx         # All posts with search/filter/sort
│   ├── SinglePost.jsx      # Full post view + edit/delete controls
│   ├── CreatePost.jsx      # New post form with preview mode
│   ├── EditPost.jsx        # Edit existing post (owner or admin)
│   ├── Login.jsx           # Sign in with password visibility toggle
│   ├── Register.jsx        # Sign up with password strength meter
│   ├── AdminDashboard.jsx  # Full admin control panel
│   └── NotFound.jsx        # 404 fallback
└── utils/
    ├── api.js              # Axios instance + blog CRUD methods
    └── format.js           # formatDate, timeAgo, readingTime helpers
```

---

## 🌐 Deployment

### Vercel (recommended)

```bash
npm run build
```

Then drag the `dist/` folder to [vercel.com/new](https://vercel.com/new), or connect your Git repo.

The included `vercel.json` handles SPA routing automatically:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

### Netlify

Add a `public/_redirects` file:
```
/*  /index.html  200
```

Then deploy via the Netlify dashboard or CLI.

---

## 🔧 Configuration

### Changing the API

The project uses [MockAPI](https://mockapi.io) as a backend. To point to your own API, edit:

```js
// src/utils/api.js
const BASE_URL = "https://YOUR_API_URL/blogs";
```

> For production, always validate admin credentials server-side.

---

## 🛠️ Tech Stack

- **React 19** — UI library
- **Vite 7** — Build tool & dev server
- **Tailwind CSS v4** — Utility-first styling
- **React Router v7** — Client-side routing
- **Axios** — HTTP client
- **react-hot-toast** — Toast notifications

---

## 📸 Pages Overview

| Route | Description |
|---|---|
| `/` | Home — hero section + featured + latest posts |
| `/explore` | All posts with search, category filter, and sort |
| `/blog/:id` | Single post view |
| `/create` | Create new post (requires login) |
| `/edit/:id` | Edit post (owner or admin) |
| `/login` | Sign in |
| `/register` | Create account |
| `/admin` | Admin dashboard (admin only) |

---

