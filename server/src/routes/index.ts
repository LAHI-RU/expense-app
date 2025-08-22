import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { auth } from '../middlewares/auth';
import {
    createEmployee, listEmployees, getEmployee, updateEmployee, deleteEmployee
} from '../controllers/employee.controller';
import {
    createExpense, listExpenses, getExpense, updateExpense, deleteExpense, summaryByEmployee
} from '../controllers/expense.controller';
// import { exportCSV } from '../controllers/report.controller';
import { exportPDF } from '../controllers/exportPDF.controller';

const r = Router();

// Auth
r.post('/auth/register', register);
r.post('/auth/login', login);

// Employees
r.get('/employees', auth, listEmployees);
r.post('/employees', auth, createEmployee);
r.get('/employees/:id', auth, getEmployee);
r.put('/employees/:id', auth, updateEmployee);
r.delete('/employees/:id', auth, deleteEmployee);

// Expenses
r.get('/expenses', auth, listExpenses);
r.post('/expenses', auth, createExpense);
r.get('/expenses/:id', auth, getExpense);
r.put('/expenses/:id', auth, updateExpense);
r.delete('/expenses/:id', auth, deleteExpense);

// Summaries & Reports
r.get('/reports/summary/employee', auth, summaryByEmployee);
// r.get('/reports/export.csv', auth, exportCSV);
r.get('/reports/export.pdf', auth, exportPDF);

export default r;
