'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/contexts/CompanyContext';
import { Company } from '@/types/company';

export default function CompanySwitcher() {
    const { currentCompany, companies, switchCompany, isLoading } = useCompany();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = async (companyId: string) => {
        setIsOpen(false);
        await switchCompany(companyId);
        // Optional: Refresh data or redirect if needed
        router.refresh();
    };

    if (isLoading) {
        return <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />;
    }

    if (!currentCompany) {
        // Should logically prompt to create one if none exist, 
        // but normally registration creates a default one.
        return null;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            >
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs text-white font-medium`}
                    style={{ backgroundColor: currentCompany.brandColor || '#4F46E5' }}>
                    {currentCompany.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                    {currentCompany.name}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-1">
                        Switch Company
                    </div>

                    {companies.map((company) => (
                        <button
                            key={company.id}
                            onClick={() => handleSwitch(company.id)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${currentCompany.id === company.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs text-white font-medium`}
                                style={{ backgroundColor: company.brandColor || '#4F46E5' }}>
                                {company.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate">{company.name}</span>
                            {currentCompany.id === company.id && (
                                <svg className="w-4 h-4 ml-auto text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push('/dashboard/settings');
                                // Ideally this goes to a "Create Company" flow in future
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Company
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
