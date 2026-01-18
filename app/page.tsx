'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useEffect, useState } from 'react';

// SVG Icons
const Icons = {
    Check: () => (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    ArrowRight: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    ),
    Invoice: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Chart: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Users: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Recurring: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    ),
    Mail: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Wallet: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Shield: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.284-2.253" />
        </svg>
    ),
    ArrowUp: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    ),
    Apple: () => (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.07-.52-2.09-.51-3.2.05-1.16.58-2.22.42-3.23-.5C-1.87 13.9 1.48 4.3 9.4 4c2.05.08 3.5 1.34 4.5 1.34.86 0 2.5-1.34 4.14-1.21 1.4.11 2.65.65 3.39 1.72-2.95 1.76-2.45 5.58.55 6.8-.57 1.54-1.5 3.17-2.67 4.88-.66.97-1.36 1.94-2.26 2.75zm-3.05-16.5c-.88 1.08-2.15 1.7-3.17 1.63-.22-1.07.38-2.16 1-3 1.12-1.42 2.76-1.35 2.76-1.35.12 1.38-.6 2.72-1.59 2.72z" />
        </svg>
    ),
    Android: () => (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997M6.4769 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997M18.4334 18.7395l1.9596 3.407c.0772.1337.0315.3056-.1023.3828-.045.026-.0949.0387-.1446.0387-.0876 0-.1724-.0386-.2269-.1079l-2.022-3.5152c-1.7454.795-3.7634 1.258-5.8972 1.258-2.1338 0-4.1518-.463-5.8972-1.258l-2.022 3.5152c-.0851.15-.2765.201-.4264.1146-.1337-.0771-.1794-.249-.1023-.3828l1.9596-3.407c-2.4334-1.3323-4.085-3.8055-4.2259-6.666h16.899c.1432 2.8943-2.0838 5.6793-4.6657 6.6186" />
        </svg>
    ),
    WifiOff: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18M12.42 12.42a5.53 5.53 0 00-6.84 0M16.59 8.25a10.03 10.03 0 00-9.18 0M20.25 4.5a15.05 15.05 0 00-8.6 0m-4.65 0C5.35 4.5 3.3 5.09 1.5 6.13M12 16.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
        </svg>
    ),
    CloudSync: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    ),
};

