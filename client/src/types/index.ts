export type Employee = { id: number; name: string; phone?: string; active: boolean };
export type Expense = {
    id: number; employeeId: number; date: string; amount: number;
    category: 'ADVANCE' | 'MATERIAL' | 'TRAVEL' | 'OTHER';
    description?: string; employee?: Employee
};
