/**
 * MOCK DATA FOR FRONTEND DEMO MODE
 */

export const DEMO_USER = {
    id: 'demo-user-id',
    email: 'demo@facturify.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'owner',
    avatarUrl: undefined,
    emailVerified: true,
    isActive: true,
};

export const DEMO_COMPANY = {
    id: 'demo-company-id',
    name: 'Demo Company Ltd.',
    email: 'contact@democompany.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    postalCode: '94102',
    website: 'https://www.democompany.com',
    logoUrl: null,
    planId: 'FREE',
};

export const DEMO_DASHBOARD_STATS = {
    totalRevenue: 45280.50,
    paidAmount: 32780.50,
    outstandingAmount: 12500.00,
    overdueAmount: 2500.00,
    totalInvoices: 12,
    paidInvoices: 8,
    unpaidInvoices: 3,
    overdueInvoices: 1,
    totalClients: 5,
    activeClients: 5,
    totalPayments: 8,
    averageInvoiceValue: 3773.37,
};

export const DEMO_REVENUE_DATA = [
    { month: 'Jan', revenue: 4000, paid: 3500, outstanding: 500 },
    { month: 'Feb', revenue: 3000, paid: 2000, outstanding: 1000 },
    { month: 'Mar', revenue: 5000, paid: 5000, outstanding: 0 },
    { month: 'Apr', revenue: 2780, paid: 2000, outstanding: 780 },
    { month: 'May', revenue: 1890, paid: 1500, outstanding: 390 },
    { month: 'Jun', revenue: 2390, paid: 2000, outstanding: 390 },
];

export const DEMO_RECENT_ACTIVITY = {
    invoices: [
        { id: '1', invoiceNumber: 'INV-2024-001', client: { name: 'Acme Corp' }, total: 5000.00, status: 'PAID' },
        { id: '3', invoiceNumber: 'INV-2024-003', client: { name: 'Global Solutions' }, total: 7500.00, status: 'SENT' },
        { id: '5', invoiceNumber: 'INV-2024-005', client: { name: 'Digital Ventures' }, total: 4500.00, status: 'SENT' },
    ],
    payments: [
        { id: '1', invoice: { invoiceNumber: 'INV-2024-001' }, paymentDate: '2024-01-15', amount: 5000.00 },
        { id: '2', invoice: { invoiceNumber: 'INV-2024-002' }, paymentDate: '2024-01-20', amount: 3200.50 },
    ]
};

export const DEMO_CLIENTS = [
    { id: '1', name: 'Acme Corporation', email: 'billing@acme.com', phone: '+1 (555) 111-2222', city: 'New York', country: 'United States', status: 'active', totalBilled: 15400.00 },
    { id: '2', name: 'TechStart Inc.', email: 'accounts@techstart.io', phone: '+1 (555) 333-4444', city: 'Austin', country: 'United States', status: 'active', totalBilled: 8200.50 },
    { id: '3', name: 'Global Solutions Ltd.', email: 'finance@globalsolutions.eu', phone: '+44 20 1234 5678', city: 'London', country: 'United Kingdom', status: 'active', totalBilled: 12500.00 },
    { id: '4', name: 'Innovation Labs', email: 'payments@innovationlabs.com', phone: '+1 (555) 555-6666', city: 'Seattle', country: 'United States', status: 'inactive', totalBilled: 4500.00 },
    { id: '5', name: 'Digital Ventures', email: 'billing@digitalventures.co', phone: '+1 (555) 777-8888', city: 'Los Angeles', country: 'United States', status: 'active', totalBilled: 4680.00 },
];

