'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompany } from '@/contexts/CompanyContext';
import { clientApi } from '@/lib/api/clientApi';

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

export default function NewClientPage() {
    const router = useRouter();
    const { currentCompany } = useCompany();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
    });

    const onSubmit = async (data: ClientFormData) => {
        if (!currentCompany) {
            setError('Please select a company first');
            return;
        }

        try {
            setIsSaving(true);
            setError('');

            await clientApi.createClient({
                ...data,
                companyId: currentCompany.id,
            });

            router.push('/dashboard/clients');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create client');
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentCompany) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500">Please select a company first</p>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/clients" className="hover:text-indigo-600">
                        Clients
                    </Link>
                    <span>/</span>
                    <span>New Client</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Add New Client</h1>
                <p className="text-slate-500 mt-1">Create a new client record</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('name')}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-slate-200'
                                    }`}
                                placeholder="Acme Corporation"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Contact Person
                            </label>
                            <input
                                type="text"
                                {...register('contactPerson')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-slate-200'
                                    }`}
                                placeholder="contact@company.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                {...register('phone')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                {...register('website')}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.website ? 'border-red-300' : 'border-slate-200'
                                    }`}
                                placeholder="https://www.company.com"
                            />
                            {errors.website && (
                                <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Address */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                {...register('addressLine1')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="123 Business Street"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                {...register('addressLine2')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Suite 100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                {...register('city')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="San Francisco"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                State / Province
                            </label>
                            <input
                                type="text"
                                {...register('state')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="California"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                {...register('postalCode')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="94102"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Country
                            </label>
                            <select
                                {...register('country')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                            >
                                <option value="">Select country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="GB">United Kingdom</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                                <option value="AU">Australia</option>
                                <option value="JP">Japan</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Business Details */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Business Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tax ID
                            </label>
                            <input
                                type="text"
                                {...register('taxId')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="XX-XXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                VAT Number
                            </label>
                            <input
                                type="text"
                                {...register('vatNumber')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="XX123456789"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company Registration
                            </label>
                            <input
                                type="text"
                                {...register('companyRegistration')}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Company registration number"
                            />
                        </div>
                    </div>
                </section>

                {/* Notes */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
                    <textarea
                        {...register('notes')}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        placeholder="Add any additional notes about this client..."
                    />
                </section>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <Link
                        href="/dashboard/clients"
                        className="px-6 py-3 text-center border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isSaving && (
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        {isSaving ? 'Creating...' : 'Create Client'}
                    </button>
                </div>
            </form>
        </div>
    );
}
