# 🎬 BookMyShow Clone (MyShow)

A modern, full-stack movie booking and cinema ticket reservation web application built with the **MERN** stack (MongoDB, Express.js, React, Node.js) and powered by **Vite** and **Tailwind CSS**.

---

## 🌐 Live Demo

- **Frontend (Vercel):** [https://book-my-show-sooty.vercel.app/](https://book-my-show-sooty.vercel.app/)
- **Backend API (Render):** [https://book-my-show-gk9z.onrender.com/health](https://book-my-show-gk9z.onrender.com/health)

---

## ✨ Features

- **🎬 Dynamic Movie Catalog:** Browse now-showing and upcoming movies with real-time data and high-res posters from TMDB.
- **🎟️ Interactive Seat Booking:** Select theaters, showtimes, and pick your preferred seats with real-time pricing and summary.
- **🔐 User Authentication:** Secure user registration and login with JWT authentication and encrypted passwords.
- **👥 Admin & User Management:** Comprehensive dashboard to inspect registered users, user tiers, active statuses, and booking histories.
- **📱 Responsive & Modern UI:** Glassmorphism cinema-themed dark UI built with Tailwind CSS and Lucide React icons.
- **☁️ Cloud Deployments:** Frontend hosted on Vercel with SPA routing, backend hosted on Render, and database hosted on MongoDB Atlas.

---

## 🛠️ Tech Stack

### Frontend (`movie-booking/`)
- **Framework:** React with Vite
- **Styling:** Tailwind CSS, PostCSS
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Hosting:** Vercel

### Backend (`backend/`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt
- **CORS & Env:** Cors, Dotenv
- **Hosting:** Render

---

## 📁 Project Structure

```text
Book_My_Show/
├── .gitignore
├── README.md
├── backend/                        # Node.js + Express API
│   ├── controllers/                # Request handlers (userController.js)
│   ├── models/                     # Mongoose schemas (User.js)
│   ├── routes/                     # API routes (userRoutes.js)
│   ├── .env.example                # Sample environment variables
│   ├── package.json
│   └── server.js                   # Server entry point
└── movie-booking/                  # React + Vite Frontend
    ├── public/                     # Static assets & icons
    ├── src/
    │   ├── assets/                 # Backgrounds & media
    │   ├── auth/                   # Auth views (Login, Signup)
    │   ├── components/             # Reusable UI & Auth components
    │   ├── config/                 # API base configuration (api.js)
    │   ├── pages/                  # Home, Movies, UserManagement
    │   ├── App.jsx                 # Routes & Layout
    │   └── main.jsx                # React root
    ├── package.json
    ├── vercel.json                 # SPA routing rewrites for Vercel
    └── vite.config.js
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)

---

### 1. Clone the Repository
```bash
git clone https://github.com/manchalaganesh/Book_My_Show.git
cd Book_My_Show
```

---

### 2. Backend Setup
1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory based on `.env.example`:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend development server:
   ```bash
   node server.js
   ```
   *Backend will run at `http://localhost:3000`.*

---

### 3. Frontend Setup
1. Open a second terminal and navigate to `movie-booking`:
   ```bash
   cd movie-booking
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file in `movie-booking/`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   *(If omitted, it defaults to your live Render backend).*
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Frontend will run at `http://localhost:5173`.*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check and status |
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Authenticate user & return JWT token |
| `GET` | `/users` | Retrieve registered users list |
| `PATCH` | `/users/:id` | Update user details/status |
| `DELETE` | `/users/:id` | Remove a user |
