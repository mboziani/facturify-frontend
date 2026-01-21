import { formatCurrency } from '@/lib/utils/invoiceUtils';

interface InvoicePreviewProps {
    data: any;
    company: any;
    client: any;
    totals: {
        subtotal: string;
        taxAmount: string;
        total: string;
    };
}

export function InvoicePreview({ data, company, client, totals }: InvoicePreviewProps) {
    if (!company) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                Company data missing
            </div>
        );
    }

    return (
        <div className="bg-white p-8 lg:p-12 shadow-lg border border-gray-100 min-h-[1000px] w-full max-w-[800px] mx-auto text-sm transition-all animate-fade-in relative">
            {/* Watermark for Draft */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="transform -rotate-45 text-gray-50/50 font-bold text-[150px] whitespace-nowrap select-none">
                    PREVIEW
                </div>
            </div>

            {/* Header: Company Info & Invoice Title */}
            <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-gray-100 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Draft Preview</span>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="font-bold text-xl text-gray-900">{company.name}</h2>
                    <div className="text-gray-500 mt-2 space-y-1">
                        <div className="whitespace-pre-line">{company.address || 'Company Address'}</div>
                        <div>{company.email}</div>
                        {company.phone && <div>{company.phone}</div>}
                    </div>
                </div>
            </div>

            {/* Client & Dates */}
            <div className="grid grid-cols-2 gap-12 mb-12 pb-12 border-b border-gray-100 relative z-10">
                <div>
                    <h3 className="text-indigo-600 font-semibold mb-4 uppercase text-xs tracking-wider">Bill To</h3>
                    {client ? (
                        <div className="space-y-2">
                            <div className="font-bold text-xl text-gray-900">{client.name}</div>
                            <div className="text-gray-500">{client.email}</div>
                            {client.address && <div className="text-gray-500 whitespace-pre-line">{client.address}</div>}
                        </div>
                    ) : (
                        <div className="text-gray-400 italic bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                            Select a client to view details
                        </div>
                    )}
                </div>
                <div className="text-right space-y-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="text-gray-500 flex items-center justify-end gap-2">
                            <span>Issue Date</span>
                        </div>
                        <div className="font-medium text-gray-900">{data.issueDate || 'YYYY-MM-DD'}</div>

                        <div className="text-gray-500 flex items-center justify-end gap-2">
                            <span>Due Date</span>
                        </div>
                        <div className="font-medium text-gray-900">{data.dueDate || 'YYYY-MM-DD'}</div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-12 relative z-10">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-900">
                            <th className="px-4 py-4 text-left font-bold text-gray-900 uppercase text-xs tracking-wider">Description</th>
                            <th className="px-4 py-4 text-right font-bold text-gray-900 uppercase text-xs tracking-wider w-24">Qty</th>
                            <th className="px-4 py-4 text-right font-bold text-gray-900 uppercase text-xs tracking-wider w-32">Price</th>
                            <th className="px-4 py-4 text-right font-bold text-gray-900 uppercase text-xs tracking-wider w-32">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.items?.length > 0 ? (
                            data.items.map((item: any, i: number) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-4 text-gray-900 font-medium">{item.description || <span className="text-gray-300 italic">Item description</span>}</td>
                                    <td className="px-4 py-4 text-right text-gray-600">{item.quantity}</td>
                                    <td className="px-4 py-4 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                                    <td className="px-4 py-4 text-right font-semibold text-gray-900">
                                        {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic bg-gray-50 mt-2">
                                    No items added yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-16 relative z-10">
                <div className="w-72 bg-gray-50 p-6 rounded-lg space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${totals.subtotal}</span>
                    </div>
                    {Number(totals.taxAmount) > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>Tax ({data.taxRate}%)</span>
                            <span>${totals.taxAmount}</span>
                        </div>
                    )}
                    {Number(data.discount) > 0 && (
                        <div className="flex justify-between text-emerald-600">
                            <span>Discount</span>
                            <span>-${formatCurrency(data.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 text-xl pt-4 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-indigo-600">${totals.total}</span>
                    </div>
                </div>
            </div>

            {/* Footer/Notes */}
            {(data.notes || data.terms || data.footer) && (
                <div className="border-t border-gray-100 pt-8 space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.notes && (
                            <div>
                                <h3 className="text-gray-500 font-semibold mb-2 uppercase text-xs tracking-wider">Notes</h3>
                                <div className="text-gray-600 text-sm whitespace-pre-line bg-yellow-50/50 p-4 rounded-lg border border-yellow-100">
                                    {data.notes}
                                </div>
                            </div>
                        )}
                        {data.terms && (
                            <div>
                                <h3 className="text-gray-500 font-semibold mb-2 uppercase text-xs tracking-wider">Terms & Conditions</h3>
                                <div className="text-gray-600 text-sm whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {data.terms}
                                </div>
                            </div>
                        )}
                    </div>
                    {data.footer && (
                        <div className="text-center text-gray-500 text-xs mt-8 pt-8 border-t border-gray-100">
                            {data.footer}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
