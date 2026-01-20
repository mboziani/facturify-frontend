import jsPDF from 'jspdf';
import type { Quote } from '@/types/quote';

export const generateQuotePDF = (quote: Quote, companyName: string = 'Your Company') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Company Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 20, yPos);
    yPos += 10;

    // Quote Title
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('QUOTE', pageWidth - 20, 20, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(quote.quoteNumber, pageWidth - 20, 28, { align: 'right' });

    yPos += 5;

    // Status Badge
    const statusColors: Record<string, [number, number, number]> = {
        DRAFT: [156, 163, 175],
        SENT: [59, 130, 246],
        VIEWED: [168, 85, 247],
        ACCEPTED: [34, 197, 94],
        REJECTED: [239, 68, 68],
        EXPIRED: [249, 115, 22],
        CONVERTED: [99, 102, 241],
    };

    const statusColor = statusColors[quote.status] || [156, 163, 175];
    doc.setFillColor(...statusColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    const statusText = quote.status;
    const statusWidth = doc.getTextWidth(statusText) + 8;
    doc.roundedRect(pageWidth - 20 - statusWidth, 32, statusWidth, 6, 2, 2, 'F');
    doc.text(statusText, pageWidth - 20 - statusWidth / 2, 36, { align: 'center' });

    yPos += 5;
    doc.setTextColor(0, 0, 0);

    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 15;

    // Client Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(quote.client?.name || 'N/A', 20, yPos);
    yPos += 5;

    if (quote.client?.email) {
        doc.text(quote.client.email, 20, yPos);
        yPos += 5;
    }

    if (quote.client?.phone) {
        doc.text(quote.client.phone, 20, yPos);
        yPos += 5;
    }

    if (quote.client?.addressLine1) {
        doc.text(quote.client.addressLine1, 20, yPos);
        yPos += 5;
        if (quote.client?.city) {
            doc.text(`${quote.client.city}, ${quote.client.country || ''}`, 20, yPos);
            yPos += 5;
        }
    }

    // Quote Details (Right side)
    const detailsX = pageWidth - 80;
    let detailsY = 55;

    doc.setFont('helvetica', 'bold');
    doc.text('Issue Date:', detailsX, detailsY);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(quote.issueDate), detailsX + 30, detailsY);
    detailsY += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Valid Until:', detailsX, detailsY);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(quote.validUntil), detailsX + 30, detailsY);

    yPos = Math.max(yPos, detailsY) + 15;

    // Line Items Table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Items', 20, yPos);
    yPos += 7;

    // Table Header
    doc.setFillColor(249, 250, 251);
    doc.rect(20, yPos, pageWidth - 40, 8, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Description', 22, yPos + 5);
    doc.text('Qty', pageWidth - 80, yPos + 5, { align: 'right' });
    doc.text('Price', pageWidth - 55, yPos + 5, { align: 'right' });
    doc.text('Amount', pageWidth - 22, yPos + 5, { align: 'right' });
    yPos += 10;

    // Table Rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);

    quote.items.forEach((item, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        }

        const description = item.description.length > 50
            ? item.description.substring(0, 47) + '...'
            : item.description;

        doc.text(description, 22, yPos);
        doc.text(item.quantity.toString(), pageWidth - 80, yPos, { align: 'right' });
        doc.text(formatCurrency(item.unitPrice), pageWidth - 55, yPos, { align: 'right' });
        doc.text(formatCurrency(item.amount), pageWidth - 22, yPos, { align: 'right' });

        yPos += 6;

        // Draw separator line
        if (index < quote.items.length - 1) {
            doc.setDrawColor(240, 240, 240);
            doc.line(20, yPos, pageWidth - 20, yPos);
            yPos += 4;
        }
    });

    yPos += 10;

    // Totals Section
    const totalsX = pageWidth - 70;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    doc.text('Subtotal:', totalsX, yPos);
    doc.text(formatCurrency(quote.subtotal), pageWidth - 22, yPos, { align: 'right' });
    yPos += 6;

    if (quote.taxRate > 0) {
        doc.text(`Tax (${quote.taxRate}%):`, totalsX, yPos);
        doc.text(formatCurrency(quote.taxAmount), pageWidth - 22, yPos, { align: 'right' });
        yPos += 6;
    }

    if (quote.discount > 0) {
        doc.text('Discount:', totalsX, yPos);
        doc.text(`-${formatCurrency(quote.discount)}`, pageWidth - 22, yPos, { align: 'right' });
        yPos += 6;
    }

    // Total line
    doc.setDrawColor(200, 200, 200);
    doc.line(totalsX, yPos, pageWidth - 20, yPos);
    yPos += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', totalsX, yPos);
    doc.text(formatCurrency(quote.total), pageWidth - 22, yPos, { align: 'right' });
    yPos += 15;

    // Notes
    if (quote.notes) {
        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Notes:', 20, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const splitNotes = doc.splitTextToSize(quote.notes, pageWidth - 40);
        doc.text(splitNotes, 20, yPos);
        yPos += splitNotes.length * 5;
    }

    // Terms
    if (quote.terms) {
        yPos += 5;

        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Terms & Conditions:', 20, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const splitTerms = doc.splitTextToSize(quote.terms, pageWidth - 40);
        doc.text(splitTerms, 20, yPos);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
    );

    // Save the PDF
    doc.save(`quote-${quote.quoteNumber}.pdf`);
};
