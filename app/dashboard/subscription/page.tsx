'use client';

import { useCompany } from '@/contexts/CompanyContext';
import { useState } from 'react';
import { subscriptionApi } from '@/lib/api/subscriptionApi';
import { SubscriptionPlan } from '@/types/subscription';
import toast from 'react-hot-toast';

export default function SubscriptionPage() {
    const { currentCompany } = useCompany();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isLoading, setIsLoading] = useState(false);

    const PLANS = [
        {
            id: 'FREE' as SubscriptionPlan,
            name: 'Starter',
            price: billingCycle === 'monthly' ? '$0' : '$0',
            period: billingCycle === 'monthly' ? '/month' : '/year',
            description: 'Perfect for freelancers just starting out.',
            features: [
                '10 Invoices / month',
                '5 Clients',
                '1 Active User',
                'Basic Reports',
                'Email Support'
            ],
            button: 'Current Plan',
            current: currentCompany?.planId === 'FREE',
        },
        {
            id: 'PRO' as SubscriptionPlan,
            name: 'Professional',
            price: billingCycle === 'monthly' ? '$19' : '$182',
            period: billingCycle === 'monthly' ? '/month' : '/year',
            description: 'For growing businesses that need automation.',
            features: [
                'Unlimited Invoices',
                'Unlimited Clients',
                '1 Active User',
                'Recurring Invoices',
                'Expense Tracking',
                'Advanced Reports',
                'Priority Support'
            ],
            button: 'Upgrade to Pro',
            highlight: true,
            current: currentCompany?.planId === 'PRO',
        },
        {
            id: 'ENTERPRISE' as SubscriptionPlan,
            name: 'Business',
            price: billingCycle === 'monthly' ? '$49' : '$470',
            period: billingCycle === 'monthly' ? '/month' : '/year',
            description: 'Full power for scaling teams.',
            features: [
                'Everything in Pro',
                '5 Team Members',
                'Team Collaboration',
                'Custom Branding',
                'API Access',
                'Dedicated Support'
            ],
            button: 'Contact Sales',
            current: currentCompany?.planId === 'ENTERPRISE',
        },
    ];

    const handleUpgrade = async (planId: SubscriptionPlan) => {
        if (!currentCompany) return;
        if (planId === currentCompany.planId) return;

        setIsLoading(true);
        try {
            const { url } = await subscriptionApi.createCheckoutSession(currentCompany.id, planId);
            window.location.href = url;
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            toast.error('Failed to initiate checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageBilling = async () => {
        if (!currentCompany) return;
        setIsLoading(true);
        try {
            const { url } = await subscriptionApi.createPortalSession(currentCompany.id);
            window.location.href = url;
        } catch (error) {
            console.error('Failed to create portal session:', error);
            toast.error('Failed to open billing portal.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
                <p className="text-lg text-slate-600">
                    Choose the plan that fits your business needs. Upgrade or downgrade at any time.
                </p>

                {/* Billing Toggle (Visual Only) */}
                <div className="mt-8 flex justify-center items-center gap-3">
                    <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                    >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                    <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
                        Yearly <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-2 py-0.5 rounded-full ml-1">-20%</span>
                    </span>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative rounded-2xl p-8 bg-white ${plan.highlight
                            ? 'ring-2 ring-indigo-600 shadow-xl scale-105 z-10'
                            : 'border border-slate-200 shadow-sm hover:shadow-md transition-shadow'
                            }`}
                    >
                        {plan.highlight && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-sm text-slate-500 min-h-[40px]">{plan.description}</p>
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                            <span className="text-slate-500">{plan.period}</span>
                        </div>

                        <ul className="mb-8 space-y-4">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start text-sm text-slate-600">
                                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={plan.current || isLoading}
                            onClick={() => handleUpgrade(plan.id)}
                            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${plan.current
                                ? 'bg-slate-100 text-slate-400 cursor-default'
                                : plan.highlight
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                    : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                                }`}
                        >
                            {isLoading && !plan.current && (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            )}
                            {plan.button}
                        </button>
                    </div>
                ))}
            </div>

            {/* Current Usage Info */}
            <div className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Current Usage</h3>
                    {currentCompany?.planId !== 'FREE' && (
                        <button
                            onClick={handleManageBilling}
                            disabled={isLoading}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Manage Billing & Invoices
                        </button>
                    )}
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700">Invoices</span>
                            <span className="text-slate-500">3 / 10</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700">Clients</span>
                            <span className="text-slate-500">2 / 5</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700">Users</span>
                            <span className="text-slate-500">1 / 1</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
