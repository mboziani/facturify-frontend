import { useCompany } from '@/contexts/CompanyContext';
import { SubscriptionPlan } from '@/types/subscription';

export type Feature =
    | 'RECURRING_INVOICES'
    | 'EXPENSE_TRACKING'
    | 'ADVANCED_REPORTS'
    | 'CUSTOM_BRANDING'
    | 'API_ACCESS'
    | 'TEAM_COLLABORATION';

const PLAN_FEATURES: Record<SubscriptionPlan, Feature[]> = {
    'FREE': [],
    'PRO': ['RECURRING_INVOICES', 'EXPENSE_TRACKING', 'ADVANCED_REPORTS'],
    'ENTERPRISE': ['RECURRING_INVOICES', 'EXPENSE_TRACKING', 'ADVANCED_REPORTS', 'CUSTOM_BRANDING', 'API_ACCESS', 'TEAM_COLLABORATION'],
};

export function usePermissions() {
    const { currentCompany } = useCompany();

    const plan = currentCompany?.planId || 'FREE';

    const hasFeature = (feature: Feature): boolean => {
        return PLAN_FEATURES[plan].includes(feature);
    };

    const isPlan = (planId: SubscriptionPlan): boolean => {
        return plan === planId;
    };

    return {
        plan,
        hasFeature,
        isPlan,
        isPro: plan === 'PRO' || plan === 'ENTERPRISE',
        isEnterprise: plan === 'ENTERPRISE',
    };
}
