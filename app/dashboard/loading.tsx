export default function DashboardLoading() {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-3">
                    <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-64 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
                    <div className="h-10 w-32 bg-indigo-100 rounded-lg"></div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
                            <div className="h-5 w-16 bg-slate-50 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-100 rounded"></div>
                            <div className="h-8 w-32 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section Skeleton */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div className="h-6 w-32 bg-slate-200 rounded"></div>
                        <div className="h-8 w-24 bg-slate-100 rounded"></div>
                    </div>
                    <div className="h-64 w-full bg-slate-50 rounded-xl"></div>
                </div>

                {/* Side List Skeleton */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                                    <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
