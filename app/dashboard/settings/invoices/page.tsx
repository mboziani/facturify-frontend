'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompany } from '@/contexts/CompanyContext';

const invoiceSettingsSchema = z.object({
    currency: z.string().min(1, 'Currency is required'),
    invoicePrefix: z.string().min(1, 'Invoice prefix is required').max(10),
    nextInvoiceNumber: z.number().min(1, 'Must be at least 1'),
    defaultPaymentTerms: z.number().min(0).max(365),
    invoiceTerms: z.string().optional(),
    invoiceFooter: z.string().optional(),
    dateFormat: z.string().min(1, 'Date format is required'),
    timezone: z.string().min(1, 'Timezone is required'),
});

type InvoiceSettingsFormData = z.infer<typeof invoiceSettingsSchema>;

const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
];

const dateFormats = [
    { value: 'YYYY-MM-DD', label: '2024-01-15' },
    { value: 'DD/MM/YYYY', label: '15/01/2024' },
    { value: 'MM/DD/YYYY', label: '01/15/2024' },
    { value: 'DD-MM-YYYY', label: '15-01-2024' },
    { value: 'MMM DD, YYYY', label: 'Jan 15, 2024' },
];

const paymentTermOptions = [
    { value: 0, label: 'Due on Receipt' },
    { value: 7, label: 'Net 7' },
    { value: 14, label: 'Net 14' },
    { value: 15, label: 'Net 15' },
    { value: 30, label: 'Net 30' },
    { value: 45, label: 'Net 45' },
    { value: 60, label: 'Net 60' },
    { value: 90, label: 'Net 90' },
];

export default function InvoiceSettingsPage() {
    const { currentCompany, updateCompany, isLoading } = useCompany();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch,
    } = useForm<InvoiceSettingsFormData>({
        resolver: zodResolver(invoiceSettingsSchema),
    });

    const watchedPrefix = watch('invoicePrefix');
    const watchedNumber = watch('nextInvoiceNumber');

    useEffect(() => {
        if (currentCompany) {
            reset({
                currency: currentCompany.currency || 'USD',
                invoicePrefix: currentCompany.invoicePrefix || 'INV',
                nextInvoiceNumber: currentCompany.nextInvoiceNumber || 1,
                defaultPaymentTerms: currentCompany.defaultPaymentTerms || 30,
                invoiceTerms: currentCompany.invoiceTerms || '',
                invoiceFooter: currentCompany.invoiceFooter || '',
                dateFormat: currentCompany.dateFormat || 'YYYY-MM-DD',
                timezone: currentCompany.timezone || 'UTC',
            });
        }
    }, [currentCompany, reset]);

    const onSubmit = async (data: InvoiceSettingsFormData) => {
        if (!currentCompany) return;

        setIsSaving(true);
        setSaveMessage(null);

        try {
            await updateCompany(currentCompany.id, data);
            setSaveMessage({ type: 'success', text: 'Invoice settings saved successfully' });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error: any) {
            setSaveMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save invoice settings'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="space-y-4">
                        <div className="h-12 bg-slate-200 rounded"></div>
                        <div className="h-12 bg-slate-200 rounded"></div>
                        <div className="h-32 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900">Invoice Settings</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Configure default settings for your invoices
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
                {/* Currency & Format Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Currency & Format</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">
                                Default Currency
                            </label>
                            <select
                                id="currency"
                                {...register('currency')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {currencies.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.symbol} - {currency.name} ({currency.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="dateFormat" className="block text-sm font-medium text-slate-700 mb-1">
                                Date Format
                            </label>
                            <select
                                id="dateFormat"
                                {...register('dateFormat')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {dateFormats.map((format) => (
                                    <option key={format.value} value={format.value}>
                                        {format.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 mb-1">
                                Timezone
                            </label>
                            <select
                                id="timezone"
                                {...register('timezone')}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time (US)</option>
                                <option value="America/Chicago">Central Time (US)</option>
                                <option value="America/Denver">Mountain Time (US)</option>
                                <option value="America/Los_Angeles">Pacific Time (US)</option>
                                <option value="Europe/London">London</option>
                                <option value="Europe/Paris">Paris</option>
                                <option value="Europe/Berlin">Berlin</option>
                                <option value="Asia/Tokyo">Tokyo</option>
                                <option value="Asia/Shanghai">Shanghai</option>
                                <option value="Australia/Sydney">Sydney</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="defaultPaymentTerms" className="block text-sm font-medium text-slate-700 mb-1">
                                Default Payment Terms
                            </label>
                            <select
                                id="defaultPaymentTerms"
                                {...register('defaultPaymentTerms', { valueAsNumber: true })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {paymentTermOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Invoice Numbering Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Invoice Numbering</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="invoicePrefix" className="block text-sm font-medium text-slate-700 mb-1">
                                Invoice Prefix
                            </label>
                            <input
                                id="invoicePrefix"
                                type="text"
                                {...register('invoicePrefix')}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.invoicePrefix ? 'border-red-300' : 'border-slate-300'
                                    }`}
                                placeholder="INV"
                            />
                            {errors.invoicePrefix && (
                                <p className="mt-1 text-sm text-red-600">{errors.invoicePrefix.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="nextInvoiceNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                Next Invoice Number
                            </label>
                            <input
                                id="nextInvoiceNumber"
                                type="number"
                                {...register('nextInvoiceNumber', { valueAsNumber: true })}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.nextInvoiceNumber ? 'border-red-300' : 'border-slate-300'
                                    }`}
                                min="1"
                            />
                            {errors.nextInvoiceNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.nextInvoiceNumber.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600">
                            <span className="font-medium">Preview:</span>{' '}
                            <span className="font-mono text-indigo-600">
                                {watchedPrefix || 'INV'}-{String(watchedNumber || 1).padStart(4, '0')}
                            </span>
                        </p>
                    </div>
                </section>

                {/* Default Text Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Default Text</h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="invoiceTerms" className="block text-sm font-medium text-slate-700 mb-1">
                                Terms & Conditions
                            </label>
                            <textarea
                                id="invoiceTerms"
                                {...register('invoiceTerms')}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                placeholder="Payment is due within the specified payment terms. Late payments may incur additional fees..."
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                This text will appear in the terms section of your invoices
                            </p>
                        </div>

                        <div>
                            <label htmlFor="invoiceFooter" className="block text-sm font-medium text-slate-700 mb-1">
                                Invoice Footer
                            </label>
                            <textarea
                                id="invoiceFooter"
                                {...register('invoiceFooter')}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                placeholder="Thank you for your business!"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                This text will appear at the bottom of your invoices
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
