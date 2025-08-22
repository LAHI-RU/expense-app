import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthedRequest extends Request {
    user?: { id: number; email: string };
}

export function auth(req: AuthedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });

    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
