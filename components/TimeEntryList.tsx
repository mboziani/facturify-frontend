'use client';

import { useState } from 'react';
import { TimeEntry } from '@/types/timeEntry';
import { format } from 'date-fns';
import { PlayIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils/invoiceUtils';

interface TimeEntryListProps {
    entries: TimeEntry[];
    onDelete?: (id: string) => void;
    onEdit?: (entry: TimeEntry) => void;
    onRestart?: (entry: TimeEntry) => void;
}

export default function TimeEntryList({ entries, onDelete, onEdit, onRestart }: TimeEntryListProps) {
    // Group entries by date
    const groupedEntries = entries.reduce((groups, entry) => {
        const date = format(new Date(entry.startTime), 'yyyy-MM-dd');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(entry);
        return groups;
    }, {} as Record<string, TimeEntry[]>);

    // Sort dates descending
    const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    if (entries.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <ClockIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No time entries yet</h3>
                <p className="text-slate-500">Your tracked time for this company will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {sortedDates.map(date => (
                <div key={date} className="space-y-3">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            {format(new Date(date), 'EEEE, MMM d, yyyy')}
                        </h3>
                        <span className="text-sm font-medium text-slate-400">
                            Total: {formatDuration(groupedEntries[date].reduce((sum, e) => sum + e.duration, 0))}
                        </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
                        {groupedEntries[date].map(entry => (
                            <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-slate-900 truncate">
                                                {entry.description || '(No description)'}
                                            </span>
                                            {entry.billable && (
                                                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">
                                                    Billable
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <span className="flex items-center gap-1 font-medium text-indigo-600">
                                                {entry.project?.name || 'No Project'}
                                            </span>
                                            <span>•</span>
                                            <span>{entry.client?.name}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right whitespace-nowrap">
                                            <div className="font-bold text-slate-900">
                                                {formatDuration(entry.duration)}
                                            </div>
                                            <div className="text-xs text-slate-400 tabular-nums">
                                                {format(new Date(entry.startTime), 'HH:mm')} - {entry.endTime ? format(new Date(entry.endTime), 'HH:mm') : 'Now'}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onRestart?.(entry)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm"
                                                title="Restart timer"
                                            >
                                                <PlayIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onEdit?.(entry)}
                                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all shadow-sm"
                                                title="Edit entry"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete?.(entry.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm"
                                                title="Delete entry"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    );
}
