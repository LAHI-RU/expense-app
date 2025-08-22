export const register = async (name: string, email: string, password: string) => {
    const { data } = await http.post('/auth/register', { name, email, password });
    return data as { token: string; user: { id: number; name: string; email: string } };
};
import { http } from './http';
export const login = async (email: string, password: string) => {
    const { data } = await http.post('/auth/login', { email, password });
    return data as { token: string; user: { id: number; name: string; email: string } };
};
