// ...existing code...

export const updateEmployee = async (id: number, body: { name?: string; phone?: string; active?: boolean }) => {
    const { data } = await http.put(`/employees/${id}`, body);
    return data as Employee;
};

export const deleteEmployee = async (id: number) => {
    await http.delete(`/employees/${id}`);
};
import { http } from './http';
import type { Employee } from '../types';

export const listEmployees = async (): Promise<Employee[]> => {
    const { data } = await http.get('/employees');
    return data;
};

export const createEmployee = async (body: { name: string; phone?: string }) => {
    const { data } = await http.post('/employees', body);
    return data as Employee;
};
