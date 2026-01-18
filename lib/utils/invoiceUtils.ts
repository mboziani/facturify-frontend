import { InvoiceStatus } from '@/types/invoice';

export function getStatusColor(status: InvoiceStatus): {
    bg: string;
    text: string;
    label: string;
} {
    switch (status) {
        case InvoiceStatus.DRAFT:
            return {
                bg: 'bg-slate-100',
                text: 'text-slate-700',
                label: 'Draft',
            };
        case InvoiceStatus.SENT:
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-700',
                label: 'Sent',
            };
        case InvoiceStatus.VIEWED:
            return {
                bg: 'bg-amber-100',
                text: 'text-amber-700',
                label: 'Viewed',
            };
        case InvoiceStatus.PAID:
            return {
                bg: 'bg-emerald-100',
                text: 'text-emerald-700',
                label: 'Paid',
            };
        case InvoiceStatus.OVERDUE:
            return {
                bg: 'bg-red-100',
                text: 'text-red-700',
                label: 'Overdue',
            };
        case InvoiceStatus.CANCELLED:
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-700',
                label: 'Cancelled',
            };
        default:
            return {
                bg: 'bg-slate-100',
                text: 'text-slate-700',
                label: status,
            };
    }
}

export function formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}

export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