export const DEMO_INVOICES = [
    { id: '1', invoiceNumber: 'INV-2024-001', client: { name: 'Acme Corporation' }, amount: 5000.00, status: 'paid', issueDate: '2024-01-15', dueDate: '2024-02-15' },
    { id: '2', invoiceNumber: 'INV-2024-002', client: { name: 'TechStart Inc.' }, amount: 3200.50, status: 'paid', issueDate: '2024-01-20', dueDate: '2024-02-20' },
    { id: '3', invoiceNumber: 'INV-2024-003', client: { name: 'Global Solutions Ltd.' }, amount: 7500.00, status: 'sent', issueDate: '2024-02-01', dueDate: '2024-03-01' },
    { id: '4', invoiceNumber: 'INV-2024-004', client: { name: 'Innovation Labs' }, amount: 2800.00, status: 'paid', issueDate: '2024-02-05', dueDate: '2024-03-05' },
    { id: '5', invoiceNumber: 'INV-2024-005', client: { name: 'Digital Ventures' }, amount: 4500.00, status: 'sent', issueDate: '2024-02-10', dueDate: '2024-03-10' },
    { id: '6', invoiceNumber: 'INV-2024-006', client: { name: 'Acme Corporation' }, amount: 6200.00, status: 'draft', issueDate: '2024-02-15', dueDate: '2024-03-15' },
    { id: '7', invoiceNumber: 'INV-2024-007', client: { name: 'TechStart Inc.' }, amount: 8900.00, status: 'overdue', issueDate: '2023-12-15', dueDate: '2024-01-15' },
    { id: '8', invoiceNumber: 'INV-2024-008', client: { name: 'Global Solutions Ltd.' }, amount: 3400.00, status: 'sent', issueDate: '2024-02-18', dueDate: '2024-03-18' },
    { id: '9', invoiceNumber: 'INV-2024-009', client: { name: 'Innovation Labs' }, amount: 5600.00, status: 'paid', issueDate: '2024-01-25', dueDate: '2024-02-25' },
    { id: '10', invoiceNumber: 'INV-2024-010', client: { name: 'Digital Ventures' }, amount: 4100.00, status: 'draft', issueDate: '2024-02-20', dueDate: '2024-03-20' },
];

export const DEMO_EXPENSES = [
    { id: '1', description: 'Office Supplies', amount: 125.50, category: 'office_supplies', date: '2024-02-15', status: 'approved' },
    { id: '2', description: 'Adobe Creative Cloud', amount: 52.99, category: 'software', date: '2024-02-14', status: 'approved' },
    { id: '3', description: 'Client Lunch Meeting', amount: 87.30, category: 'meals', date: '2024-02-12', status: 'pending' },
    { id: '4', description: 'AWS Hosting', amount: 245.00, category: 'hosting', date: '2024-02-10', status: 'approved' },
    { id: '5', description: 'Dell Monitor', amount: 399.99, category: 'equipment', date: '2024-02-05', status: 'approved' },
    { id: '6', description: 'Google Ads', amount: 500.00, category: 'marketing', date: '2024-02-01', status: 'approved' },
    { id: '7', description: 'Internet Bill', amount: 89.99, category: 'utilities', date: '2024-01-28', status: 'approved' },
    { id: '8', description: 'Flight to NY', amount: 450.00, category: 'travel', date: '2024-01-20', status: 'approved' },
];

export const DEMO_NOTIFICATIONS = [
    {
        id: '1',
        userId: 'demo-user-id',
        type: 'invoice_paid',
        title: 'Invoice Paid',
        message: 'Invoice #INV-2024-001 has been paid via Stripe.',
        priority: 'medium',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        data: { invoiceId: '1' },
    },
    {
        id: '2',
        userId: 'demo-user-id',
        type: 'client_registered',
        title: 'New Client Registration',
        message: 'TechStart Inc. has accepted your invitation.',
        priority: 'high',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        data: { clientId: '2' },
    },
    {
        id: '3',
        userId: 'demo-user-id',
        type: 'payment_received',
        title: 'Payment Received',
        message: 'Received $2,500.00 from Global Solutions Ltd.',
        priority: 'low',
        read: true,
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 1 day ago
    },
    {
        id: '4',
        userId: 'demo-user-id',
        type: 'login_success',
        title: 'Security Alert',
        message: 'New login detected from Mock Browser (Chrome/Windows).',
        priority: 'low',
        read: true,
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    }
];

