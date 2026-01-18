'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    const steps: OnboardingStep[] = [
        {
            id: 1,
            title: 'Welcome to Facturify!',
            description: 'Let\'s get your business set up in just a few steps. This will only take 2 minutes.',
            icon: (
                <svg className="w-16 h-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
            ),
        },
        {
            id: 2,
            title: 'Complete Your Profile',
            description: 'Add your company details, logo, and branding to make your invoices look professional.',
            icon: (
                <svg className="w-16 h-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
        {
            id: 3,
            title: 'Add Your First Client',
            description: 'Start by adding a client to your database. You\'ll need this to create invoices.',
            icon: (
                <svg className="w-16 h-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            id: 4,
            title: 'Create Your First Invoice',
            description: 'You\'re all set! Create your first invoice and start getting paid.',
            icon: (
                <svg className="w-16 h-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
        localStorage.setItem('onboarding_completed', 'true');
    };

    const handleComplete = () => {
        onComplete();
        localStorage.setItem('onboarding_completed', 'true');

        // Navigate based on the step
        if (currentStep === 1) {
            router.push('/dashboard/settings/branding');
        } else if (currentStep === 2) {
            router.push('/dashboard/clients/new');
        } else if (currentStep === 3) {
            router.push('/dashboard/invoices/new');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
                {/* Close Button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {Math.round(((currentStep + 1) / steps.length) * 100)}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        {steps[currentStep].icon}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {steps[currentStep].title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                        {steps[currentStep].description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4">
                    {currentStep > 0 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <div className="flex-1" />
                    <button
                        onClick={handleSkip}
                        className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                    {steps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                    ? 'bg-indigo-600 w-8'
                                    : 'bg-gray-300 dark:bg-slate-600'
                                }`}
                            aria-label={`Go to step ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
