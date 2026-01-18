import jsPDF from 'jspdf';
import { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from './invoiceUtils';

export const generateInvoicePDF = async (invoice: Invoice): Promise<void> => {
    try {
        // Create a new jsPDF instance
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPos = margin;

        // Colors
        const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo-600
        const textColor: [number, number, number] = [15, 23, 42]; // Slate-900
        const grayColor: [number, number, number] = [100, 116, 139]; // Slate-500

        // Header - Company Name
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...primaryColor);
        pdf.text('INVOICE', margin, yPos);
        yPos += 10;

        // Invoice Number
        pdf.setFontSize(12);
        pdf.setTextColor(...grayColor);
        pdf.text(invoice.invoiceNumber, margin, yPos);
        yPos += 15;

        // Dates Section (Right aligned)
        const dateX = pageWidth - margin;
        pdf.setFontSize(10);
        pdf.setTextColor(...grayColor);
        pdf.text('Issue Date:', dateX - 60, yPos - 15, { align: 'left' });
        pdf.setTextColor(...textColor);
        pdf.text(formatDate(invoice.issueDate), dateX, yPos - 15, { align: 'right' });

        pdf.setTextColor(...grayColor);
        pdf.text('Due Date:', dateX - 60, yPos - 10, { align: 'left' });
        pdf.setTextColor(...textColor);
        pdf.text(formatDate(invoice.dueDate), dateX, yPos - 10, { align: 'right' });

        // Client Information
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...grayColor);
        pdf.text('BILLED TO', margin, yPos);
        yPos += 5;

        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...textColor);
        pdf.text(invoice.client?.name || 'N/A', margin, yPos);
        yPos += 5;

        if (invoice.client?.email) {
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...grayColor);
            pdf.text(invoice.client.email, margin, yPos);
            yPos += 5;
        }

        if (invoice.client?.phone) {
            pdf.text(invoice.client.phone, margin, yPos);
            yPos += 5;
        }

        if (invoice.client?.addressLine1) {
            pdf.text(invoice.client.addressLine1, margin, yPos);
            yPos += 5;
            if (invoice.client.city && invoice.client.country) {
                pdf.text(`${invoice.client.city}, ${invoice.client.country}`, margin, yPos);
                yPos += 5;
            }
        }

        yPos += 10;

        // Line Items Table
        // Table Header
        const tableStartY = yPos;
        const col1X = margin;
        const col2X = pageWidth - 80;
        const col3X = pageWidth - 50;
        const col4X = pageWidth - margin;

        pdf.setFillColor(...primaryColor);
        pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(255, 255, 255);
        pdf.text('DESCRIPTION', col1X, yPos);
        pdf.text('QTY', col2X, yPos, { align: 'right' });
        pdf.text('PRICE', col3X, yPos, { align: 'right' });
        pdf.text('AMOUNT', col4X, yPos, { align: 'right' });
        yPos += 10;

        // Table Body
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...textColor);
        pdf.setFontSize(9);

        invoice.items.forEach((item, index) => {
            // Check if we need a new page
            if (yPos > pageHeight - 50) {
                pdf.addPage();
                yPos = margin;
            }

            pdf.text(item.description, col1X, yPos);
            pdf.text(item.quantity.toString(), col2X, yPos, { align: 'right' });
            pdf.text(formatCurrency(item.unitPrice), col3X, yPos, { align: 'right' });
            pdf.setFont('helvetica', 'bold');
            pdf.text(formatCurrency(item.amount), col4X, yPos, { align: 'right' });
            pdf.setFont('helvetica', 'normal');

            yPos += 7;

            // Add separator line
            if (index < invoice.items.length - 1) {
                pdf.setDrawColor(226, 232, 240); // Slate-200
                pdf.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
            }
        });

        yPos += 5;

        // Totals Section
        const totalsX = pageWidth - margin;
        const labelX = totalsX - 60;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...grayColor);

        // Subtotal
        pdf.text('Subtotal:', labelX, yPos, { align: 'left' });
        pdf.setTextColor(...textColor);
        pdf.text(formatCurrency(invoice.subtotal), totalsX, yPos, { align: 'right' });
        yPos += 6;

        // Tax
        if (invoice.taxRate > 0) {
            pdf.setTextColor(...grayColor);
            pdf.text(`Tax (${invoice.taxRate}%):`, labelX, yPos, { align: 'left' });
            pdf.setTextColor(...textColor);
            pdf.text(formatCurrency(invoice.taxAmount), totalsX, yPos, { align: 'right' });
            yPos += 6;
        }

        // Discount
        if (invoice.discount > 0) {
            pdf.setTextColor(...grayColor);
            pdf.text('Discount:', labelX, yPos, { align: 'left' });
            pdf.setTextColor(...textColor);
            pdf.text(`-${formatCurrency(invoice.discount)}`, totalsX, yPos, { align: 'right' });
            yPos += 6;
        }

        // Separator line
        pdf.setDrawColor(...primaryColor);
        pdf.setLineWidth(0.5);
        pdf.line(labelX, yPos, totalsX, yPos);
        yPos += 6;

        // Total
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(...textColor);
        pdf.text('TOTAL', labelX, yPos, { align: 'left' });
        pdf.setTextColor(...primaryColor);
        pdf.text(formatCurrency(invoice.total), totalsX, yPos, { align: 'right' });
        yPos += 10;

        // Amount Paid and Due (if applicable)
        if (invoice.amountPaid > 0) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.setTextColor(...grayColor);
            pdf.text('Amount Paid:', labelX, yPos, { align: 'left' });
            pdf.setTextColor(...textColor);
            pdf.text(formatCurrency(invoice.amountPaid), totalsX, yPos, { align: 'right' });
            yPos += 6;

            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...grayColor);
            pdf.text('Amount Due:', labelX, yPos, { align: 'left' });
            pdf.setTextColor(220, 38, 38); // Red-600
            pdf.text(formatCurrency(invoice.amountDue), totalsX, yPos, { align: 'right' });
        }

        // Notes and Terms
        if (invoice.notes || invoice.terms) {
            yPos = pageHeight - 50;

            if (invoice.notes) {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(9);
                pdf.setTextColor(...grayColor);
                pdf.text('NOTES', margin, yPos);
                yPos += 5;

                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(...textColor);
                const notesLines = pdf.splitTextToSize(invoice.notes, pageWidth - 2 * margin);
                pdf.text(notesLines, margin, yPos);
                yPos += notesLines.length * 4;
            }

            if (invoice.terms) {
                yPos += 5;
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(9);
                pdf.setTextColor(...grayColor);
                pdf.text('PAYMENT TERMS', margin, yPos);
                yPos += 5;

                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(...textColor);
                const termsLines = pdf.splitTextToSize(invoice.terms, pageWidth - 2 * margin);
                pdf.text(termsLines, margin, yPos);
            }
        }

        // Footer
        if (invoice.footer) {
            pdf.setFontSize(8);
            pdf.setTextColor(...grayColor);
            pdf.text(invoice.footer, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        // Save the PDF
        pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
