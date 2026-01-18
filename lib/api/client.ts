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
    DEMO_INVITATIONS
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
    if (url?.includes('/reports/export')) {
        return success([]);
    }

    // Team Invitations
    if (url?.includes('/team-invitations')) {
        if (method === 'get') return success(DEMO_INVITATIONS);
        return success({ success: true });
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
