import apiClient from './client';
import type {
    Quote,
    CreateQuoteData,
    UpdateQuoteData,
    QuoteFilters,
} from '@/types/quote';

export const quoteApi = {
    /**
     * Create a new quote
     */
    async createQuote(data: CreateQuoteData): Promise<Quote> {
        const response = await apiClient.post<Quote>('/quotes', data);
        return response.data;
    },

    /**
     * Get all quotes with optional filters
     */
    async getQuotes(filters: QuoteFilters): Promise<Quote[]> {
        const params: any = { companyId: filters.companyId };
        if (filters.status) {
            params.status = filters.status;
        }
        if (filters.clientId) {
            params.clientId = filters.clientId;
        }
        const response = await apiClient.get<Quote[]>('/quotes', { params });
        return response.data;
    },

    /**
     * Get a single quote by ID
     */
    async getQuote(quoteId: string): Promise<Quote> {
        const response = await apiClient.get<Quote>(`/quotes/${quoteId}`);
        return response.data;
    },

    /**
     * Update a quote
     */
    async updateQuote(quoteId: string, data: UpdateQuoteData): Promise<Quote> {
        const response = await apiClient.patch<Quote>(`/quotes/${quoteId}`, data);
        return response.data;
    },

    /**
     * Delete a quote
     */
    async deleteQuote(quoteId: string): Promise<void> {
        await apiClient.delete(`/quotes/${quoteId}`);
    },

    /**
     * Mark quote as sent
     */
    async markAsSent(quoteId: string): Promise<Quote> {
        const response = await apiClient.post<Quote>(`/quotes/${quoteId}/send`);
        return response.data;
    },

    /**
     * Mark quote as accepted
     */
    async markAsAccepted(quoteId: string): Promise<Quote> {
        const response = await apiClient.post<Quote>(`/quotes/${quoteId}/accept`);
        return response.data;
    },

    /**
     * Mark quote as rejected
     */
    async markAsRejected(quoteId: string): Promise<Quote> {
        const response = await apiClient.post<Quote>(`/quotes/${quoteId}/reject`);
        return response.data;
    },

    /**
     * Convert quote to invoice
     */
    async convertToInvoice(quoteId: string): Promise<{ quote: Quote; invoiceId: string }> {
        const response = await apiClient.post<{ quote: Quote; invoiceId: string }>(`/quotes/${quoteId}/convert`);
        return response.data;
    },

    /**
     * Mark quote as viewed (public endpoint)
     */
    async markAsViewed(quoteId: string): Promise<Quote> {
        const response = await apiClient.post<Quote>(`/quotes/${quoteId}/view`);
        return response.data;
    },

    /**
     * Duplicate a quote
     */
    async duplicateQuote(quoteId: string): Promise<Quote> {
        const response = await apiClient.post<Quote>(`/quotes/${quoteId}/duplicate`);
        return response.data;
    },
};
