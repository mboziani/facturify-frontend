import EditInvoiceContent from './EditInvoiceContent';

// Required for static export
export function generateStaticParams() {
    const params = [];
    // Add numeric IDs
    for (let i = 1; i <= 20; i++) {
        params.push({ id: i.toString() });
    }
    // Add invoice-X style IDs
    for (let i = 1; i <= 20; i++) {
        params.push({ id: `invoice-${i}` });
    }
    return params;
}

export default function EditInvoicePage() {
    return <EditInvoiceContent />;
}
