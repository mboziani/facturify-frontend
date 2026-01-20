'use client';

import { useState } from 'react';
import type { Quote } from '@/types/quote';

interface SendQuoteEmailDialogProps {
    quote: Quote;
    isOpen: boolean;
    onClose: () => void;
    onSend: (emailData: EmailData) => Promise<void>;
}

export interface EmailData {
    to: string;
    cc?: string;
    subject: string;
    message: string;
    attachPDF?: boolean;
}

export default function SendQuoteEmailDialog({ quote, isOpen, onClose, onSend }: SendQuoteEmailDialogProps) {
    const [emailData, setEmailData] = useState<EmailData>({
        to: quote.client?.email || '',
        cc: '',
        subject: `Quote ${quote.quoteNumber} from Your Company`,
        message: `Dear ${quote.client?.name || 'Valued Client'},

Thank you for your interest in our services. Please find attached quote ${quote.quoteNumber} for your review.

Quote Details:
- Quote Number: ${quote.quoteNumber}
- Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}
- Total Amount: $${quote.total.toFixed(2)}

If you have any questions or would like to proceed, please don't hesitate to contact us.

Best regards,
Your Company Team`,
        attachPDF: true,
    });

    const [sending, setSending] = useState(false);
    const [showCC, setShowCC] = useState(false);

    const handleSend = async () => {
        if (!emailData.to) {
            alert('Please enter a recipient email address');
            return;
        }

        setSending(true);
        try {
            await onSend(emailData);
            onClose();
        } catch (error) {
            console.error('Failed to send email:', error);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Send Quote via Email</h2>
                        <p className="text-sm text-slate-500 mt-1">Quote {quote.quoteNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-4">
                        {/* To */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                To <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={emailData.to}
                                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                                placeholder="client@example.com"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* CC Toggle */}
                        {!showCC ? (
                            <button
                                onClick={() => setShowCC(true)}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                + Add CC
                            </button>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        CC
                                    </label>
                                    <button
                                        onClick={() => {
                                            setShowCC(false);
                                            setEmailData({ ...emailData, cc: '' });
                                        }}
                                        className="text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <input
                                    type="email"
                                    value={emailData.cc}
                                    onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })}
                                    placeholder="cc@example.com"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={emailData.message}
                                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                                rows={12}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                            />
                        </div>

                        {/* Attach PDF */}
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="attachPDF"
                                checked={emailData.attachPDF}
                                onChange={(e) => setEmailData({ ...emailData, attachPDF: e.target.checked })}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="attachPDF" className="flex items-center gap-2 cursor-pointer">
                                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                    Attach PDF (quote-{quote.quoteNumber}.pdf)
                                </span>
                            </label>
                        </div>

                        {/* Preview Info */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-900">Email will be sent from your company email</p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        The client will receive this email with the quote details and can view/download the PDF attachment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={sending}
                        className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending || !emailData.to || !emailData.subject || !emailData.message}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {sending ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Send Quote
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
