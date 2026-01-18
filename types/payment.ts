export enum PaymentMethod {
    CASH = 'CASH',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    PAYPAL = 'PAYPAL',
    CHECK = 'CHECK',
    OTHER = 'OTHER',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export interface Payment {
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    reference?: string;
    notes?: string;
    invoiceId: string;
    companyId: string;
    invoice?: {
        id: string;
        invoiceNumber: string;
        total: number;
        client?: {
            id: string;
            name: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreatePaymentDto {
    invoiceId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: PaymentMethod;
    status?: PaymentStatus;
    reference?: string;
    notes?: string;
}

export interface UpdatePaymentDto {
    amount?: number;
    paymentDate?: string;
    paymentMethod?: PaymentMethod;
    status?: PaymentStatus;
    reference?: string;
    notes?: string;
}