export const DEMO_INCOME_STATEMENT = {
    period: 2024,
    data: [
        { month: 'Jan', revenue: 4000, expenses: 1500, netIncome: 2500, invoiceCount: 2 },
        { month: 'Feb', revenue: 3000, expenses: 1200, netIncome: 1800, invoiceCount: 1 },
        { month: 'Mar', revenue: 5000, expenses: 2000, netIncome: 3000, invoiceCount: 3 },
        { month: 'Apr', revenue: 2780, expenses: 1100, netIncome: 1680, invoiceCount: 1 },
        { month: 'May', revenue: 1890, expenses: 900, netIncome: 990, invoiceCount: 1 },
        { month: 'Jun', revenue: 2390, expenses: 1000, netIncome: 1390, invoiceCount: 1 },
        { month: 'Jul', revenue: 3490, expenses: 1400, netIncome: 2090, invoiceCount: 2 },
    ],
    totals: {
        revenue: 22550,
        expenses: 9100,
        netIncome: 13450,
        invoiceCount: 11
    }
};

export const DEMO_AGING_REPORT = {
    generatedAt: new Date().toISOString(),
    totalReceivables: 12500.00,
    buckets: {
        'current': { label: 'Current', amount: 8000.00, count: 2, invoices: [{ id: '9', invoiceNumber: 'INV-2024-009', clientName: 'Innovation Labs', amount: 5600.00, dueDate: '2024-02-25', daysOverdue: 0 }, { id: '4', invoiceNumber: 'INV-2024-004', clientName: 'Innovation Labs', amount: 2400.00, dueDate: '2024-03-05', daysOverdue: 0 }] },
        '1-30': { label: '1-30 Days', amount: 2000.00, count: 1, invoices: [{ id: '8', invoiceNumber: 'INV-2024-008', clientName: 'Global Solutions Ltd.', amount: 2000.00, dueDate: '2024-02-18', daysOverdue: 10 }] },
        '31-60': { label: '31-60 Days', amount: 2500.00, count: 1, invoices: [{ id: '7', invoiceNumber: 'INV-2024-007', clientName: 'TechStart Inc.', amount: 2500.00, dueDate: '2024-01-15', daysOverdue: 45 }] },
        '61-90': { label: '61-90 Days', amount: 0, count: 0, invoices: [] },
        '90+': { label: '90+ Days', amount: 0, count: 0, invoices: [] },
    }
};

export const DEMO_INVITATIONS = [
    {
        id: '1',
        email: 'pending@colleague.com',
        role: 'MEMBER',
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        inviter: { firstName: 'Demo', lastName: 'User' },
        companyId: 'demo-company-id'
    }
];

export const DEMO_RECURRING_INVOICES = [
    {
        id: 'rec-1',
        name: 'Monthly Retainer - Acme Corp',
        clientId: '1',
        companyId: 'demo-company-id',
        client: { id: '1', name: 'Acme Corporation', email: 'billing@acme.com' },
        items: [
            { description: 'Monthly Consultation Services', quantity: 1, price: 5000.00 }
        ],
        taxRate: 10,
        discount: 0,
        frequency: 'MONTHLY',
        startDate: '2024-01-01',
        endDate: undefined,
        lastGenerated: '2024-02-01',
        nextGenerationDate: '2024-03-01',
        isActive: true,
        notes: 'Monthly retainer for ongoing consulting services',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
    },
    {
        id: 'rec-2',
        name: 'Quarterly Maintenance - TechStart',
        clientId: '2',
        companyId: 'demo-company-id',
        client: { id: '2', name: 'TechStart Inc.', email: 'accounts@techstart.io' },
        items: [
            { description: 'Quarterly System Maintenance', quantity: 1, price: 2500.00 },
            { description: 'Security Updates Package', quantity: 1, price: 500.00 }
        ],
        taxRate: 8,
        discount: 100,
        frequency: 'QUARTERLY',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        lastGenerated: '2024-01-15',
        nextGenerationDate: '2024-04-15',
        isActive: true,
        notes: 'Quarterly maintenance contract',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
    },
];

