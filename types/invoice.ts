// Invoice status enum matching backend
export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    VIEWED = 'VIEWED',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
}

// Invoice item
export interface InvoiceItem {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxable: boolean;
    order: number;
}

// Full invoice interface
export interface Invoice {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    paidDate?: string;
    sentAt?: string;
    viewedAt?: string;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    total: number;
    amountPaid: number;
    amountDue: number;
    notes?: string;
    terms?: string;
    footer?: string;
    companyId: string;
    clientId: string;
    client?: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        city?: string;
        country?: string;
    };
    items: InvoiceItem[];
    createdAt: string;
    updatedAt: string;
}

// Create invoice data
export interface CreateInvoiceData {
    companyId: string;
    clientId: string;
    issueDate: string;
    dueDate: string;
    taxRate?: number;
    discount?: number;
    notes?: string;
    terms?: string;
    footer?: string;
    items: CreateInvoiceItemData[];
}

// Create invoice item data
export interface CreateInvoiceItemData {
    description: string;
    quantity: number;
    unitPrice: number;
    taxable?: boolean;
    order?: number;
}

// Update invoice data
export interface UpdateInvoiceData {
    clientId?: string;
    issueDate?: string;
    dueDate?: string;
    taxRate?: number;
    discount?: number;
    notes?: string;
    terms?: string;
    footer?: string;
    status?: InvoiceStatus;
    items?: CreateInvoiceItemData[];
}

// Mark as paid data
export interface MarkAsPaidData {
    paidDate: string;
    amountPaid?: number;
}

// Invoice filters
export interface InvoiceFilters {
    companyId: string;
    status?: InvoiceStatus;
    clientId?: string;
}

// Invoice totals (for calculations)
export interface InvoiceTotals {
    subtotal: number;
    taxAmount: number;
    total: number;
    amountDue: number;
}