export default function HomePage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        // Add smooth scroll behavior to the document
        document.documentElement.style.scrollBehavior = 'smooth';

        // 1. Efficient Scroll Handler (Visuals)
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    setIsScrolled(scrollY > 20);
                    setShowScrollTop(scrollY > 400);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);

        // 2. Intersection Observer (Active Section Logic)
        const observerOptions = {
            root: null,
            rootMargin: '-81px 0px -50% 0px', // Offset for navbar height
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        const sections = ['features', 'how-it-works', 'pricing', 'faq'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 80; // Height of sticky navbar
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-50 transform -translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Navigation */}
            <nav className={`relative z-10 border-b sticky top-0 transition-all duration-300 ${isScrolled
                ? 'border-gray-300 bg-white backdrop-blur-xl shadow-lg'
                : 'border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm'
                }`}>
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Logo className="w-8 h-8" showText={true} />

                    {/* Center Nav Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
                        <button
                            type="button"
                            onClick={() => scrollToSection('features')}
                            className={`transition-colors relative group ${activeSection === 'features'
                                ? 'text-indigo-600 font-semibold'
                                : 'text-gray-800 hover:text-indigo-600'
                                }`}
                        >
                            Features
                            <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${activeSection === 'features' ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollToSection('how-it-works')}
                            className={`transition-colors relative group ${activeSection === 'how-it-works'
                                ? 'text-indigo-600 font-semibold'
                                : 'text-gray-800 hover:text-indigo-600'
                                }`}
                        >
                            How It Works
                            <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${activeSection === 'how-it-works' ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollToSection('pricing')}
                            className={`transition-colors relative group ${activeSection === 'pricing'
                                ? 'text-indigo-600 font-semibold'
                                : 'text-gray-800 hover:text-indigo-600'
                                }`}
                        >
                            Pricing
                            <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${activeSection === 'pricing' ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollToSection('faq')}
                            className={`transition-colors relative group ${activeSection === 'faq'
                                ? 'text-indigo-600 font-semibold'
                                : 'text-gray-800 hover:text-indigo-600'
                                }`}
                        >
                            FAQ
                            <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${activeSection === 'faq' ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="bg-indigo-600 text-white hover:text-white hover:bg-indigo-700 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105"
                        >
                            Start Free Trial
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Trusted by 10,000+ businesses worldwide
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
                            Invoice smarter.<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                                Get paid faster.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            The all-in-one platform for freelancers and small businesses to create invoices,
                            track expenses, manage clients, and get paid on time. Every time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-xl">
                                Start Your Free Trial
                                <span className="group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></span>
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white hover:text-white hover:bg-indigo-700 rounded-xl text-lg font-semibold transition-all shadow-lg">
                                Try Demo Account
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2"><Icons.Check /> No credit card required</div>
                            <div className="flex items-center gap-2"><Icons.Check /> 14-day free trial</div>
                            <div className="flex items-center gap-2"><Icons.Check /> Cancel anytime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="relative z-10 py-12 border-y border-gray-100 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <p className="text-center text-sm text-gray-500 mb-8">Trusted by forward-thinking teams at</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-50">
                        {['Acme Corp', 'TechFlow', 'DesignHub', 'StartupX', 'AgencyPro'].map((name) => (
                            <span key={name} className="text-2xl font-bold text-gray-400">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get started in minutes</h2>
                        <p className="text-lg text-gray-600">From signup to your first invoice in under 5 minutes. No training required.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            { step: '01', title: 'Create Account', desc: 'Sign up free and set up your company profile with your branding.' },
                            { step: '02', title: 'Add Clients', desc: 'Import or create client records with all their billing information.' },
                            { step: '03', title: 'Send Invoices', desc: 'Generate professional PDF invoices and send them via email instantly.' },
                            { step: '04', title: 'Get Paid', desc: 'Track payments, send reminders, and manage your cash flow.' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-indigo-200">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative z-10 py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to run your business</h2>
                        <p className="text-lg text-gray-600">Powerful features designed for freelancers, agencies, and growing teams.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Icons.Invoice />, title: 'Professional Invoicing', desc: 'Create branded invoices with your logo, colors, and custom terms. Generate PDFs instantly.' },
                            { icon: <Icons.Recurring />, title: 'Recurring Billing', desc: 'Set up automated recurring invoices for retainer clients. Never miss a billing cycle.' },
                            { icon: <Icons.Users />, title: 'Client Management', desc: 'Store client details, track communication history, and manage relationships in one place.' },
                            { icon: <Icons.Wallet />, title: 'Expense Tracking', desc: 'Log expenses by category, attach receipts, and see exactly where your money goes.' },
                            { icon: <Icons.Chart />, title: 'Financial Reports', desc: 'Real-time dashboards showing revenue, outstanding invoices, and profit margins.' },
                            { icon: <Icons.Mail />, title: 'Email Automation', desc: 'Automatic payment reminders and thank-you emails keep your cash flow healthy.' },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <div className="bg-indigo-900 rounded-3xl p-12 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 grid md:grid-cols-4 gap-8 text-center">
                            {[
                                { value: '$2.5B+', label: 'Invoices Processed' },
                                { value: '10,000+', label: 'Active Businesses' },
                                { value: '99.9%', label: 'Uptime SLA' },
                                { value: '4.9/5', label: 'Customer Rating' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                    <div className="text-indigo-200">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative z-10 py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
                        <p className="text-lg text-gray-600">Start free, upgrade when you're ready. No hidden fees.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { name: 'Starter', price: '$0', period: '/month', desc: 'Perfect for freelancers just getting started.', features: ['10 invoices/month', '5 clients', 'Basic reports', 'Email support'], cta: 'Start Free', highlight: false },
                            { name: 'Professional', price: '$29', period: '/month', desc: 'For growing businesses with recurring clients.', features: ['100 invoices/month', '50 clients', 'Recurring billing', 'Expense tracking', 'Priority support'], cta: 'Start Trial', highlight: true },
                            { name: 'Business', price: '$99', period: '/month', desc: 'Unlimited power for scaling teams.', features: ['Unlimited invoices', 'Unlimited clients', 'Team collaboration', 'API access', 'Dedicated support'], cta: 'Contact Sales', highlight: false },
                        ].map((plan, i) => (
                            <div key={i} className={`relative rounded-2xl p-8 ${plan.highlight ? 'bg-indigo-600 text-white ring-4 ring-indigo-600 ring-offset-4 scale-105' : 'bg-white border border-gray-200'}`}>
                                {plan.highlight && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold">Most Popular</div>}
                                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                                <p className={`text-sm mb-6 ${plan.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>{plan.desc}</p>
                                <div className="mb-6">
                                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                                    <span className={plan.highlight ? 'text-indigo-200' : 'text-gray-500'}>{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm">
                                            <svg className={`w-5 h-5 ${plan.highlight ? 'text-indigo-200' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/register" className={`block text-center py-3 px-4 rounded-xl font-semibold transition-colors ${plan.highlight ? 'bg-white text-indigo-600 hover:bg-gray-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile Application Section */}
            <section className="relative z-10 py-24 bg-white overflow-hidden border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <div className="flex-1 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                New Mobile App
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Manage your business <br />
                                <span className="text-indigo-600">from anywhere.</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Take Facturify with you. Create invoices, track expenses, and manage clients directly from your pocket. Works flawlessly online and offline, keeping your data seamlessly synchronized.
                            </p>

                            {/* Features List */}
                            <div className="space-y-6 mb-10">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:border-orange-200 hover:bg-orange-50/50 group">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-110 transition-transform">
                                        <Icons.WifiOff />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">Offline Mode Support</h3>
                                        <p className="text-gray-600">No internet? No problem. Continue creating invoices and logging expenses. We'll sync everything automatically when you're back online.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:border-blue-200 hover:bg-blue-50/50 group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                                        <Icons.CloudSync />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">Instant Cloud Sync</h3>
                                        <p className="text-gray-600">All your data is synchronized in real-time across all your devices. Start an invoice on your phone and finish it on your desktop.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Download Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center gap-3 px-6 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group">
                                    <span className="group-hover:scale-110 transition-transform"><Icons.Apple /></span>
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Download on the</div>
                                        <div className="text-base font-bold leading-none mt-1">App Store</div>
                                    </div>
                                </button>
                                <button className="flex items-center gap-3 px-6 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group">
                                    <span className="group-hover:scale-110 transition-transform"><Icons.Android /></span>
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Get it on</div>
                                        <div className="text-base font-bold leading-none mt-1">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Mockup */}
                        <div className="flex-1 relative w-full flex justify-center lg:justify-end">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30 mix-blend-multiply"></div>

                            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white relative">
                                    {/* Mockup Top Bar */}
                                    {/* Mockup Screen Content */}
                                    <div className="bg-indigo-600 h-36 p-6 text-white pt-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
                                        <div className="relative z-10">
                                            <div className="text-sm opacity-90 font-medium mb-1">Total Revenue</div>
                                            <div className="text-3xl font-bold tracking-tight">$12,450.00</div>
                                            <div className="flex gap-2 mt-4">
                                                <div className="bg-indigo-500 px-3 py-1 rounded-full text-xs font-semibold">+12% vs last month</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-6 bg-gray-50 h-full">
                                        {/* Activity List */}
                                        <div>
                                            <div className="flex justify-between items-center text-sm font-bold text-gray-900 mb-3">
                                                <span>Recent Invoices</span>
                                                <span className="text-indigo-600 text-xs uppercase tracking-wide cursor-pointer">View All</span>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { name: 'Acme Corp', amount: '$1,200', status: 'Paid', color: 'bg-green-100 text-green-700' },
                                                    { name: 'DesignHub', amount: '$850', status: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
                                                    { name: 'TechFlow', amount: '$2,340', status: 'Overdue', color: 'bg-red-100 text-red-700' },
                                                    { name: 'Studio One', amount: '$500', status: 'Paid', color: 'bg-green-100 text-green-700' },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                            {item.name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-bold text-gray-900 truncate">{item.name}</div>
                                                            <div className="text-xs text-gray-500">Invoice #{1000 + i}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-bold text-gray-900">{item.amount}</div>
                                                            <div className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block font-bold mt-0.5 ${item.color}`}>
                                                                {item.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Nav Mockup */}
                                    {/* (Omitted for simpler CSS - content fills screen) */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by businesses everywhere</h2>
                        <p className="text-lg text-gray-600">See what our customers have to say about Facturify.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { quote: "Facturify cut my invoicing time by 80%. I used to spend hours on admin work, now it's minutes.", name: 'Sarah Chen', role: 'Freelance Designer' },
                            { quote: "The recurring invoice feature is a game-changer. My retainer clients are billed automatically every month.", name: 'Marcus Johnson', role: 'Marketing Consultant' },
                            { quote: "Finally, a platform that's simple enough to use daily but powerful enough to scale with my agency.", name: 'Emily Rodriguez', role: 'Agency Owner' },
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex text-yellow-400 mb-4">{'★★★★★'}</div>
                                <p className="text-gray-700 mb-6 leading-relaxed">"{t.quote}"</p>
                                <div>
                                    <div className="font-bold text-gray-900">{t.name}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="relative z-10 py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
                        <p className="text-lg text-gray-600">Everything you need to know about Facturify.</p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            { q: 'How does the free trial work?', a: 'You get full access to all Professional features for 14 days. No credit card required. At the end of your trial, you can choose a plan or continue with our free Starter plan.' },
                            { q: 'Can I import my existing clients?', a: 'Yes! You can import clients via CSV or connect with popular tools like QuickBooks, Xero, and FreshBooks.' },
                            { q: 'Is my data secure?', a: 'Absolutely. We use bank-level 256-bit SSL encryption, and your data is backed up daily across multiple secure data centers.' },
                            { q: 'Can I customize my invoices?', a: 'Yes, you can add your company logo, choose brand colors, set custom payment terms, and add personalized notes to every invoice.' },
                            { q: 'What payment methods can my clients use?', a: 'Clients can pay via credit card, bank transfer, or PayPal. We integrate with Stripe for seamless payment processing.' },
                        ].map((faq, i) => (
                            <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                                    {faq.q}
                                    <span className="ml-4 transform group-open:rotate-180 transition-transform">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 text-gray-600">{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to get paid faster?</h2>
                            <p className="text-indigo-100 text-lg mb-10">Join 10,000+ businesses using Facturify to streamline their invoicing and grow their revenue.</p>
                            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors shadow-lg">
                                Start Your Free Trial <Icons.ArrowRight />
                            </Link>
                            <p className="mt-6 text-indigo-200 text-sm">No credit card required • Setup in 2 minutes</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-black text-gray-400 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    {/* Newsletter Section */}
                    <div className="border-b border-slate-800/50">
                        <div className="container mx-auto px-6 py-16">
                            <div className="max-w-4xl mx-auto text-center">
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    Stay Updated with Facturify
                                </h3>
                                <p className="text-lg text-gray-400 mb-8">
                                    Get the latest features, tips, and insights delivered to your inbox.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                    <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25">
                                        Subscribe
                                    </button>
                                </div>
                                <p className="mt-4 text-xs text-gray-500">
                                    No spam. Unsubscribe anytime.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Footer Content */}
                    <div className="container mx-auto px-6 py-16">
                        <div className="grid md:grid-cols-6 gap-12 mb-16">
                            {/* Brand Column */}
                            <div className="md:col-span-2">
                                <Logo className="w-8 h-8 mb-6" showText={true} variant="dark" />
                                <p className="text-sm leading-relaxed text-gray-400 mb-8 max-w-xs">
                                    Professional invoicing and billing platform trusted by thousands of businesses worldwide.
                                </p>

                                {/* Social Links */}
                                <div className="flex gap-3">
                                    <a
                                        href="#"
                                        className="group w-11 h-11 bg-slate-800/50 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                                        aria-label="Twitter"
                                    >
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="group w-11 h-11 bg-slate-800/50 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                                        aria-label="LinkedIn"
                                    >
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="group w-11 h-11 bg-slate-800/50 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                                        aria-label="GitHub"
                                    >
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="group w-11 h-11 bg-slate-800/50 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                                        aria-label="YouTube"
                                    >
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Product Column */}
                            <div>
                                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Product</h4>
                                <ul className="space-y-4 text-sm">
                                    <li><a href="#features" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Features
                                    </a></li>
                                    <li><a href="#pricing" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Pricing
                                    </a></li>
                                    <li><a href="/api-docs" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        API
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Integrations
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Changelog
                                    </a></li>
                                </ul>
                            </div>

                            {/* Company Column */}
                            <div>
                                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Company</h4>
                                <ul className="space-y-4 text-sm">
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        About Us
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Blog
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Careers
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Press Kit
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Contact
                                    </a></li>
                                </ul>
                            </div>

                            {/* Resources Column */}
                            <div>
                                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
                                <ul className="space-y-4 text-sm">
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Documentation
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Help Center
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Tutorials
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Community
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Status
                                    </a></li>
                                </ul>
                            </div>

                            {/* Legal Column */}
                            <div>
                                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h4>
                                <ul className="space-y-4 text-sm">
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Privacy
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Terms
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Security
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        GDPR
                                    </a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Cookies
                                    </a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-slate-800/50 pt-8">
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                                <p className="text-sm text-gray-500 order-2 lg:order-1">
                                    © {new Date().getFullYear()} <span className="text-white font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Facturify</span>. All rights reserved. Made with ❤️ for businesses worldwide.
                                </p>

                                <div className="flex items-center gap-6 text-xs order-1 lg:order-2">
                                    <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-emerald-400 font-medium">99.9% Uptime</span>
                                    </span>
                                    <span className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-blue-400 font-medium">SSL Secured</span>
                                    </span>
                                    <span className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-purple-400 font-medium">SOC 2 Compliant</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
                    }`}
                aria-label="Scroll to top"
            >
                <Icons.ArrowUp />
            </button>
        </div>
    );
}
