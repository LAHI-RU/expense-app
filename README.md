
# Expense App

> **Effortless Expense Management for Teams**
>
> Take control of your business spending with ExpenseApp. Track, approve, and report expenses in real time. Empower your employees, simplify reimbursements, and gain actionable insights—all in one secure, easy-to-use platform.

A full-stack expense management application for tracking, reporting, and managing employee expenses. Built with a modern tech stack for scalability and maintainability.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User authentication (register, login)
- Role-based access (admin, employee)
- Employee management
- Expense submission and approval
- Expense reports and PDF export
- Dashboard with analytics

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Other:** JWT Auth, ESLint, Prettier

## Project Structure
```
expense-app/
├── client/   # Frontend (React)
└── server/   # Backend (Node.js/Express)
```

### Client
- `src/pages/` — Main app pages (Dashboard, Login, Register, etc.)
- `src/components/` — Reusable UI components
- `src/api/` — API request logic
- `src/layouts/` — Layout components
- `src/types/` — TypeScript types

### Server
- `src/controllers/` — Route handlers
- `src/routes/` — API route definitions
- `src/middlewares/` — Express middlewares
- `src/schemas/` — Validation schemas
- `src/services/` — Business logic
- `prisma/` — Prisma schema, migrations, and seed data

## Getting Started

## 🚀 Deploying to Vercel (Recommended)

You can host both the frontend and backend for free using [Vercel](https://vercel.com/). Vercel supports monorepos and makes deployment simple:

1. **Push your code to GitHub** (if not already).
2. **Sign up at [vercel.com](https://vercel.com/)** and connect your GitHub account.
3. **Import your repository** into Vercel.
4. When prompted, set up two projects:
  - **Frontend:** Set the root directory to `client`, build command to `npm run build`, and output directory to `dist`.
  - **Backend:** Set the root directory to `server`, build command to `npm install` (or `npm run build` if you have a build step), and leave output directory blank for Node.js.
5. **Set environment variables** for your backend (e.g., database connection string) in the Vercel dashboard.
6. **Deploy!** Vercel will build and host both apps. You’ll get live URLs for both frontend and backend.

**Note:**
- The provided `vercel.json` files help Vercel detect and deploy each part of your app correctly.
- Update your frontend API URLs to point to the deployed backend if needed.

---

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database

### 1. Clone the repository
```sh
git clone https://github.com/LAHI-RU/expense-app.git
cd expense-app
```

### 2. Install dependencies
```sh
cd client
npm install
cd ../server
npm install
```

### 3. Configure environment variables
- Copy `.env.example` to `.env` in the `server/` directory and update values as needed.

### 4. Set up the database
```sh
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run the development servers
- **Backend:**
  ```sh
  cd server
  npm run dev
  ```
- **Frontend:**
  ```sh
  cd client
  npm run dev
  ```

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Lint code
- `npm run format` — Format code

## API Overview
The backend exposes RESTful endpoints for authentication, employees, expenses, and reports. See `server/src/routes/` for details.

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and submit a pull request

## License
This project is licensed under the MIT License.
