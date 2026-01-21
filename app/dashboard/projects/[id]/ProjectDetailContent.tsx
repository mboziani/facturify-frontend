'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/contexts/CompanyContext';
import { projectApi } from '@/lib/api/projectApi';
import type { Project, ProjectStatus } from '@/types/project';
import { formatCurrency } from '@/lib/utils/invoiceUtils';
import ProjectTasks from '@/components/ProjectTasks';
import ProjectInvoices from '@/components/ProjectInvoices';

export default function ProjectDetailContent({ id }: { id: string }) {
    const router = useRouter();
    const { currentCompany } = useCompany();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const loadProject = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await projectApi.getProject(id);
            setProject(data);
        } catch (err) {
            console.error('Failed to load project:', err);
            setError('Project not found or failed to load.');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (currentCompany && id) {
            loadProject();
        }
    }, [currentCompany, id, loadProject]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        try {
            await projectApi.deleteProject(id);
            router.push('/dashboard/projects');
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    if (isLoading) {
        return <div className="p-8">Loading project details...</div>;
    }

    if (error || !project) {
        return (
            <div className="p-8 text-center bg-red-50 text-red-700 rounded-lg">
                {error || 'Project not found'}
            </div>
        );
    }

    // Calculations
    const budget = project.budget || 0;
    const spent = 0; // TODO: Implement expense/invoice tracking links
    const budgetProgress = budget > 0 ? (spent / budget) * 100 : 0;

    // Dates
    const startDate = project.startDate ? new Date(project.startDate) : null;
    const endDate = project.endDate ? new Date(project.endDate) : null;
    const today = new Date();
    const totalDuration = startDate && endDate ? endDate.getTime() - startDate.getTime() : 0;
    const elapsed = startDate ? today.getTime() - startDate.getTime() : 0;
    const timeProgress = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)) : 0;

    return (
        <div className="p-6 sm:p-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Link href="/dashboard/projects" className="hover:text-indigo-600">
                            Projects
                        </Link>
                        <span>/</span>
                        <span>{project.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                            {formatStatus(project.status)}
                        </span>
                    </div>
                    {project.client && (
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">Client</span>
                            <Link href={`/dashboard/clients/${project.clientId}`} className="hover:text-indigo-600 hover:underline">
                                {project.client.name}
                            </Link>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                    >
                        Delete
                    </button>
                    <Link
                        href={`/dashboard/projects/${id}/edit`}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Edit Details
                    </Link>
                    <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                        Add Time Entry
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Budget Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Budget Usage</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">
                                {formatCurrency(spent)} <span className="text-sm font-normal text-slate-400">/ {formatCurrency(budget)}</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    {/* Custom Progress Bar */}
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-indigo-600">
                                    {Math.round(budgetProgress)}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
                            <div style={{ width: `${Math.min(100, budgetProgress)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                        </div>
                    </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Timeline</p>
                            <div className="mt-1 space-y-1">
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <span className="w-16 text-slate-400 text-xs uppercase">Start</span>
                                    <span className="font-medium">{startDate ? startDate.toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <span className="w-16 text-slate-400 text-xs uppercase">End</span>
                                    <span className="font-medium">{endDate ? endDate.toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    {/* Time Progress */}
                    {startDate && endDate && (
                        <div className="mt-5">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-100">
                                <div style={{ width: `${timeProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 text-right">{timeProgress >= 100 ? 'Completed' : 'On Schedule'}</p>
                        </div>
                    )}
                </div>

                {/* Hours Card (Future) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-amber-100 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Hours Logged</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">
                                0 <span className="text-sm font-normal text-slate-400">hrs</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
                            + Add Manual Entry
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
                <nav className="flex space-x-8">
                    {['Overview', 'Tasks', 'Invoices', 'Files'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`
                                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.toLowerCase()
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Description</h2>
                        {project.description ? (
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p className="whitespace-pre-line">{project.description}</p>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic">No description provided.</p>
                        )}

                        {/* Placeholder Activity Feed */}
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Recent Activity</h3>
                            <div className="text-sm text-slate-500 italic">
                                Activity logging coming soon...
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'tasks' && (
                    <ProjectTasks projectId={id} />
                )}
                {activeTab === 'invoices' && (
                    <ProjectInvoices projectId={id} clientId={project.clientId} />
                )}
                {activeTab === 'files' && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500">File management coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusColor(status: ProjectStatus) {
    switch (status) {
        case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'ON_HOLD': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
        default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
}

function formatStatus(status: string) {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
