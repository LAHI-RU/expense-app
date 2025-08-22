# Expense App

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
