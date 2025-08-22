import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Login from './pages/Login.tsx'
import Layout from './layouts/Layout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Employees from './pages/Employees.tsx'
import Expenses from './pages/Expenses.tsx'
import Reports from './pages/Reports.tsx'
import NotFound from './pages/NotFound.tsx'

const qc = new QueryClient();

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/', element: <Layout />, children: [
      { index: true, element: <Dashboard /> },
      { path: 'employees', element: <Employees /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'reports', element: <Reports /> },
      { path: '*', element: <NotFound /> },
    ]
  },
  { path: '*', element: <NotFound /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
