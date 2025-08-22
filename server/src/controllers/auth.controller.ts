import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { loginSchema } from '../schemas/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response) {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json(parse.error.flatten());

    const { email, password } = parse.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}
