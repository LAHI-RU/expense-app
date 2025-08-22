import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
export default function Register() {
    const nav = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token')) nav('/app');
    }, [nav]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        setSuccess(false);
        try {
            const { token } = await register(name, email, password);
            localStorage.setItem('token', token);
            setSuccess(true);
            setTimeout(() => nav('/app'), 1000);
        } catch (e) {
            if (
                typeof e === 'object' &&
                e !== null &&
                'response' in e &&
                typeof (e as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
            ) {
                setError((e as { response: { data: { message: string } } }).response.data.message);
            } else {
                setError('Registration failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-3">
                <h2 className="text-xl font-semibold">Create Account</h2>
                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">Account created! Redirecting...</p>}
                <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Name" className="border w-full p-2 rounded" />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="border w-full p-2 rounded" />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="border w-full p-2 rounded" />
                <button className="w-full bg-blue-600 text-white rounded p-2">Register</button>
                <div className="text-sm text-gray-500 text-center">Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a></div>
            </form>
        </div>
    );
}
