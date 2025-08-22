
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listEmployees } from '../api/employees';
import { createExpense, listExpenses, updateExpense, deleteExpense } from '../api/expenses';
import { useEffect, useState } from 'react';

export default function Expenses() {
    const qc = useQueryClient();
    const { data: employees } = useQuery({ queryKey: ['employees'], queryFn: listEmployees });
    const [filters, setFilters] = useState({ employeeId: '', from: '', to: '', category: '', page: 1 });
    const { data } = useQuery({
        queryKey: ['expenses', filters],
        queryFn: () => listExpenses(filters),
    });
    const [form, setForm] = useState({ employeeId: '', amount: '', date: '', category: 'OTHER', description: '' });
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ employeeId: '', amount: '', date: '', category: 'OTHER', description: '' });
    const [showDeleteId, setShowDeleteId] = useState<number | null>(null);

    const create = useMutation({
        mutationFn: () => createExpense({
            employeeId: Number(form.employeeId),
            amount: Number(form.amount),
            date: form.date ? new Date(form.date).toISOString() : undefined,
            category: form.category as 'ADVANCE' | 'MATERIAL' | 'TRAVEL' | 'OTHER',
            description: form.description || undefined
        }),
        onSuccess: (res) => {
            alert(res.warning || 'Expense created');
            setForm({ employeeId: '', amount: '', date: '', category: 'OTHER', description: '' });
            qc.invalidateQueries({ queryKey: ['expenses'] });
        }
    });

    const update = useMutation({
        mutationFn: ({ id, body }: { id: number; body: Partial<import('../types').Expense> }) => updateExpense(id, body),
        onSuccess: () => {
            setEditId(null);
            qc.invalidateQueries({ queryKey: ['expenses'] });
        },
    });

    const del = useMutation({
        mutationFn: (id: number) => deleteExpense(id),
        onSuccess: () => {
            setShowDeleteId(null);
            qc.invalidateQueries({ queryKey: ['expenses'] });
        },
    });

    useEffect(() => { setFilters(f => ({ ...f, page: 1 })) }, [filters.employeeId, filters.from, filters.to, filters.category]);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
                <span className="text-gray-500 text-sm">Total: {data?.total ?? 0}</span>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-3 md:items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                    <select value={filters.employeeId} onChange={e => setFilters({ ...filters, employeeId: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full">
                        <option value="">All employees</option>
                        {employees?.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <input type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full">
                        <option value="">All categories</option>
                        <option>ADVANCE</option><option>MATERIAL</option><option>TRAVEL</option><option>OTHER</option>
                    </select>
                </div>
                <button onClick={() => setFilters({ ...filters, page: 1 })} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Filter</button>
            </div>

            {/* Add Expense */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="font-semibold mb-3 text-lg">Add New Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                        <option value="">Select employee</option>
                        {employees?.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Amount" className="border border-gray-300 rounded px-3 py-2" />
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                        <option>OTHER</option><option>ADVANCE</option><option>MATERIAL</option><option>TRAVEL</option>
                    </select>
                    <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border border-gray-300 rounded px-3 py-2" />
                </div>
                <button onClick={() => create.mutate()} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Save</button>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg">Expense List</h3>
                    <div className="space-x-2">
                        <button disabled={(filters.page || 1) <= 1} onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })} className="px-3 py-1 border rounded">Prev</button>
                        <button disabled={(data?.items?.length || 0) === 0} onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })} className="px-3 py-1 border rounded">Next</button>
                    </div>
                </div>
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-gray-600">
                            <th className="p-2">Date</th>
                            <th className="p-2">Employee</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Description</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.items?.map(x => (
                            <tr key={x.id} className="bg-gray-50 hover:bg-gray-100">
                                <td className="p-2">{new Date(x.date).toLocaleDateString()}</td>
                                <td className="p-2">{x.employee?.name}</td>
                                <td className="p-2">{x.category}</td>
                                <td className="p-2">{`Rs. ${Number(x.amount).toLocaleString('en-LK')}`}</td>
                                <td className="p-2">{x.description}</td>
                                <td className="p-2 text-center space-x-2">
                                    <button
                                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 text-sm font-semibold"
                                        onClick={() => {
                                            setEditId(x.id);
                                            setEditForm({
                                                employeeId: String(x.employeeId),
                                                amount: String(x.amount),
                                                date: x.date.slice(0, 10),
                                                category: x.category,
                                                description: x.description || ''
                                            });
                                        }}
                                    >Edit</button>
                                    <button
                                        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm font-semibold"
                                        onClick={() => setShowDeleteId(x.id)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                        {(!data?.items || data.items.length === 0) && (
                            <tr><td colSpan={6} className="text-gray-500 py-3 text-center">No expenses found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="font-semibold text-lg mb-4">Edit Expense</h3>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                update.mutate({
                                    id: editId, body: {
                                        employeeId: Number(editForm.employeeId),
                                        amount: Number(editForm.amount),
                                        date: editForm.date ? new Date(editForm.date).toISOString() : undefined,
                                        category: editForm.category as 'ADVANCE' | 'MATERIAL' | 'TRAVEL' | 'OTHER',
                                        description: editForm.description || undefined
                                    }
                                });
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                                <select value={editForm.employeeId} onChange={e => setEditForm({ ...editForm, employeeId: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full">
                                    <option value="">Select employee</option>
                                    {employees?.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input type="number" min="0" step="0.01" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full">
                                    <option>OTHER</option><option>ADVANCE</option><option>MATERIAL</option><option>TRAVEL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="border border-gray-300 rounded px-3 py-2 w-full" />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => setEditId(null)}
                                >Cancel</button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    disabled={update.isPending}
                                >{update.isPending ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h3 className="font-semibold text-lg mb-4">Delete Expense</h3>
                        <p className="mb-6">Are you sure you want to delete this expense?</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setShowDeleteId(null)}
                            >Cancel</button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={() => del.mutate(showDeleteId)}
                                disabled={del.isPending}
                            >{del.isPending ? 'Deleting...' : 'Delete'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
