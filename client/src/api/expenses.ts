import { http } from './http';
import type { Expense } from '../types';

export const listExpenses = async (params: Record<string, unknown>) => {
    // Remove empty string params to avoid backend 400 error
    const filteredParams: Record<string, unknown> = {};
    for (const key in params) {
        if (params[key] !== '' && params[key] !== undefined) {
            filteredParams[key] = params[key];
        }
    }
    const { data } = await http.get('/expenses', { params: filteredParams });
    return data as { total: number; page: number; pageSize: number; items: Expense[] };
};

export const createExpense = async (body: Partial<Expense>) => {
    const { data } = await http.post('/expenses', body);
    return data as { expense: Expense; warning?: string | null };
};

export const updateExpense = async (id: number, body: Partial<Expense>) => {
    const { data } = await http.put(`/expenses/${id}`, body);
    return data as Expense;
};

export const deleteExpense = async (id: number) => {
    await http.delete(`/expenses/${id}`);
};
