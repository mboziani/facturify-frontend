'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { timeApi } from '@/lib/api/timeApi';
import { TimeEntry } from '@/types/timeEntry';
import TimeTracker from '@/components/TimeTracker';
import TimeEntryList from '@/components/TimeEntryList';
import { formatCurrency } from '@/lib/utils/invoiceUtils';

export default function TimeTrackingPage() {
    const { currentCompany } = useCompany();
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [stats, setStats] = useState({ totalMinutes: 0, totalAmount: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!currentCompany) return;
        setIsLoading(true);
        try {
            const [entriesData, statsData] = await Promise.all([
                timeApi.getTimeEntries({ companyId: currentCompany.id }),
                timeApi.getTimeStats(currentCompany.id)
            ]);
            setEntries(entriesData);
            setStats(statsData);
        } catch (err) {
            console.error('Failed to load time tracking data', err);
        } finally {
            setIsLoading(false);
        }
    }, [currentCompany]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        try {
            await timeApi.deleteTimeEntry(id);
            setEntries(entries.filter(e => e.id !== id));
            // Refresh stats
            const statsData = await timeApi.getTimeStats(currentCompany!.id);
            setStats(statsData);
        } catch (err) {
            alert('Failed to delete entry');
        }
    };

    return (
        <div className="p-6 sm:p-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Time Tracking</h1>
                <p className="text-slate-500 mt-1">Track work time and manage billable hours.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-indigo-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Hours</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-indigo-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Amount</p>
                    <h3 className="text-2xl font-bold text-indigo-600">
                        {formatCurrency(stats.totalAmount)}
                    </h3>
                </div>
            </div>

            {/* Global Tracker */}
            <TimeTracker />

            {/* Entries List */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Recent Entries</h2>
                    <div className="flex gap-2">
                        {/* Period Filter Placeholder */}
                        <select className="text-sm border-slate-200 rounded-lg bg-white">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-12 text-center text-slate-500">Loading entries...</div>
                ) : (
                    <TimeEntryList
                        entries={entries}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
