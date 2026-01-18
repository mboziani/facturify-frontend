'use client';

import { useState, useRef } from 'react';
import { useCompany } from '@/contexts/CompanyContext';

export default function BrandingSettingsPage() {
    const { currentCompany, updateCompany, isLoading } = useCompany();
    const [isSaving, setIsSaving] = useState(false);
    const [brandColor, setBrandColor] = useState(currentCompany?.brandColor || '#4F46E5');
    // Construct full logo URL from relative path
    const [logoPreview, setLogoPreview] = useState<string | null>(
        currentCompany?.logoUrl ? `${process.env.NEXT_PUBLIC_API_URL}${currentCompany.logoUrl}` : null
    );
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrandColor(e.target.value);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setSaveMessage({ type: 'error', text: 'Logo file must be under 2MB' });
                return;
            }

            // Check file type
            if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
                setSaveMessage({ type: 'error', text: 'Only JPG, PNG, and SVG files are allowed' });
                return;
            }

            // Store file for upload
            setSelectedFile(file);

            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!currentCompany) return;

        setIsSaving(true);
        setSaveMessage(null);

        try {
            // Upload logo if selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append('logo', selectedFile);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/companies/${currentCompany.id}/logo`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to upload logo');
                }

                const data = await response.json();

                // Update company with logo URL (save as relative path)
                await updateCompany(currentCompany.id, {
                    brandColor,
                    logoUrl: data.logoUrl // Just the path like "/uploads/logos/filename.ext"
                });

                // Update preview with full URL
                setLogoPreview(`${process.env.NEXT_PUBLIC_API_URL}${data.logoUrl}`);
                setSelectedFile(null);
            } else {
                // Just update brand color
                await updateCompany(currentCompany.id, { brandColor });
            }

            setSaveMessage({ type: 'success', text: 'Branding settings saved successfully' });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error: any) {
            setSaveMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || 'Failed to save branding settings'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const presetColors = [
        { name: 'Indigo', value: '#4F46E5' },
        { name: 'Emerald', value: '#059669' },
        { name: 'Blue', value: '#2563EB' },
        { name: 'Purple', value: '#7C3AED' },
        { name: 'Rose', value: '#E11D48' },
        { name: 'Orange', value: '#EA580C' },
        { name: 'Teal', value: '#0D9488' },
        { name: 'Slate', value: '#475569' },
    ];

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-40 bg-slate-200 rounded"></div>
                    <div className="h-20 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900">Branding</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Customize your brand appearance on invoices and documents
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

            <div className="space-y-8">
                {/* Logo Upload Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Company Logo</h3>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Logo Preview */}
                        <div
                            className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ cursor: 'pointer' }}
                        >
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Company logo"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <svg className="w-8 h-8 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-2 text-xs text-slate-500">Upload logo</p>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/svg+xml"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                Choose File
                            </button>
                            {logoPreview && (
                                <button
                                    type="button"
                                    onClick={() => setLogoPreview(null)}
                                    className="ml-3 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                            <p className="mt-3 text-sm text-slate-500">
                                Recommended: 500x500px, PNG or SVG format
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Maximum file size: 2MB
                            </p>
                        </div>
                    </div>
                </section>

                {/* Brand Color Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Brand Color</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        This color will be used for accents on your invoices and documents
                    </p>

                    {/* Color Picker */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="relative">
                            <input
                                type="color"
                                value={brandColor}
                                onChange={handleColorChange}
                                className="w-14 h-14 rounded-lg cursor-pointer border-2 border-slate-200 p-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">Hex:</span>
                            <input
                                type="text"
                                value={brandColor}
                                onChange={(e) => setBrandColor(e.target.value)}
                                className="w-28 px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                                pattern="^#[0-9A-Fa-f]{6}$"
                            />
                        </div>
                    </div>

                    {/* Preset Colors */}
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-3">Quick Select</p>
                        <div className="flex flex-wrap gap-3">
                            {presetColors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setBrandColor(color.value)}
                                    className={`w-10 h-10 rounded-lg transition-all ${brandColor === color.value
                                        ? 'ring-2 ring-offset-2 ring-slate-400'
                                        : 'hover:scale-110'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Preview Section */}
                <section>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Preview</h3>
                    <div className="border border-slate-200 rounded-xl p-6 bg-white">
                        <div className="flex items-center gap-4 mb-6">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain" />
                            ) : (
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                                    style={{ backgroundColor: brandColor }}
                                >
                                    {currentCompany?.name?.charAt(0) || 'A'}
                                </div>
                            )}
                            <div>
                                <h4 className="font-semibold text-slate-900">
                                    {currentCompany?.name || 'Your Company'}
                                </h4>
                                <p className="text-sm text-slate-500">
                                    {currentCompany?.email || 'billing@company.com'}
                                </p>
                            </div>
                        </div>
                        <div
                            className="h-1 w-full rounded-full mb-4"
                            style={{ backgroundColor: brandColor }}
                        />
                        <p className="text-sm text-slate-600">
                            This is how your brand will appear on invoices and other documents.
                        </p>
                    </div>
                </section>

                {/* Form Actions */}
                <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setBrandColor(currentCompany?.brandColor || '#4F46E5');
                            setLogoPreview(currentCompany?.logoUrl || null);
                        }}
                        disabled={isSaving}
                        className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
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
            </div>
        </div>
    );
}
