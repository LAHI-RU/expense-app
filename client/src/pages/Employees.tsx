import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee, listEmployees, updateEmployee, deleteEmployee } from '../api/employees';
import { useState } from 'react';

export default function Employees() {
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({ queryKey: ['employees'], queryFn: listEmployees });
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const create = useMutation({
        mutationFn: () => {
            if (name.trim().length < 2) {
                setError('Name must be at least 2 characters');
                return Promise.reject();
            }
            setError(null);
            return createEmployee({ name, phone: phone.trim() === '' ? undefined : phone });
        },
        onSuccess: () => {
            setName('');
            setPhone('');
            qc.invalidateQueries({ queryKey: ['employees'] });
        },
        onError: () => setError('Failed to add employee. Try again.')
    });

    // Edit modal state
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [showDeleteId, setShowDeleteId] = useState<number | null>(null);

    const update = useMutation({
        mutationFn: ({ id, name, phone }: { id: number; name: string; phone?: string }) =>
            updateEmployee(id, { name, phone: phone?.trim() === '' ? undefined : phone }),
        onSuccess: () => {
            setEditId(null);
            qc.invalidateQueries({ queryKey: ['employees'] });
        },
    });

    const del = useMutation({
        mutationFn: (id: number) => deleteEmployee(id),
        onSuccess: () => {
            setShowDeleteId(null);
            qc.invalidateQueries({ queryKey: ['employees'] });
        },
    });

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
                <span className="text-gray-500 text-sm">Total: {data?.length ?? 0}</span>
            </div>

            {/* Add Employee */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="font-semibold mb-3 text-lg">Add New Employee</h3>
                <form
                    className="flex flex-col md:flex-row gap-3 md:items-end"
                    onSubmit={e => { e.preventDefault(); create.mutate(); }}
                >
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Name"
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                        <input
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="Phone"
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
                        disabled={create.isPending}
                    >
                        {create.isPending ? 'Adding...' : 'Add'}
                    </button>
                </form>
                {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3 text-lg">Employee List</h3>
                {isLoading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-gray-600">
                                <th className="p-2">Name</th>
                                <th className="p-2">Phone</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map(e => (
                                <tr key={e.id} className="bg-gray-50 hover:bg-gray-100">
                                    <td className="p-2 font-medium text-gray-800">{e.name}</td>
                                    <td className="p-2 text-gray-700">{e.phone || <span className="text-gray-400 italic">N/A</span>}</td>
                                    <td className="p-2 text-center space-x-2">
                                        <button
                                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 text-sm font-semibold"
                                            onClick={() => { setEditId(e.id); setEditName(e.name); setEditPhone(e.phone || ''); }}
                                        >Edit</button>
                                        <button
                                            className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm font-semibold"
                                            onClick={() => setShowDeleteId(e.id)}
                                        >Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {(!data || data.length === 0) && (
                                <tr><td colSpan={3} className="text-gray-500 py-3 text-center">No employees found.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            {editId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="font-semibold text-lg mb-4">Edit Employee</h3>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                update.mutate({ id: editId, name: editName, phone: editPhone });
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                                <input
                                    value={editPhone}
                                    onChange={e => setEditPhone(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
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
                        <h3 className="font-semibold text-lg mb-4">Delete Employee</h3>
                        <p className="mb-6">Are you sure you want to delete this employee?</p>
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
