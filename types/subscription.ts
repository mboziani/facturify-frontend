export type SubscriptionPlan = 'FREE' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING';

export interface Subscription {
    id: string;
    companyId: string;
    planId: SubscriptionPlan;
    status: SubscriptionStatus;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
}

export interface PlanDetails {
    id: SubscriptionPlan;
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
    limits: {
        invoices: number; // -1 for unlimited
        clients: number;
        teamMembers: number;
    }
}
