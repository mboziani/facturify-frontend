'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo />
                        <span className="font-bold text-gray-900 text-lg">Developer API</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                            Dashboard
                        </Link>
                        <a href="mailto:support@facturify.com" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                            Support
                        </a>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Nav */}
                    <div className="lg:w-64 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4 px-2">Getting Started</h3>
                                <nav className="space-y-1">
                                    <a href="#introduction" className="block px-2 py-1.5 text-sm text-indigo-600 font-medium bg-indigo-50 rounded-md">Introduction</a>
                                    <a href="#authentication" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">Authentication</a>
                                    <a href="#rate-limits" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">Rate Limits</a>
                                </nav>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4 px-2">Resources</h3>
                                <nav className="space-y-1">
                                    <a href="#companies" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">Companies</a>
                                    <a href="#clients" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">Clients</a>
                                    <a href="#invoices" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">Invoices</a>
                                    <a href="#quotes" className="block px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">Quotes</a>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 max-w-4xl space-y-12">
                        <section id="introduction" className="space-y-4 animate-fade-in">
                            <h1 className="text-4xl font-bold text-gray-900">API Documentation</h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Welcome to the Facturify API documentation. Our API allows you to integrate invoice management, client tracking, and financial reporting directly into your applications.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <p className="text-sm text-blue-700">
                                    <strong>Base URL:</strong> <code className="bg-blue-100 px-2 py-0.5 rounded ml-2 text-blue-800">https://api.facturify.com/v1</code>
                                </p>
                            </div>
                        </section>

                        <section id="authentication" className="space-y-4 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
                            <p className="text-gray-600">
                                All API requests must be authenticated using a Bearer Token. You can obtain a token by logging in.
                            </p>
                            <div className="relative group">
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto shadow-lg">
                                    <code>{`Authorization: Bearer <your_access_token>`}</code>
                                </pre>
                            </div>
                        </section>

                        <section id="invoices" className="space-y-6 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
                            <p className="text-gray-600">Manage invoices, items, and payments.</p>

                            <div className="space-y-6">
                                {/* GET Invoices */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-4">
                                        <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full border border-green-200">GET</span>
                                        <code className="text-sm font-mono text-gray-700">/invoices</code>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-gray-600">Retrieve a paginated list of invoices for the current company.</p>
                                    </div>
                                </div>

                                {/* POST Invoices */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-4">
                                        <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full border border-blue-200">POST</span>
                                        <code className="text-sm font-mono text-gray-700">/invoices</code>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <p className="text-sm text-gray-600">Create a new invoice.</p>
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Request Body</h4>
                                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed">
                                                {`{
  "clientId": "c_12345",
  "issueDate": "2024-03-20",
  "dueDate": "2024-04-20",
  "items": [
    {
      "description": "Web Development",
      "quantity": 1,
      "unitPrice": 5000
    }
  ]
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
