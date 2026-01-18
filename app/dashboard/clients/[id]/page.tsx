'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { clientApi } from '@/lib/api/clientApi';
import type { Client } from '@/types/client';

export default function ClientDetailPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;

    const [client, setClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadClient();
    }, [clientId]);

    const loadClient = async () => {
        try {
            setIsLoading(true);
            const data = await clientApi.getClient(clientId);
            setClient(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load client');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            return;
        }

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
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Client Not Found</h2>
                <p className="text-slate-500 mb-6">The client you're looking for doesn't exist or has been deleted.</p>
                <Link href="/dashboard/clients" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Back to Clients
                </Link>
            </div>
        );
    }

    const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
        <div>
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm text-slate-900">{value || '—'}</dd>
        </div>
    );

    return (
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard/clients" className="hover:text-indigo-600">
                        Clients
                    </Link>
                    <span>/</span>
                    <span>{client.name}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>
                            {client.contactPerson && (
                                <p className="text-slate-500 mt-1">{client.contactPerson}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/dashboard/clients/${client.id}/edit`}
                            className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-6 py-3 border border-red-300 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow label="Email" value={client.email} />
                            <InfoRow label="Phone" value={client.phone} />
                            <InfoRow label="Website" value={client.website} />
                            <InfoRow label="Contact Person" value={client.contactPerson} />
                        </dl>
                    </section>

                    {/* Address */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Address</h2>
                        {client.addressLine1 || client.city || client.country ? (
                            <address className="not-italic text-sm text-slate-700 space-y-1">
                                {client.addressLine1 && <div>{client.addressLine1}</div>}
                                {client.addressLine2 && <div>{client.addressLine2}</div>}
                                <div>
                                    {[client.city, client.state].filter(Boolean).join(', ')}
                                    {client.postalCode && ` ${client.postalCode}`}
                                </div>
                                {client.country && <div>{client.country}</div>}
                            </address>
                        ) : (
                            <p className="text-slate-500 text-sm">No address information</p>
                        )}
                    </section>

                    {/* Business Details */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Business Details</h2>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow label="Tax ID" value={client.taxId} />
                            <InfoRow label="VAT Number" value={client.vatNumber} />
                            <div className="sm:col-span-2">
                                <InfoRow label="Company Registration" value={client.companyRegistration} />
                            </div>
                        </dl>
                    </section>

                    {/* Notes */}
                    {client.notes && (
                        <section className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{client.notes}</p>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Create Invoice
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Send Email
                            </button>
                        </div>
                    </section>

                    {/* Invoice History Placeholder */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Invoice History</h2>
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-slate-500">No invoices yet</p>
                        </div>
                    </section>

                    {/* Metadata */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Metadata</h2>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-slate-500">Created</dt>
                                <dd className="text-slate-900">{new Date(client.createdAt).toLocaleDateString()}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Last Updated</dt>
                                <dd className="text-slate-900">{new Date(client.updatedAt).toLocaleDateString()}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Status</dt>
                                <dd>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.isActive
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-slate-100 text-slate-800'
                                        }`}>
                                        {client.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </div>
        </div>
    );
}
