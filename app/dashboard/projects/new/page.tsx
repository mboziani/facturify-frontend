'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompany } from '@/contexts/CompanyContext';
import { projectApi } from '@/lib/api/projectApi';
import { clientApi } from '@/lib/api/clientApi';
import type { Client } from '@/types/client';
import type { CreateProjectData, ProjectStatus } from '@/types/project';

const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    clientId: z.string().min(1, 'Client is required'),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']),
    budget: z.number().min(0).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
    const router = useRouter();
    const { currentCompany } = useCompany();
    const [clients, setClients] = useState<Client[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            status: 'NOT_STARTED',
        },
    });

    const loadClients = useCallback(async () => {
        if (!currentCompany) return;
        try {
            const data = await clientApi.getClients({ companyId: currentCompany.id });
            setClients(data);
        } catch (err) {
            console.error('Failed to load clients:', err);
        }
    }, [currentCompany]);

    useEffect(() => {
        if (currentCompany) {
            loadClients();
        }
    }, [currentCompany, loadClients]);

    const onSubmit = async (data: ProjectFormData) => {
        if (!currentCompany) return;

        try {
            setIsSaving(true);
            setError('');

            await projectApi.createProject({
                ...data,
                // Ensure budget is number or undefined
                budget: data.budget ? Number(data.budget) : undefined,
            });

            router.push('/dashboard/projects');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentCompany) return null;

    return (
        <div className="p-6 sm:p-8 max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/projects" className="hover:text-indigo-600">
                        Projects
                    </Link>
                    <span>/</span>
                    <span>New Project</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Create Project</h1>
                <p className="text-slate-500 mt-1">Start a new project to track work and expenses</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-100">Project Details</h2>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('name')}
                                    placeholder="e.g. Website Redesign"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Client <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('clientId')}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${errors.clientId ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                    >
                                        <option value="">Select a client</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.clientId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        {...register('status')}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                    >
                                        <option value="NOT_STARTED">Not Started</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="ON_HOLD">On Hold</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    placeholder="Goals, scope, and deliverables..."
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Budget & Timeline */}
                    <div className="space-y-6 pt-6">
                        <h2 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-100">Budget & Timeline</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Total Budget
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('budget', { valueAsNumber: true })}
                                        placeholder="0.00"
                                        className="w-full pl-7 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    {...register('startDate')}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    {...register('endDate')}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                    <Link
                        href="/dashboard/projects"
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-lg transition-all"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
                    >
                        {isSaving ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
}
