'use client';

import { useState, useEffect } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { COUNTRIES, getCountryByCode } from '@/lib/data/countries';
import { CURRENCIES } from '@/lib/data/currencies';

export default function CompanyInformationPage() {
    const { currentCompany, updateCompany, isLoading } = useCompany();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        legalName: '',
        email: '',
        phone: '',
        website: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        currency: 'USD',
        vatNumber: '',
        taxId: '',
        bankName: '',
        bankAccountNumber: '',
        iban: '',
        swiftBic: '',
    });

    useEffect(() => {
        if (currentCompany) {
            setFormData({
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
                country: currentCompany.country || 'US',
                currency: currentCompany.currency || 'USD',
                vatNumber: currentCompany.vatNumber || '',
                taxId: currentCompany.taxId || '',
                bankName: (currentCompany as any).bankName || '',
                bankAccountNumber: (currentCompany as any).bankAccountNumber || '',
                iban: (currentCompany as any).iban || '',
                swiftBic: (currentCompany as any).swiftBic || '',
            });
        }
    }, [currentCompany]);

    const selectedCountry = getCountryByCode(formData.country);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-update currency when country changes
        if (name === 'country') {
            const country = getCountryByCode(value);
            if (country) {
                setFormData(prev => ({ ...prev, currency: country.currency }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCompany) return;

        setIsSaving(true);
        setSaveMessage(null);

        try {
            await updateCompany(currentCompany.id, formData);
            setSaveMessage({ type: 'success', text: 'Company information updated successfully' });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error: any) {
            setSaveMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update company information'
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
                    <div className="h-40 bg-slate-200 rounded"></div>
                    <div className="h-40 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900">Company Information</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your company details for invoicing and tax compliance
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

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <section className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Legal Name
                            </label>
                            <input
                                type="text"
                                name="legalName"
                                value={formData.legalName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </section>

                {/* Address */}
                <section className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Business Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Address Line 1
                            </label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                State/Province
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Country
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
                            >
                                {COUNTRIES.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Tax & Currency */}
                <section className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Tax & Currency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Currency
                            </label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
                            >
                                {CURRENCIES.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.code} - {currency.name} ({currency.symbol})
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1.5 text-xs text-slate-500">
                                Default: {selectedCountry?.currencySymbol} ({selectedCountry?.currency})
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {selectedCountry?.taxIdLabel || 'Tax ID'}
                            </label>
                            <input
                                type="text"
                                name="taxId"
                                value={formData.taxId}
                                onChange={handleChange}
                                placeholder={selectedCountry?.taxIdFormat ? `Format: ${selectedCountry.taxIdFormat}` : ''}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        {selectedCountry?.requiresVat && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    VAT Number
                                    {selectedCountry.region === 'EU' && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="vatNumber"
                                    value={formData.vatNumber}
                                    onChange={handleChange}
                                    required={selectedCountry.region === 'EU'}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                />
                                <p className="mt-1.5 text-xs text-slate-500">
                                    Default tax rate: {selectedCountry.defaultTaxRate}% ({selectedCountry.defaultTaxName})
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Banking Information */}
                {selectedCountry?.requiresIban && (
                    <section className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Banking Information</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Banking details will appear on your invoices for international payments
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    IBAN
                                </label>
                                <input
                                    type="text"
                                    name="iban"
                                    value={formData.iban}
                                    onChange={handleChange}
                                    placeholder="GB29 NWBK 6016 1331 9268 19"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    SWIFT/BIC
                                </label>
                                <input
                                    type="text"
                                    name="swiftBic"
                                    value={formData.swiftBic}
                                    onChange={handleChange}
                                    placeholder="NWBKGB2L"
                                    maxLength={11}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors font-mono text-sm uppercase"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    name="bankAccountNumber"
                                    value={formData.bankAccountNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors font-mono text-sm"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Form Actions */}
                <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (currentCompany) {
                                setFormData({
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
                                    country: currentCompany.country || 'US',
                                    currency: currentCompany.currency || 'USD',
                                    vatNumber: currentCompany.vatNumber || '',
                                    taxId: currentCompany.taxId || '',
                                    bankName: (currentCompany as any).bankName || '',
                                    bankAccountNumber: (currentCompany as any).bankAccountNumber || '',
                                    iban: (currentCompany as any).iban || '',
                                    swiftBic: (currentCompany as any).swiftBic || '',
                                });
                            }
                        }}
                        disabled={isSaving}
                        className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
