'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompany } from '@/contexts/CompanyContext';

const companySchema = z.object({
    name: z.string().min(2, 'Company name is required'),
    legalName: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    taxId: z.string().optional(),
    vatNumber: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyProfilePage() {
    const { currentCompany, updateCompany, createCompany, isLoading: companyLoading } = useCompany();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
    });

    useEffect(() => {
        if (currentCompany) {
            reset({
                name: currentCompany.name || '',
                legalName: currentCompany.legalName || '',
                email: currentCompany.email || '',
                phone: currentCompany.phone || '',
                website: currentCompany.website || '',
                addressLine1: currentCompany.addressLine1 || '',
                addressLine2: currentCompany.addressLine2 || '',
                city: currentCompany.city || '',
                state: currentCompany.state || '',
                postalCode: currentCompany.postalCode || '',
                country: currentCompany.country || '',
                taxId: currentCompany.taxId || '',
                vatNumber: currentCompany.vatNumber || '',
            });
        }
    }, [currentCompany, reset]);

    const onSubmit = async (data: CompanyFormData) => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            if (currentCompany) {
                await updateCompany(currentCompany.id, data);
            } else {
                await createCompany(data);
            }
            setSaveMessage({ type: 'success', text: 'Company profile saved successfully' });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error: any) {
            setSaveMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save company profile'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (companyLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="space-y-4">
                        <div className="h-12 bg-slate-200 rounded"></div>
                        <div className="h-12 bg-slate-200 rounded"></div>
                        <div className="h-12 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900">Company Profile</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your company information and business details
                </p>
            </div>

            {/* Status Messages */}
            {saveMessage && (
                <div className={`mb-6 p-4 rounded-lg ${saveMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {saveMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                className={`w-full px-4 py-2.5 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-slate-300'
                                    }`}
                                placeholder="Acme Corporation"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="legalName" className="block text-sm font-medium text-slate-700 mb-1">
                                Legal Name
                            </label>
                            <input
                                id="legalName"
                                type="text"
                                {...register('legalName')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Acme Corporation Inc."
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Official registered business name
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Information Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Business Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className={`w-full px-4 py-2.5 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-slate-300'
                                    }`}
                                placeholder="billing@company.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                {...register('phone')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-1">
                                Website
                            </label>
                            <input
                                id="website"
                                type="url"
                                {...register('website')}
                                className={`w-full px-4 py-2.5 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.website ? 'border-red-300' : 'border-slate-300'
                                    }`}
                                placeholder="https://www.company.com"
                            />
                            {errors.website && (
                                <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Address Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Business Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="addressLine1" className="block text-sm font-medium text-slate-700 mb-1">
                                Street Address
                            </label>
                            <input
                                id="addressLine1"
                                type="text"
                                {...register('addressLine1')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="123 Business Street"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="addressLine2" className="block text-sm font-medium text-slate-700 mb-1">
                                Address Line 2
                            </label>
                            <input
                                id="addressLine2"
                                type="text"
                                {...register('addressLine2')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Suite 100, Building A"
                            />
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                                City
                            </label>
                            <input
                                id="city"
                                type="text"
                                {...register('city')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="San Francisco"
                            />
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">
                                State / Province
                            </label>
                            <input
                                id="state"
                                type="text"
                                {...register('state')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="California"
                            />
                        </div>

                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">
                                Postal Code
                            </label>
                            <input
                                id="postalCode"
                                type="text"
                                {...register('postalCode')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="94102"
                            />
                        </div>

                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
                                Country
                            </label>
                            <select
                                id="country"
                                {...register('country')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
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

                {/* Tax Information Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Tax Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="taxId" className="block text-sm font-medium text-slate-700 mb-1">
                                Tax ID / EIN
                            </label>
                            <input
                                id="taxId"
                                type="text"
                                {...register('taxId')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="XX-XXXXXXX"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Federal tax identification number
                            </p>
                        </div>

                        <div>
                            <label htmlFor="vatNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                VAT Number
                            </label>
                            <input
                                id="vatNumber"
                                type="text"
                                {...register('vatNumber')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="XX123456789"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Value Added Tax registration number
                            </p>
                        </div>
                    </div>
                </section>

                {/* Form Actions */}
                <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        disabled={!isDirty || isSaving}
                        className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isSaving && (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
