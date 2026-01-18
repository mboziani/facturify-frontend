import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
    icon,
}) => {
    return (
        <div className="text-center py-16 px-6">
            {/* Icon */}
            {icon && (
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                        {icon}
                    </div>
                </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

            {/* Description */}
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">{description}</p>

            {/* Action Button */}
            {(actionLabel && (actionHref || onAction)) && (
                actionHref ? (
                    <Link
                        href={actionHref}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {actionLabel}
                    </Link>
                ) : (
                    <button
                        onClick={onAction}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {actionLabel}
                    </button>
                )
            )}
        </div>
    );
};
