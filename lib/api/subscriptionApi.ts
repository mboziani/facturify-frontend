import apiClient from './client';
import { Subscription, SubscriptionPlan } from '@/types/subscription';

export const subscriptionApi = {
    getSubscription: async (companyId: string): Promise<Subscription> => {
        const response = await apiClient.get(`/subscriptions`, {
            params: { companyId }
        });
        return response.data;
    },

    createCheckoutSession: async (companyId: string, planId: SubscriptionPlan): Promise<{ url: string }> => {
        const response = await apiClient.post(`/subscriptions/checkout`, {
            companyId,
            planId
        });
        return response.data;
    },

    createPortalSession: async (companyId: string): Promise<{ url: string }> => {
        const response = await apiClient.post(`/subscriptions/portal`, {
            companyId
        });
        return response.data;
    },

    cancelSubscription: async (subscriptionId: string): Promise<void> => {
        await apiClient.delete(`/subscriptions/${subscriptionId}`);
    }
};
