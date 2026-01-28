import axios, { AxiosAdapter } from 'axios';
import {
    DEMO_USER,
    DEMO_COMPANY,
    DEMO_DASHBOARD_STATS,
    DEMO_CLIENTS,
    DEMO_INVOICES,
    DEMO_EXPENSES,
    DEMO_NOTIFICATIONS,
    DEMO_REVENUE_DATA,
    DEMO_RECENT_ACTIVITY,
    DEMO_INCOME_STATEMENT,
    DEMO_AGING_REPORT,
    DEMO_INVITATIONS,
    DEMO_RECURRING_INVOICES,
    DEMO_QUOTES,
    DEMO_PROJECTS,
    DEMO_TIME_ENTRIES,
    DEMO_SUBSCRIPTION,
    DEMO_MEMBERS
} from '../mock-data';

// Helper to check if demo mode is active
const isDemoMode = () => typeof window !== 'undefined' && localStorage.getItem('isDemoMode') === 'true';

// Default adapter to fallback to local network
const defaultAdapter = axios.defaults.adapter as AxiosAdapter;

// Custom adapter for mock data
const mockAdapter: AxiosAdapter = async (config) => {
    // Only intercept if in demo mode
    if (!isDemoMode()) {
        //@ts-ignore - axios type definition issue for adapter
        return defaultAdapter(config);
    }

    // Artificial delay for realism (optimized for speed)
    await new Promise(resolve => setTimeout(resolve, 50));

    const { url, method } = config;

    // Helper to return success response
    const success = (data: any) => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
    });

    console.log(`[Mock API] ${method?.toUpperCase()} ${url}`);

    // --- MOCK ROUTES ---

    // Auth / Profile / Login
    if (url?.includes('/auth/login')) {
        return success({
            user: DEMO_USER,
            tokens: { accessToken: 'demo-token', refreshToken: 'demo-refresh-token' }
        });
    }
    if (url?.includes('/auth/register')) {
        return success({
            user: DEMO_USER,
            tokens: { accessToken: 'demo-token', refreshToken: 'demo-refresh-token' }
        });
    }
    if (url?.includes('/auth/logout')) {
        return success({ success: true });
    }
    if (url?.includes('/auth/profile') || url?.includes('/users/me') || url?.includes('/auth/me')) {
        return success(DEMO_USER);
    }

    // Dashboard
    if (url?.includes('/analytics/dashboard')) {
        return success(DEMO_DASHBOARD_STATS);
    }
    if (url?.includes('/analytics/revenue')) {
        return success(DEMO_REVENUE_DATA);
    }
    if (url?.includes('/analytics/recent-activity')) {
        return success(DEMO_RECENT_ACTIVITY);
    }
    if (url?.includes('/analytics/tax-summary')) {
        return success({ collectedTax: 4500, pendingTax: 1200, expenseTax: 800, netTaxOwed: 4900 });
    }
    if (url?.includes('/analytics/projects')) {
        return success(DEMO_PROJECTS.map(p => ({
            projectId: p.id,
            projectName: p.name,
            revenue: p.budget || 0,
            expenses: (p.budget || 0) * 0.4,
            profit: (p.budget || 0) * 0.6,
            margin: 60
        })));
    }

    // Clients
    if (url?.includes('/clients')) {
        if (method === 'get') {
            // Check for ID
            const idMatch = url.match(/\/clients\/(\w+)/);
            if (idMatch && idMatch[1] && !url.endsWith('/clients')) {
                const client = DEMO_CLIENTS.find(c => c.id === idMatch[1]);
                return client ? success(client) : Promise.reject({ response: { status: 404 } });
            }
            return success(DEMO_CLIENTS);
        }
    }

    // Invoices
    if (url?.includes('/invoices')) {
        if (url?.includes('/overdue')) {
            return success(DEMO_INVOICES.filter(i => i.status === 'OVERDUE'));
        }

        // Actions (Send, Pay, View) - Return existing invoice
        if (url?.includes('/send') || url?.includes('/pay') || url?.includes('/view')) {
            return success(DEMO_INVOICES[0]);
        }

        if (method === 'get') {
            const idMatch = url.match(/\/invoices\/([\w-]+)/);
            if (idMatch && idMatch[1] && !url.endsWith('/invoices')) {
                const invoice = DEMO_INVOICES.find(i => i.id === idMatch[1]);
                return invoice ? success(invoice) : Promise.reject({ response: { status: 404 } });
            }
            return success(DEMO_INVOICES);
        }

        // Create / Update
        return success(DEMO_INVOICES[0]);
    }

    // Expenses
    if (url?.includes('/expenses')) {
        if (method === 'get') {
            return success(DEMO_EXPENSES);
        }
    }

    // Companies
    if (url?.includes('/companies')) {
        if (url.includes('/default') || url.includes('/role')) {
            return success(DEMO_COMPANY);
        }
        if (method === 'get' && !url.match(/\/companies\/[\w-]+$/)) {
            // List
            return success([DEMO_COMPANY]);
        }
        // Get One
        return success(DEMO_COMPANY);
    }

    if (url?.match(/\/companies\/[\w-]+\/members/)) {
        return success(DEMO_MEMBERS);
    }

    // Notifications
    if (url?.includes('/notifications')) {
        // Unread Count
        if (url?.includes('/unread-count')) {
            const count = DEMO_NOTIFICATIONS.filter(n => !n.read).length;
            return success({ count });
        }

        // Mark All Read
        if (url?.includes('/read-all') && method === 'patch') {
            DEMO_NOTIFICATIONS.forEach(n => n.read = true);
            return success({ success: true });
        }

        // Mark Single Read
        if (url?.match(/\/notifications\/[\w-]+\/read/) && method === 'patch') {
            const idMatch = url.match(/\/notifications\/([\w-]+)\/read/);
            if (idMatch && idMatch[1]) {
                const notif = DEMO_NOTIFICATIONS.find(n => n.id === idMatch[1]);
                if (notif) notif.read = true;
            }
            return success({ success: true });
        }

        // Delete
        if (method === 'delete') {
            // In a real mock we would filter the array, but here we just return success
            return success({ success: true });
        }

        // Get List
        if (method === 'get') {
            return success(DEMO_NOTIFICATIONS);
        }
    }

    // Reports
    if (url?.includes('/reports/income-statement')) {
        return success(DEMO_INCOME_STATEMENT);
    }
    if (url?.includes('/reports/aging')) {
        return success(DEMO_AGING_REPORT);
    }
    if (url?.includes('/reports/projects')) {
        return success(DEMO_PROJECTS.map(p => ({
            projectId: p.id,
            projectName: p.name,
            clientName: p.client?.name || 'Internal',
            revenue: p.budget || 0,
            expenses: (p.budget || 0) * 0.4,
            profit: (p.budget || 0) * 0.6,
            margin: 60,
            timeLogged: 120
        })));
    }
    if (url?.includes('/reports/tax')) {
        return success({
            totals: { revenue: 200000, taxCollected: 20000, expenses: 68000, deductions: 13500, netTax: 6500 }
        });
    }
    if (url?.includes('/reports/export')) {
        return success([]);
    }

    // Team Invitations
    if (url?.includes('/team-invitations')) {
        if (method === 'get') return success(DEMO_INVITATIONS);
        return success({ success: true });
    }

    // Recurring Invoices
    if (url?.includes('/recurring-invoices')) {
        if (url?.includes('/generate')) {
            return success(DEMO_INVOICES[0]); // Return a generated invoice
        }
        if (method === 'get') {
            const idMatch = url.match(/\/recurring-invoices\/([\w-]+)/);
            if (idMatch && idMatch[1] && !url.endsWith('/recurring-invoices')) {
                const template = DEMO_RECURRING_INVOICES.find(r => r.id === idMatch[1]);
                return template ? success(template) : Promise.reject({ response: { status: 404 } });
            }
            return success(DEMO_RECURRING_INVOICES);
        }
        if (method === 'post') {
            return success(DEMO_RECURRING_INVOICES[0]);
        }
        if (method === 'delete') {
            return success({ success: true });
        }
        return success(DEMO_RECURRING_INVOICES[0]);
    }

    // Quotes
    if (url?.includes('/quotes')) {
        // Actions (Send, Accept, Reject, View, Convert)
        if (url?.includes('/send') || url?.includes('/view')) {
            return success({ ...DEMO_QUOTES[0], status: 'SENT', sentAt: new Date().toISOString() });
        }
        if (url?.includes('/accept')) {
            return success({ ...DEMO_QUOTES[0], status: 'ACCEPTED', acceptedAt: new Date().toISOString() });
        }
        if (url?.includes('/reject')) {
            return success({ ...DEMO_QUOTES[0], status: 'REJECTED', rejectedAt: new Date().toISOString() });
        }
        if (url?.includes('/convert')) {
            return success({
                quote: { ...DEMO_QUOTES[0], status: 'CONVERTED', convertedAt: new Date().toISOString(), convertedInvoiceId: 'inv-new-1' },
                invoiceId: 'inv-new-1'
            });
        }
        if (url?.includes('/duplicate')) {
            return success({ ...DEMO_QUOTES[0], id: 'quote-dup-1', quoteNumber: 'QUO-0006', status: 'DRAFT' });
        }

        if (method === 'get') {
            const idMatch = url.match(/\/quotes\/([\w-]+)/);
            if (idMatch && idMatch[1] && !url.endsWith('/quotes')) {
                const quote = DEMO_QUOTES.find(q => q.id === idMatch[1]);
                return quote ? success(quote) : Promise.reject({ response: { status: 404 } });
            }
            return success(DEMO_QUOTES);
        }
        if (method === 'post') {
            return success({ ...DEMO_QUOTES[0], id: 'quote-new-1', quoteNumber: 'QUO-0006' });
        }
        if (method === 'patch') {
            return success(DEMO_QUOTES[0]);
        }
        if (method === 'delete') {
            return success({ success: true });
        }
        return success(DEMO_QUOTES[0]);
    }

    // Projects
    if (url?.includes('/projects')) {
        if (method === 'get') {
            const idMatch = url.match(/\/projects\/([\w-]+)/);
            if (idMatch && idMatch[1] && !url.endsWith('/projects')) {
                const project = DEMO_PROJECTS.find(p => p.id === idMatch[1]);
                return project ? success(project) : Promise.reject({ response: { status: 404 } });
            }
            return success(DEMO_PROJECTS);
        }
        if (method === 'post') return success({ ...DEMO_PROJECTS[0], id: 'proj-' + Math.random() });
        return success(DEMO_PROJECTS[0]);
    }

    // Tasks
    if (url?.includes('/tasks')) {
        if (method === 'get') return success([]);
        return success({ id: 'task-' + Math.random(), status: 'TODO' });
    }

    // Time Entries
    if (url?.includes('/time-entries')) {
        if (method === 'get') {
            return success(DEMO_TIME_ENTRIES);
        }
        return success({ ...DEMO_TIME_ENTRIES[0], id: 'te-' + Math.random() });
    }

    // Subscriptions
    if (url?.includes('/subscriptions')) {
        if (url?.includes('/checkout')) {
            return success({ url: 'https://checkout.stripe.com/demo' });
        }
        if (url?.includes('/portal')) {
            return success({ url: 'https://billing.stripe.com/demo' });
        }
        if (method === 'get') {
            return success(DEMO_SUBSCRIPTION);
        }
        if (method === 'delete') {
            return success({ success: true });
        }
    }

    // Fallback for unmocked routes in demo mode (return empty or generic success to prevent errors)
    // or let it fail if we want to be strict. For demo, avoiding errors is better.
    if (method === 'get') {
        console.error(`[Mock API] CRITICAL: Missing mock for ${url}. Returning empty object.`);
        return success({});
    }

    return success({ success: true, message: 'Operation simulated in demo mode' });
};

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    adapter: mockAdapter, // Use our wrapper adapter
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If in demo mode, suppress most errors
        if (isDemoMode()) {
            console.warn('[Mock API] Suppressed error:', error);
            return Promise.resolve({ data: {} });
        }

        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    // No refresh token, redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Try to refresh the token
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/refresh`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Store new tokens
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // We need to use default adapter for refresh to avoid circular mock logic if needed,
                // but since refresh is a specific URL not mocked above, standard axios should handle it?
                // Actually, the refresh call above uses `axios.post` directly, not `apiClient`, 
                // so it won't use our `mockAdapter` unless we configured global defaults.
                // But `apiClient(originalRequest)` WILL use mockAdapter.
                // If we are NOT in demo mode (since we are in error handler), this is fine.

                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
