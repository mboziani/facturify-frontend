'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'One uppercase letter required')
        .regex(/[a-z]/, 'One lowercase letter required')
        .regex(/[0-9]/, 'One number required'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError('');
            setIsLoading(true);
            const { confirmPassword, ...registrationData } = data;
            await registerUser(registrationData);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side: Visual */}
            <div className="hidden lg:flex flex-col justify-between bg-[#111827] relative overflow-hidden p-12 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/3 -translate-x-1/4"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3"></div>
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
                        Start managing your business like a pro
                    </h2>
                    <ul className="space-y-4 text-lg text-gray-300 mb-8">
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">✓</div>
                            Create professional invoices in seconds
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">✓</div>
                            Track expenses and maximize profits
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">✓</div>
                            Manage clients and projects effortlessly
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 text-sm text-gray-500">
                    © 2026 Facturify Platform. All rights reserved.
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md space-y-8 py-8">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold">F</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Facturify</span>
                        </div>
                    </div>

                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Create your account</h1>
                        <p className="text-gray-500">
                            Get started with your free 14-day trial. No credit card required.
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    {...register('firstName')}
                                    className={`w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.firstName ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
                                        }`}
                                    placeholder="John"
                                    disabled={isLoading}
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    {...register('lastName')}
                                    className={`w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.lastName ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
                                        }`}
                                    placeholder="Doe"
                                    disabled={isLoading}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                {...register('email')}
                                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.email ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
                                    }`}
                                placeholder="name@company.com"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                {...register('password')}
                                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.password ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
                                    }`}
                                placeholder="Create a password"
                                disabled={isLoading}
                            />
                            {errors.password ? (
                                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-500">At least 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
                                    }`}
                                placeholder="Confirm your password"
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
