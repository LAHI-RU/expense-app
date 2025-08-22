import { useQuery } from '@tanstack/react-query';
import { listEmployees } from '../api/employees';
import { useState } from 'react';

export default function Reports() {
    const { data: employees } = useQuery({ queryKey: ['employees'], queryFn: listEmployees });
    const [filters, setFilters] = useState({ employeeId: '', from: '', to: '' });

    const buildQuery = () => {
        const params = [];
        if (filters.employeeId) params.push(`employeeId=${encodeURIComponent(filters.employeeId)}`);
        if (filters.from) params.push(`from=${encodeURIComponent(filters.from)}`);
        if (filters.to) params.push(`to=${encodeURIComponent(filters.to)}`);
        return params.length ? '?' + params.join('&') : '';
    };

    const download = (type: 'csv' | 'pdf') => {
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_API_BASE_URL}/reports/export.${type}${buildQuery()}`;
        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.blob())
            .then(b => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(b);
                a.download = `expenses.${type}`;
                a.click();
            });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reports</h2>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="font-semibold mb-3 text-lg">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                        <select
                            value={filters.employeeId}
                            onChange={e => setFilters(f => ({ ...f, employeeId: e.target.value }))}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        >
                            <option value="">All</option>
                            {employees?.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <input
                            type="date"
                            value={filters.from}
                            onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                            type="date"
                            value={filters.to}
                            onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => download('pdf')}
                        className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
