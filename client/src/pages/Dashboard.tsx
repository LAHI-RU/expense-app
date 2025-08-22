import { useQuery } from '@tanstack/react-query';
import { http } from '../api/http';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    // Summary by employee
    const { data: summary } = useQuery({
        queryKey: ['summary-employee'],
        queryFn: async () => (await http.get('/reports/summary/employee')).data as { employeeId: number; employee: string; total: string }[]
    });
    // Recent expenses
    const { data: expenses } = useQuery({
        queryKey: ['recent-expenses'],
        queryFn: async () => (await http.get('/expenses', { params: { page: 1, pageSize: 5 } })).data.items
    });
    // Employees count
    const { data: employees } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => (await http.get('/employees')).data
    });

    const chartData = (summary || []).map(d => ({ name: d.employee, total: Number(d.total) }));
    const totalExpense = chartData.reduce((sum, d) => sum + d.total, 0);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-gray-500">Total Employees</span>
                    <span className="text-3xl font-bold text-blue-700 mt-2">{employees?.length ?? '-'}</span>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-gray-500">Total Expenses</span>
                    <span className="text-3xl font-bold text-green-700 mt-2">{`Rs. ${totalExpense.toLocaleString('en-LK')}`}</span>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <span className="text-gray-500">Expense Records</span>
                    <span className="text-3xl font-bold text-purple-700 mt-2">{expenses?.length ?? '-'}</span>
                </div>
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3 text-lg">Expenses by Employee</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent expenses table */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3 text-lg">Recent Expenses</h3>
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-gray-600">
                            <th className="p-2">Date</th>
                            <th className="p-2">Employee</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses?.map((e: any) => (
                            <tr key={e.id} className="bg-gray-50 hover:bg-gray-100">
                                <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                                <td className="p-2">{e.employee?.name || '-'}</td>
                                <td className="p-2">{e.category}</td>
                                <td className="p-2">{`Rs. ${Number(e.amount).toLocaleString('en-LK')}`}</td>
                                <td className="p-2">{e.description || '-'}</td>
                            </tr>
                        ))}
                        {(!expenses || expenses.length === 0) && (
                            <tr><td colSpan={5} className="text-gray-500 py-3 text-center">No recent expenses found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
