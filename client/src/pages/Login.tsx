import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('Admin@123');
    const [error, setError] = useState<string | undefined>();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        try {
            const { token } = await login(email, password);
            localStorage.setItem('token', token);
            nav('/');
        } catch (e) {
            if (
                typeof e === 'object' &&
                e !== null &&
                'response' in e &&
                typeof (e as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
            ) {
                setError((e as { response: { data: { message: string } } }).response.data.message);
            } else {
                setError('Login failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-3">
                <h2 className="text-xl font-semibold">Sign in</h2>
                {error && <p className="text-red-600">{error}</p>}
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="border w-full p-2 rounded" />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="border w-full p-2 rounded" />
                <button className="w-full bg-black text-white rounded p-2">Login</button>
            </form>
        </div>
    );
}
