'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatShortcut, useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { shortcuts } = useKeyboardShortcuts();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32 p-6">
            <div
                className="absolute inset-0"
                onClick={() => setIsOpen(false)}
            />
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full relative border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Type a command or search..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                            autoFocus
                        />
                        <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded border border-gray-300 dark:border-slate-600">
                            ESC
                        </kbd>
                    </div>
                </div>

                {/* Shortcuts List */}
                <div className="max-h-96 overflow-y-auto">
                    <div className="p-2">
                        <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Quick Actions
                        </p>
                        {shortcuts.map((shortcut, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    shortcut.action();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left group"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                    {shortcut.description}
                                </span>
                                <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded border border-gray-300 dark:border-slate-500">
                                    {formatShortcut(shortcut)}
                                </kbd>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 rounded text-xs border border-gray-300 dark:border-slate-600">Ctrl + K</kbd> to open command palette
                    </p>
                </div>
            </div>
        </div>
    );
};
