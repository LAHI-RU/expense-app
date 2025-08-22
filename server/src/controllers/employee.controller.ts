import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createEmployeeSchema, updateEmployeeSchema } from '../schemas/employee';

export async function createEmployee(req: Request, res: Response) {
    const parsed = createEmployeeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const emp = await prisma.employee.create({ data: parsed.data });
    res.status(201).json(emp);
}

export async function listEmployees(_req: Request, res: Response) {
    const employees = await prisma.employee.findMany({ orderBy: { name: 'asc' } });
    res.json(employees);
}

export async function getEmployee(req: Request, res: Response) {
    const id = Number(req.params.id);
    const emp = await prisma.employee.findUnique({ where: { id } });
    if (!emp) return res.status(404).json({ message: 'Not found' });
    res.json(emp);
}

export async function updateEmployee(req: Request, res: Response) {
    const id = Number(req.params.id);
    const parsed = updateEmployeeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const emp = await prisma.employee.update({ where: { id }, data: parsed.data });
    res.json(emp);
}

export async function deleteEmployee(req: Request, res: Response) {
    const id = Number(req.params.id);
    await prisma.employee.delete({ where: { id } });
    res.status(204).send();
}
