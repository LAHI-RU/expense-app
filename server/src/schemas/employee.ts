import { z } from 'zod';

export const createEmployeeSchema = z.object({
    name: z.string().min(2),
    phone: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
    active: z.boolean().optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
