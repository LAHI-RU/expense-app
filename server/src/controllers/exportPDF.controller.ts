
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import PDFDocument from 'pdfkit';

export async function exportPDF(req: Request, res: Response) {
    const { from, to, employeeId } = req.query;
    const where: any = {};
    if (employeeId) where.employeeId = Number(employeeId);
    if (from || to) {
        where.date = {};
        if (from) where.date.gte = new Date(from as string + 'T00:00:00Z');
        if (to) where.date.lte = new Date(to as string + 'T23:59:59Z');
    }
    const items = await prisma.expense.findMany({
        where,
        include: { employee: true },
        orderBy: { date: 'desc' }
    });

    // Calculate total
    const total = items.reduce((sum, i) => sum + Number(i.amount), 0);

    // Create PDF
    const doc = new PDFDocument({ margin: 36, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.pdf"');
    doc.pipe(res);

    // Title
    doc
        .fontSize(22)
        .fillColor('#2563eb')
        .text('Expense Report', { align: 'center', underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('black');
    doc.text(`Filters: ${employeeId ? 'Employee ID: ' + employeeId + ' ' : ''}${from ? 'From: ' + from + ' ' : ''}${to ? 'To: ' + to : ''}`);
    doc.moveDown(1);

    // Table header styling
    const tableTop = doc.y;
    const colWidths = [80, 120, 80, 80, 140];
    const headers = ['Date', 'Employee', 'Category', 'Amount', 'Description'];
    let x = doc.x;
    doc.font('Helvetica-Bold').fontSize(12);
    headers.forEach((header, i) => {
        doc.rect(x, tableTop, colWidths[i], 24).fillAndStroke('#e0e7ef', '#cbd5e1');
        doc.fillColor('#1e293b').text(header, x + 6, tableTop + 7, { width: colWidths[i] - 12, align: 'left' });
        x += colWidths[i];
    });
    doc.font('Helvetica').fillColor('black');

    // Table rows with zebra striping
    let y = tableTop + 24;
    items.forEach((i, idx) => {
        x = doc.x;
        if (idx % 2 === 0) {
            doc.rect(x, y, colWidths.reduce((a, b) => a + b, 0), 22).fill('#f1f5f9');
        }
        doc.fillColor('black');
        doc.text(new Date(i.date).toLocaleDateString(), x + 6, y + 6, { width: colWidths[0] - 12 });
        x += colWidths[0];
        doc.text(i.employee?.name ?? '', x + 6, y + 6, { width: colWidths[1] - 12 });
        x += colWidths[1];
        doc.text(i.category, x + 6, y + 6, { width: colWidths[2] - 12 });
        x += colWidths[2];
        doc.text(`Rs. ${Number(i.amount).toLocaleString('en-LK')}`, x + 6, y + 6, { width: colWidths[3] - 12 });
        x += colWidths[3];
        doc.text(i.description ?? '', x + 6, y + 6, { width: colWidths[4] - 12 });
        y += 22;
    });

    // Total row
    doc.font('Helvetica-Bold').fillColor('#2563eb');
    doc.text('Total', doc.x + colWidths[0] + colWidths[1] + colWidths[2] + 6, y + 6, { width: colWidths[3] - 12 });
    doc.text(`Rs. ${total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`, doc.x + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 6, y + 6, { width: colWidths[4] - 12 });

    doc.end();
}
