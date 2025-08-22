import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
export default function Welcome() {
    const nav = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) nav('/app');
    }, [nav]);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
                <h1 className="text-3xl font-bold text-blue-700 mb-6 tracking-tight">Expense App</h1>
                <div className="flex gap-4 w-full">
                    <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-lg"
                        onClick={() => nav('/login')}
                    >
                        Login
                    </button>
                    <button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold py-3 rounded-lg border border-blue-200 transition text-lg"
                        onClick={() => nav('/register')}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
