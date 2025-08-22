import { z } from 'zod';

export const createExpenseSchema = z.object({
    employeeId: z.number().int().positive(),
    date: z.string().datetime().optional(), // ISO string
    amount: z.number().positive(),
    category: z.enum(['ADVANCE', 'MATERIAL', 'TRAVEL', 'OTHER']).optional(),
    description: z.string().optional(),
});

export const expenseFilterSchema = z.object({
    employeeId: z.string().optional(),
    from: z.string().optional(), // YYYY-MM-DD
    to: z.string().optional(),
    category: z.enum(['ADVANCE', 'MATERIAL', 'TRAVEL', 'OTHER']).optional(),
    minAmount: z.string().optional(),
    maxAmount: z.string().optional(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
    sort: z.string().optional(), // e.g., "date desc"
});
