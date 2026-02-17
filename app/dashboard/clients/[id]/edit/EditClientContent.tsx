'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clientApi } from '@/lib/api/clientApi';
import type { Client } from '@/types/client';

const clientSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    contactPerson: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    taxId: z.string().optional(),
    vatNumber: z.string().optional(),
    companyRegistration: z.string().optional(),
    notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function EditClientContent() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;

    const [client, setClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
    });

    const loadClient = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await clientApi.getClient(clientId);
            setClient(data);
            reset({
                name: data.name,
                email: data.email || '',
                phone: data.phone || '',
                website: data.website || '',
                contactPerson: data.contactPerson || '',
                addressLine1: data.addressLine1 || '',
                addressLine2: data.addressLine2 || '',
                city: data.city || '',
                state: data.state || '',
                postalCode: data.postalCode || '',
                country: data.country || '',
                taxId: data.taxId || '',
                vatNumber: data.vatNumber || '',
                companyRegistration: data.companyRegistration || '',
                notes: data.notes || '',
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load client');
        } finally {
            setIsLoading(false);
        }
    }, [clientId, reset]);

    useEffect(() => {
        loadClient();
    }, [loadClient]);

    const onSubmit = async (data: ClientFormData) => {
        try {
            setIsSaving(true);
            setError('');
            await clientApi.updateClient(clientId, data);
            router.push('/dashboard/clients');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update client');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this client?')) return;
        try {
            await clientApi.deleteClient(clientId);
            router.push('/dashboard/clients');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete client');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600"></div>
                <p className="mt-4 text-slate-500">Loading client...</p>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500">Client not found</p>
                <Link href="/dashboard/clients" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
                    Back to Clients
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/clients" className="hover:text-indigo-600">Clients</Link>
                    <span>/</span>
                    <span>{client.name}</span>
                    <span>/</span>
                    <span>Edit</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Edit Client</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                            <input type="text" {...register('name')} className={`w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-300' : 'border-slate-200'}`} />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input type="email" {...register('email')} className="w-full px-4 py-3 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                            <input type="tel" {...register('phone')} className="w-full px-4 py-3 border border-slate-200 rounded-lg" />
                        </div>
                    </div>
                </section>

                <div className="flex justify-between gap-3">
                    <button type="button" onClick={handleDelete} className="px-6 py-3 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">Delete</button>
                    <div className="flex gap-3">
                        <Link href="/dashboard/clients" className="px-6 py-3 border border-slate-300 rounded-lg">Cancel</Link>
                        <button type="submit" disabled={isSaving} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
