// Quote status enum
export enum QuoteStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    VIEWED = 'VIEWED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
    CONVERTED = 'CONVERTED', // Converted to invoice
}

// Quote item (same structure as invoice item)
export interface QuoteItem {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxable: boolean;
    order: number;
}

// Full quote interface
export interface Quote {
    id: string;
    quoteNumber: string;
    status: QuoteStatus;
    issueDate: string;
    validUntil: string; // Expiry date
    sentAt?: string;
    viewedAt?: string;
    acceptedAt?: string;
    rejectedAt?: string;
    convertedAt?: string;
    convertedInvoiceId?: string; // Reference to created invoice
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    total: number;
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
    items: QuoteItem[];
    createdAt: string;
    updatedAt: string;
}

// Create quote data
export interface CreateQuoteData {
    companyId: string;
    clientId: string;
    issueDate: string;
    validUntil: string;
    taxRate?: number;
    discount?: number;
    notes?: string;
    terms?: string;
    footer?: string;
    items: CreateQuoteItemData[];
}

// Create quote item data
export interface CreateQuoteItemData {
    description: string;
    quantity: number;
    unitPrice: number;
    taxable?: boolean;
    order?: number;
}

// Update quote data
export interface UpdateQuoteData {
    clientId?: string;
    issueDate?: string;
    validUntil?: string;
    taxRate?: number;
    discount?: number;
    notes?: string;
    terms?: string;
    footer?: string;
    status?: QuoteStatus;
    items?: CreateQuoteItemData[];
}

// Quote filters
export interface QuoteFilters {
    companyId: string;
    status?: QuoteStatus;
    clientId?: string;
}

// Quote totals (for calculations)
export interface QuoteTotals {
    subtotal: number;
    taxAmount: number;
    total: number;
}
