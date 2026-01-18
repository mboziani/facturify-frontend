import { PaymentMethod, PaymentStatus } from '@/types/payment';

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
    const labels: Record<PaymentMethod, string> = {
        [PaymentMethod.CASH]: 'Cash',
        [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
        [PaymentMethod.CREDIT_CARD]: 'Credit Card',
        [PaymentMethod.DEBIT_CARD]: 'Debit Card',
        [PaymentMethod.PAYPAL]: 'PayPal',
        [PaymentMethod.CHECK]: 'Check',
        [PaymentMethod.OTHER]: 'Other',
    };
    return labels[method];
};

export const getPaymentStatusColor = (
    status: PaymentStatus
): { bg: string; text: string; label: string } => {
    const colors: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
        [PaymentStatus.PENDING]: {
            bg: 'bg-amber-100',
            text: 'text-amber-700',
            label: 'Pending',
        },
        [PaymentStatus.COMPLETED]: {
            bg: 'bg-emerald-100',
            text: 'text-emerald-700',
            label: 'Completed',
        },
        [PaymentStatus.FAILED]: {
            bg: 'bg-red-100',
            text: 'text-red-700',
            label: 'Failed',
        },
        [PaymentStatus.REFUNDED]: {
            bg: 'bg-purple-100',
            text: 'text-purple-700',
            label: 'Refunded',
        },
    };
    return colors[status];
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
};
