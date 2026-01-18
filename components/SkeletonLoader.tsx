import React from 'react';

export const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4 border-b border-gray-100 animate-pulse flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
        ))}
    </div>
);

export const SkeletonStat = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <SkeletonStat key={i} />)}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
        </div>

        {/* Recent Activity */}
        <SkeletonTable rows={3} />
    </div>
);
