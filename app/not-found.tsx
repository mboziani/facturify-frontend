import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
            </div>

            <div className="relative z-10 text-center max-w-lg">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Logo className="w-10 h-10" showText={true} />
                </div>

                {/* Error Code */}
                <div className="relative mb-8">
                    <span className="text-[180px] font-bold text-slate-100 leading-none select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-32 h-32 text-indigo-600 opacity-80"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Page not found
                </h1>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Help Link */}
                <p className="mt-12 text-sm text-slate-500">
                    Need help? <a href="mailto:support@facturify.com" className="text-indigo-600 hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
