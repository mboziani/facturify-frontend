export interface Company {
    id: string;
    name: string;
    legalName?: string;
    logoUrl?: string;
    brandColor?: string;

    // Contact
    email?: string;
    phone?: string;
    website?: string;

    // Address
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;

    // Tax
    vatNumber?: string;
    taxId?: string;

    // Banking
    bankName?: string;
    bankAccountNumber?: string;
    iban?: string;
    swiftBic?: string;

    // Settings
    currency: string;
    dateFormat: string;
    timezone: string;

    // Invoice
    invoicePrefix: string;
    nextInvoiceNumber: number;
    invoiceTerms?: string;
    invoiceFooter?: string;
    defaultPaymentTerms: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface CreateCompanyData {
    name: string;
    legalName?: string;
    logoUrl?: string;
    email?: string;
    phone?: string;
    website?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    vatNumber?: string;
    taxId?: string;
    bankName?: string;
    bankAccountNumber?: string;
    iban?: string;
    swiftBic?: string;
    currency?: string;
    brandColor?: string;
    dateFormat?: string;
    timezone?: string;
    invoicePrefix?: string;
    nextInvoiceNumber?: number;
    invoiceTerms?: string;
    invoiceFooter?: string;
    defaultPaymentTerms?: number;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> { }

export interface CompanyRole {
    role: 'owner' | 'admin' | 'member' | null;
}