// Demo Quotes
export const DEMO_QUOTES = [
    {
        id: 'quote-1',
        quoteNumber: 'QUO-0001',
        status: 'SENT',
        issueDate: '2024-02-01',
        validUntil: '2024-03-01',
        sentAt: '2024-02-01T10:00:00Z',
        subtotal: 5000.00,
        taxRate: 10,
        taxAmount: 500.00,
        discount: 0,
        total: 5500.00,
        notes: 'Website redesign project proposal',
        terms: 'Payment due within 30 days of acceptance',
        companyId: 'demo-company-id',
        clientId: '1',
        client: {
            id: '1',
            name: 'Acme Corporation',
            email: 'billing@acmecorp.com',
            phone: '+1 (555) 123-0001',
            addressLine1: '100 Corporate Blvd',
            city: 'New York',
            country: 'United States',
        },
        items: [
            { id: 'qi-1', description: 'Website Design', quantity: 1, unitPrice: 3000.00, amount: 3000.00, taxable: true, order: 1 },
            { id: 'qi-2', description: 'Development & Integration', quantity: 1, unitPrice: 2000.00, amount: 2000.00, taxable: true, order: 2 },
        ],
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
    },
    {
        id: 'quote-2',
        quoteNumber: 'QUO-0002',
        status: 'ACCEPTED',
        issueDate: '2024-01-15',
        validUntil: '2024-02-15',
        sentAt: '2024-01-15T14:00:00Z',
        viewedAt: '2024-01-16T09:00:00Z',
        acceptedAt: '2024-01-18T11:00:00Z',
        convertedAt: '2024-01-18T11:05:00Z',
        convertedInvoiceId: 'inv-demo-5',
        subtotal: 8500.00,
        taxRate: 8,
        taxAmount: 680.00,
        discount: 500,
        total: 8680.00,
        notes: 'Mobile app development - Phase 1',
        companyId: 'demo-company-id',
        clientId: '2',
        client: {
            id: '2',
            name: 'TechStart Inc.',
            email: 'accounts@techstart.io',
            phone: '+1 (555) 234-5678',
            addressLine1: '456 Innovation Way',
            city: 'San Francisco',
            country: 'United States',
        },
        items: [
            { id: 'qi-3', description: 'UI/UX Design', quantity: 40, unitPrice: 100.00, amount: 4000.00, taxable: true, order: 1 },
            { id: 'qi-4', description: 'React Native Development', quantity: 45, unitPrice: 100.00, amount: 4500.00, taxable: true, order: 2 },
        ],
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-18T11:05:00Z',
    },
    {
        id: 'quote-3',
        quoteNumber: 'QUO-0003',
        status: 'DRAFT',
        issueDate: '2024-02-10',
        validUntil: '2024-03-10',
        subtotal: 2500.00,
        taxRate: 10,
        taxAmount: 250.00,
        discount: 0,
        total: 2750.00,
        notes: 'Consulting services proposal',
        companyId: 'demo-company-id',
        clientId: '3',
        client: {
            id: '3',
            name: 'Global Consulting Group',
            email: 'finance@globalconsulting.com',
            addressLine1: '789 Advisory Lane',
            city: 'Chicago',
            country: 'United States',
        },
        items: [
            { id: 'qi-5', description: 'Strategy Consulting', quantity: 10, unitPrice: 250.00, amount: 2500.00, taxable: true, order: 1 },
        ],
        createdAt: '2024-02-10T00:00:00Z',
        updatedAt: '2024-02-10T00:00:00Z',
    },
    {
        id: 'quote-4',
        quoteNumber: 'QUO-0004',
        status: 'REJECTED',
        issueDate: '2024-01-20',
        validUntil: '2024-02-20',
        sentAt: '2024-01-20T08:00:00Z',
        viewedAt: '2024-01-21T10:00:00Z',
        rejectedAt: '2024-01-25T15:00:00Z',
        subtotal: 15000.00,
        taxRate: 10,
        taxAmount: 1500.00,
        discount: 0,
        total: 16500.00,
        notes: 'Enterprise software license',
        companyId: 'demo-company-id',
        clientId: '4',
        client: {
            id: '4',
            name: 'StartupHub',
            email: 'hello@startuphub.co',
            addressLine1: '321 Venture Blvd',
            city: 'Austin',
            country: 'United States',
        },
        items: [
            { id: 'qi-6', description: 'Enterprise License', quantity: 1, unitPrice: 15000.00, amount: 15000.00, taxable: true, order: 1 },
        ],
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-25T15:00:00Z',
    },
    {
        id: 'quote-5',
        quoteNumber: 'QUO-0005',
        status: 'EXPIRED',
        issueDate: '2023-12-01',
        validUntil: '2024-01-01',
        sentAt: '2023-12-01T10:00:00Z',
        subtotal: 3500.00,
        taxRate: 5,
        taxAmount: 175.00,
        discount: 0,
        total: 3675.00,
        notes: 'Annual maintenance package',
        companyId: 'demo-company-id',
        clientId: '5',
        client: {
            id: '5',
            name: 'Design Masters',
            email: 'invoices@designmasters.io',
            addressLine1: '555 Creative Ave',
            city: 'Los Angeles',
            country: 'United States',
        },
        items: [
            { id: 'qi-7', description: 'Annual Maintenance', quantity: 1, unitPrice: 3500.00, amount: 3500.00, taxable: true, order: 1 },
        ],
        createdAt: '2023-12-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];
// Demo Projects
export const DEMO_PROJECTS = [
    {
        id: '1',
        name: 'Website Redesign',
        description: 'Complete overhaul of the corporate website using Next.js and Tailwind CSS.',
        status: 'IN_PROGRESS',
        startDate: '2024-01-10',
        endDate: '2024-03-31',
        budget: 15000,
        companyId: 'demo-company-id',
        clientId: '1',
        client: { id: '1', name: 'Acme Corporation' },
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-02-20T00:00:00Z',
    },
    {
        id: '2',
        name: 'Mobile App Development',
        description: 'Building a cross-platform mobile app for customer engagement.',
        status: 'NOT_STARTED',
        startDate: '2024-03-01',
        endDate: '2024-06-30',
        budget: 25000,
        companyId: 'demo-company-id',
        clientId: '2',
        client: { id: '2', name: 'TechStart Inc.' },
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-02-15T00:00:00Z',
    },
    {
        id: '3',
        name: 'SEO Optimization',
        description: 'Improving search engine rankings and organic traffic.',
        status: 'COMPLETED',
        startDate: '2023-11-01',
        endDate: '2023-12-31',
        budget: 5000,
        companyId: 'demo-company-id',
        clientId: '3',
        client: { id: '3', name: 'Global Solutions Ltd.' },
        createdAt: '2023-10-15T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z',
    }
];

// Demo Time Entries
export const DEMO_TIME_ENTRIES = [
    {
        id: 'te-1',
        description: 'Homepage UI Design',
        duration: 120, // 2 hours
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        billable: true,
        status: 'LOCKED',
        companyId: 'demo-company-id',
        projectId: '1',
        project: { id: '1', name: 'Website Redesign' },
        clientId: '1',
        client: { id: '1', name: 'Acme Corporation' },
        hourlyRate: 150,
    },
    {
        id: 'te-2',
        description: 'React Component Development',
        duration: 240, // 4 hours
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        billable: true,
        status: 'APPROVED',
        companyId: 'demo-company-id',
        projectId: '1',
        project: { id: '1', name: 'Website Redesign' },
        clientId: '1',
        client: { id: '1', name: 'Acme Corporation' },
        hourlyRate: 150,
    }
];
// Demo Subscription
export const DEMO_MEMBERS = [
    {
        id: 'mem-1',
        userId: 'demo-user-id',
        companyId: 'demo-company-id',
        role: 'owner',
        joinedAt: '2024-01-01T00:00:00Z',
        user: {
            id: 'demo-user-id',
            email: 'demo@facturify.com',
            firstName: 'Demo',
            lastName: 'User',
            avatarUrl: undefined
        }
    },
    {
        id: 'mem-2',
        userId: 'user-2',
        companyId: 'demo-company-id',
        role: 'admin',
        joinedAt: '2024-01-15T00:00:00Z',
        user: {
            id: 'user-2',
            email: 'sarah@facturify.com',
            firstName: 'Sarah',
            lastName: 'Connor',
            avatarUrl: undefined
        }
    }
];

export const DEMO_SUBSCRIPTION = {
    id: 'sub-demo-123',
    companyId: 'demo-company-id',
    planId: 'FREE',
    status: 'ACTIVE',
    currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days from now
    cancelAtPeriodEnd: false,
};
