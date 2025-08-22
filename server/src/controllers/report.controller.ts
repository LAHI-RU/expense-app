import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function exportCSV(_req: Request, res: Response) {
    const items = await prisma.expense.findMany({ include: { employee: true }, orderBy: { date: 'desc' } });
    const rows = [
        ['id', 'employee', 'date', 'amount', 'category', 'description'],
        ...items.map(i => [
            i.id,
            i.employee?.name ?? '',
            i.date.toISOString(),
            i.amount.toString(),
            i.category,
            i.description ?? ''
        ])
    ];
    const csv = rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
    res.send(csv);
}
