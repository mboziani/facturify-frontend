'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompany } from '@/contexts/CompanyContext';
import { expenseApi, Expense, ExpenseCategory } from '@/lib/api/expenseApi';
import toast from 'react-hot-toast';

import { usePermissions } from '@/hooks/usePermissions';

export default function ExpensesPage() {
    const { currentCompany } = useCompany();
    const { hasFeature } = usePermissions();
    const isLocked = !hasFeature('EXPENSE_TRACKING');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    useEffect(() => {
        if (currentCompany && !isLocked) {
            loadExpenses();
        }
    }, [currentCompany, isLocked]);

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm mt-8">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Feature</h3>
                <p className="text-slate-600 mb-6 max-w-sm">
                    Expense tracking is available on our Professional and Business plans. Upgrade to start tracking your business spending and gain deeper financial insights.
                </p>
                <Link
                    href="/dashboard/subscription"
                    className="inline-block py-3 px-8 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Upgrade to Unlock
                </Link>
            </div>
        );
    }

    const loadExpenses = async () => {
        if (!currentCompany) return;
        setIsLoading(true);
        try {
            const data = await expenseApi.getExpenses(currentCompany.id);
            setExpenses(data);
        } catch (error) {
            console.error('Failed to load expenses:', error);
            toast.error('Failed to load expenses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        try {
            await expenseApi.deleteExpense(id);
            toast.success('Expense deleted successfully');
            loadExpenses();
        } catch (error) {
            console.error('Failed to delete expense:', error);
            toast.error('Failed to delete expense');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currentCompany?.currency || 'USD',
        }).format(amount);
    };

    const filteredExpenses = selectedCategory === 'ALL'
        ? expenses
        : expenses.filter(e => e.category === selectedCategory);

    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const categoryColors: Record<string, string> = {
        OFFICE: 'bg-blue-100 text-blue-800',
        TRAVEL: 'bg-green-100 text-green-800',
        SOFTWARE: 'bg-purple-100 text-purple-800',
        MARKETING: 'bg-pink-100 text-pink-800',
        UTILITIES: 'bg-yellow-100 text-yellow-800',
        SUPPLIES: 'bg-orange-100 text-orange-800',
        EQUIPMENT: 'bg-red-100 text-red-800',
        SALARY: 'bg-indigo-100 text-indigo-800',
        CONSULTING: 'bg-teal-100 text-teal-800',
        OTHER: 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
                    <p className="text-gray-500 mt-1">Track your business expenses</p>
                </div>
                <Link
                    href="/dashboard/expenses/new"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Add Expense
                </Link>
            </div>

            {/* Summary Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
                        <p className="text-sm text-gray-500 mt-1">{filteredExpenses.length} expenses</p>
                    </div>
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                            <option value="ALL">All Categories</option>
                            {Object.values(ExpenseCategory).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Expenses Table */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new expense.</p>
                    <div className="mt-6">
                        <Link
                            href="/dashboard/expenses/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            + Add Expense
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div>{expense.description}</div>
                                        {expense.notes && (
                                            <div className="text-xs text-gray-500 mt-1">{expense.notes}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[expense.category]}`}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                        {formatCurrency(expense.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
