import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createExpenseSchema, expenseFilterSchema } from '../schemas/expense';
import { addDays, parseISO, startOfMonth, endOfMonth } from 'date-fns';

export async function createExpense(req: Request, res: Response) {
    const parsed = createExpenseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const { employeeId, amount, category = 'OTHER', description } = parsed.data;
    const date = parsed.data.date ? parseISO(parsed.data.date) : new Date();

    let warning: string | null = null;

    if (category === 'ADVANCE') {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);

        const sameMonthAdvance = await prisma.expense.findFirst({
            where: {
                employeeId,
                category: 'ADVANCE',
                date: { gte: monthStart, lte: monthEnd }
            }
        });

        if (sameMonthAdvance) {
            warning = 'Employee has already received an ADVANCE this month.';
        } else {
            // 14-day window check (any category or just ADVANCE)
            const within14 = await prisma.expense.findFirst({
                where: {
                    employeeId,
                    date: { gte: addDays(date, -14), lte: date }
                }
            });
            if (within14) {
                warning = 'This employee had a payment within the last 14 days.';
            }
        }
    }

    const created = await prisma.expense.create({
        data: { employeeId, amount, category, description, date }
    });

    return res.status(201).json({ expense: created, warning });
}

export async function listExpenses(req: Request, res: Response) {
    const parsed = expenseFilterSchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const q = parsed.data;

    const where: any = {};
    if (q.employeeId) where.employeeId = Number(q.employeeId);
    if (q.category) where.category = q.category;
    if (q.from || q.to) {
        where.date = {};
        if (q.from) where.date.gte = new Date(q.from + 'T00:00:00Z');
        if (q.to) where.date.lte = new Date(q.to + 'T23:59:59Z');
    }
    if (q.minAmount || q.maxAmount) {
        where.amount = {};
        if (q.minAmount) where.amount.gte = Number(q.minAmount);
        if (q.maxAmount) where.amount.lte = Number(q.maxAmount);
    }

    const page = q.page ? Number(q.page) : 1;
    const pageSize = q.pageSize ? Number(q.pageSize) : 20;
    const skip = (page - 1) * pageSize;

    const orderBy = q.sort
        ? { [q.sort.split(' ')[0]]: (q.sort.split(' ')[1] || 'asc').toLowerCase() }
        : { date: 'desc' as const };

    const [total, items] = await Promise.all([
        prisma.expense.count({ where }),
        prisma.expense.findMany({
            where,
            include: { employee: true },
            orderBy,
            skip,
            take: pageSize
        })
    ]);

    res.json({ total, page, pageSize, items });
}

export async function getExpense(req: Request, res: Response) {
    const id = Number(req.params.id);
    const item = await prisma.expense.findUnique({ where: { id }, include: { employee: true } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
}

export async function updateExpense(req: Request, res: Response) {
    const id = Number(req.params.id);
    const parsed = createExpenseSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const data = parsed.data;
    const item = await prisma.expense.update({ where: { id }, data });
    res.json(item);
}

export async function deleteExpense(req: Request, res: Response) {
    const id = Number(req.params.id);
    await prisma.expense.delete({ where: { id } });
    res.status(204).send();
}

export async function summaryByEmployee(_req: Request, res: Response) {
    const result = await prisma.expense.groupBy({
        by: ['employeeId'],
        _sum: { amount: true }
    });
    const withNames = await Promise.all(result.map(async r => {
        const emp = await prisma.employee.findUnique({ where: { id: r.employeeId } });
        return { employeeId: r.employeeId, employee: emp?.name, total: r._sum.amount };
    }));
    res.json(withNames);
}
