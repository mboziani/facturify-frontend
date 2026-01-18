export default function APIDocsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="container mx-auto px-6 py-12 max-w-5xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        API Documentation
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Build powerful integrations with the Facturify API. Enterprise plan required.
                    </p>
                </div>

                {/* Quick Start */}
                <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-slate-700 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Start</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Base URL</h3>
                            <code className="block bg-gray-100 dark:bg-slate-900 p-3 rounded-lg text-sm text-gray-800 dark:text-gray-200">
                                https://api.facturify.com/v1
                            </code>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Authentication</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                All API requests require an API key in the Authorization header:
                            </p>
                            <code className="block bg-gray-100 dark:bg-slate-900 p-3 rounded-lg text-sm text-gray-800 dark:text-gray-200">
                                Authorization: Bearer YOUR_API_KEY
                            </code>
                        </div>
                    </div>
                </section>

                {/* Endpoints */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Endpoints</h2>

                    {/* Invoices */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Invoices</h3>
                        <div className="space-y-4">
                            <div className="border-l-4 border-green-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">GET</span>
                                    <code className="text-sm text-gray-800 dark:text-gray-200">/invoices</code>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">List all invoices</p>
                            </div>

                            <div className="border-l-4 border-blue-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">POST</span>
                                    <code className="text-sm text-gray-800 dark:text-gray-200">/invoices</code>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Create a new invoice</p>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">GET</span>
                                    <code className="text-sm text-gray-800 dark:text-gray-200">/invoices/:id</code>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Get invoice details</p>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold rounded">PATCH</span>
                                    <code className="text-sm text-gray-800 dark:text-gray-200">/invoices/:id</code>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Update an invoice</p>
                            </div>

                            <div className="border-l-4 border-red-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded">DELETE</span>
                                    <code className="text-sm text-gray-800 dark:text-gray-200">/invoices/:id</code>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Delete an invoice</p>
                            </div>
                        </div>
                    </div>

                    {/* Clients */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Clients</h3>
                        <div className="space-y-4">
                            <div className="border-l-4 border-green-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">GET</span>
                                    <code className="text-sm text-gray-800 dark:text-gray-200">/clients</code>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">List all clients</p>
                            </div>

                            <div className="border-l-4 border-blue-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">POST</span>
                                    <code className="text-sm text-gray-800 dark:text-gray-200">/clients</code>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Create a new client</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Example Request */}
                <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-slate-700 mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Example Request</h2>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        {`curl -X POST https://api.facturify.com/v1/invoices \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientId": "client_123",
    "items": [
      {
        "description": "Web Design Service",
        "quantity": 1,
        "unitPrice": 1500
      }
    ],
    "dueDate": "2026-02-15"
  }'`}
                    </pre>
                </section>

                {/* Contact */}
                <section className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-8 mt-8 text-center border border-indigo-100 dark:border-indigo-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Need Help?</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Contact our support team for API access and integration assistance.
                    </p>
                    <a
                        href="mailto:api@facturify.com"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Contact API Support
                    </a>
                </section>
            </div>
        </div>
    );
}
