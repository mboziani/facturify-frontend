'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/contexts/CompanyContext';
import { expenseApi, ExpenseCategory, CreateExpenseData } from '@/lib/api/expenseApi';
import toast from 'react-hot-toast';

export default function NewExpensePage() {
    const router = useRouter();
    const { currentCompany } = useCompany();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CreateExpenseData>({
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: ExpenseCategory.OTHER,
        notes: '',
        companyId: currentCompany?.id || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCompany) return;

        setIsLoading(true);
        try {
            await expenseApi.createExpense({ ...formData, companyId: currentCompany.id });
            toast.success('Expense created successfully!');
            router.push('/dashboard/expenses');
        } catch (error) {
            console.error('Failed to create expense:', error);
            toast.error('Failed to create expense');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
                <p className="text-gray-500 mt-1">Record a new business expense</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="e.g. Monthly software subscription"
                    />
                </div>

                {/* Amount and Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount *
                        </label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            min="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        {Object.values(ExpenseCategory).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Add any additional details..."
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/expenses')}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Create Expense'}
                    </button>
                </div>
            </form>
        </div>
    );
}
