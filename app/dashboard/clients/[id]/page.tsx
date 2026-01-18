import ClientDetailContent from './ClientDetailContent';

// Required for static export - pre-render pages for demo client IDs
export function generateStaticParams() {
    return [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
    ];
}

export default function ClientDetailPage() {
    return <ClientDetailContent />;
}
