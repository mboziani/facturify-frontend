'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');
            setIsLoading(true);
            await login(data);
            // Set flag for dashboard to show welcome message
            localStorage.setItem('justLoggedIn', 'true');
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const useDemoAccount = () => {
        setValue('email', 'demo@facturify.com');
        setValue('password', 'demo123');
        setError('');
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side: Visual */}
            <div className="hidden lg:flex flex-col justify-between bg-[#111827] relative overflow-hidden p-12 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <Link href="/">
                        <Logo className="w-8 h-8" showText={true} variant="dark" />
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold mb-6 leading-tight">
                        Transform your business financial management
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Join thousands of entrepreneurs who trust Facturify to manage their invoices, track expenses, and grow their business.
                    </p>

                    {/* Testimonial or Stat */}
                    <div className="flex items-center gap-4 py-6 border-t border-gray-800">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#111827] bg-gray-700 flex items-center justify-center overflow-hidden">
                                    <svg className="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex text-yellow-500 mb-1">★★★★★</div>
                            <p className="text-sm text-gray-400">Trusted by over 10,000 businesses</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-gray-500">
                    © {new Date().getFullYear()} Facturify Platform. All rights reserved.
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8">
                        <div className="flex items-center gap-2 mb-8">
                            <Link href="/">
                                <Logo className="w-7 h-7" showText={true} />
                            </Link>
                        </div>
                    </div>

                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h1>
                        <p className="text-gray-500">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm flex items-center gap-2 animate-shake">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Demo Account Info */}
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-blue-900 mb-1">Try our demo account</p>
                                <p className="text-xs text-blue-700 mb-3">
                                    Explore all features with pre-loaded data. No signup required!
                                </p>
                                <button
                                    type="button"
                                    onClick={useDemoAccount}
                                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 underline"
                                >
                                    Click to auto-fill demo credentials →
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={`w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.email ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
                                        }`}
                                    placeholder="name@company.com"
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    {...register('password')}
                                    className={`w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.password ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
                                        }`}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                'Sign in to account'
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">New to Facturify?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    );
}
