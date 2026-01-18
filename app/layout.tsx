import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { CompanyProvider } from '@/contexts/CompanyContext'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
    title: 'Facturify - All-in-One Business Management',
    description: 'From invoice to profit — everything your small business needs, in one place.',
    keywords: ['invoicing', 'expense tracking', 'time tracking', 'business management', 'freelancer tools'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CompanyProvider>
                        {children}
                        <Toaster position="top-right" />
                    </CompanyProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
