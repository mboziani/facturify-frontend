'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompany } from '@/contexts/CompanyContext';
import { projectApi } from '@/lib/api/projectApi';
import type { Project, ProjectStatus } from '@/types/project';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/utils/invoiceUtils';

export default function ProjectsPage() {
    const { currentCompany } = useCompany();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (currentCompany) {
            loadProjects();
        }
    }, [currentCompany]);

    const loadProjects = async () => {
        if (!currentCompany) return;
        setIsLoading(true);
        try {
            const data = await projectApi.getProjects(currentCompany.id);
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load projects', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Client-side filtering
    const filteredProjects = (Array.isArray(projects) ? projects : []).filter(p => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="p-6 sm:p-8 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl h-64 border border-gray-200 p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-20 bg-gray-100 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!isLoading && projects.length === 0 && filterStatus === 'ALL' && !searchQuery) {
        return (
            <div className="p-8">
                <EmptyState
                    title="No Projects Yet"
                    description="Create your first project to track specific budgets, tasks, and timelines separately from general client work."
                    actionLabel="Create Project"
                    actionHref="/dashboard/projects/new"
                    icon={
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    }
                />
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-500 mt-1">Manage your ongoing work and budgets</p>
                </div>
                <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search projects by name or client..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm sm:w-48"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                                    {formatStatus(project.status)}
                                </span>
                                <span className="text-gray-400 text-xs text-right">
                                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{project.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">{project.description || 'No description provided.'}</p>

                            {/* Stats */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-gray-500">Client</span>
                                    <span className="font-medium text-gray-900 truncate max-w-[120px] bg-gray-100 px-2 py-0.5 rounded text-xs">{project.client?.name || 'internal'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Budget</span>
                                    <span className="font-medium text-gray-900">{project.budget ? formatCurrency(project.budget) : '—'}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                    <p className="font-medium">No projects found matching your filters.</p>
                    <button onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); }} className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 font-medium">Clear filters</button>
                </div>
            )}
        </div>
    );
}

function getStatusColor(status: ProjectStatus) {
    switch (status) {
        case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100'; // Changed to emerald for better aesthetics
        case 'ON_HOLD': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
        default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
}

function formatStatus(status: string) {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
