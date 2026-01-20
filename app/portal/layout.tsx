export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Simple Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            F
                        </div>
                        <span className="text-xl font-bold text-slate-900">Facturify</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        Client Portal
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-slate-200 bg-white mt-auto">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Facturify. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
