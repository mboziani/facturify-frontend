import QuoteDetailContent from './QuoteDetailContent';

// Required for static export
export function generateStaticParams() {
    const params = [];
    // Add numeric IDs
    for (let i = 1; i <= 20; i++) {
        params.push({ id: i.toString() });
    }
    // Add quote-X style IDs (common in mocks)
    for (let i = 1; i <= 20; i++) {
        params.push({ id: `quote-${i}` });
    }
    return params;
}

export default function QuoteDetailPage() {
    return <QuoteDetailContent />;
}
