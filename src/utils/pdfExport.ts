import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
    formTitle: string;
    exportDate: Date;
    dateRange?: { start: string; end: string };

    // Content toggles
    includeCharts: boolean;
    includeResponses: boolean;
    includeInsights: boolean;
    includeMetadata: boolean;

    // Data
    selectedFields: { id: string; label: string }[];
    responses: Array<{
        submittedAt: string;
        email: string | null;
        answers: Record<string, any>;
    }>;

    // Stats
    stats: {
        total: number;
        verified: number;
        anonymous: number;
        avgPerDay?: number;
    };

    // Insights
    insights?: string[];

    // Chart images (base64)
    chartImages?: {
        lineChart?: string;
        barChart?: string;
        pieChart?: string;
    };
}

const COLORS = {
    primary: [139, 92, 246] as [number, number, number], // Violet
    primaryLight: [167, 139, 250] as [number, number, number], // Violet-400
    secondary: [100, 116, 139] as [number, number, number], // Slate
    accent: [16, 185, 129] as [number, number, number], // Emerald
    text: [30, 41, 59] as [number, number, number], // Slate-800
    textLight: [71, 85, 105] as [number, number, number], // Slate-600
    muted: [148, 163, 184] as [number, number, number], // Slate-400
    white: [255, 255, 255] as [number, number, number],
    background: [248, 250, 252] as [number, number, number], // Slate-50
    border: [226, 232, 240] as [number, number, number], // Slate-200
};

/**
 * Add watermark to a PDF page
 */
function addWatermark(doc: jsPDF, pageWidth: number, pageHeight: number) {
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.setFont('helvetica', 'italic');

    const watermarkText = 'Powered by Forma';
    const textWidth = doc.getTextWidth(watermarkText);
    doc.text(watermarkText, pageWidth - textWidth - 12, pageHeight - 8);

    // Reset text color
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
}

/**
 * Add page header
 */
function addPageHeader(doc: jsPDF, formTitle: string, pageNumber: number, totalPages: number) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header background
    doc.setFillColor(...COLORS.background);
    doc.rect(0, 0, pageWidth, 15, 'F');

    // Header line
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(0, 15, pageWidth, 15);

    // Form title (left)
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textLight);
    doc.setFont('helvetica', 'normal');
    doc.text(formTitle, 15, 10);

    // Page number (right)
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 30, 10);
}

/**
 * Draw a section title with underline
 */
function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text(title, 15, y);

    // Underline
    const textWidth = doc.getTextWidth(title);
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.8);
    doc.line(15, y + 2, 15 + textWidth, y + 2);

    return y + 12;
}

/**
 * Capture a DOM element as an image using html2canvas
 */
export async function captureChartAsImage(elementId: string): Promise<string | null> {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`[PDF Export] Element with id "${elementId}" not found`);
        return null;
    }

    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            logging: false,
            useCORS: true,
        });
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('[PDF Export] Failed to capture chart:', error);
        return null;
    }
}

/**
 * Capture all charts from the dashboard
 */
export async function captureAllCharts(): Promise<{
    lineChart?: string;
    barChart?: string;
    pieChart?: string;
}> {
    const results: { lineChart?: string; barChart?: string; pieChart?: string } = {};

    console.log('[PDF Export] Capturing charts...');

    // Try to capture each chart by their IDs
    const lineChart = await captureChartAsImage('chart-responses-line');
    if (lineChart) {
        results.lineChart = lineChart;
        console.log('[PDF Export] Line chart captured');
    }

    const barChart = await captureChartAsImage('chart-distribution-bar');
    if (barChart) {
        results.barChart = barChart;
        console.log('[PDF Export] Bar chart captured');
    }

    const pieChart = await captureChartAsImage('chart-type-breakdown');
    if (pieChart) {
        results.pieChart = pieChart;
        console.log('[PDF Export] Pie chart captured');
    }

    console.log('[PDF Export] Charts captured:', Object.keys(results).length);
    return results;
}

/**
 * Generate enterprise PDF report
 */
export async function generatePDFReport(options: PDFExportOptions): Promise<Blob> {
    const {
        formTitle,
        exportDate,
        dateRange,
        includeCharts,
        includeResponses,
        includeInsights,
        includeMetadata,
        selectedFields,
        responses,
        stats,
        insights = [],
        chartImages = {},
    } = options;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    let currentY = 20;

    // ===========================================
    // PAGE 1: COVER / HEADER
    // ===========================================

    // Gradient header (simulated with rectangles)
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setFillColor(...COLORS.primaryLight);
    doc.rect(0, 45, pageWidth, 8, 'F');

    // Title
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Analytics Report', margin, 28);

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formTitle, margin, 40);

    currentY = 65;

    // Metadata section
    if (includeMetadata) {
        doc.setTextColor(...COLORS.textLight);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Left column
        doc.text('Export Date:', margin, currentY);
        doc.setTextColor(...COLORS.text);
        doc.text(exportDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        }), margin + 30, currentY);

        currentY += 6;

        if (dateRange) {
            doc.setTextColor(...COLORS.textLight);
            doc.text('Data Range:', margin, currentY);
            doc.setTextColor(...COLORS.text);
            doc.text(`${dateRange.start} to ${dateRange.end}`, margin + 30, currentY);
            currentY += 6;
        }

        currentY += 8;
    }

    // =========================================
    // SUMMARY STATISTICS SECTION
    // =========================================
    currentY = drawSectionTitle(doc, 'Summary Statistics', currentY);

    // Stats cards with borders
    const cardWidth = (pageWidth - margin * 2 - 10) / 3;
    const cardHeight = 30;

    // Card 1: Total Responses
    doc.setFillColor(...COLORS.background);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, cardWidth, cardHeight, 3, 3, 'FD');

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text(String(stats.total), margin + 8, currentY + 14);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Responses', margin + 8, currentY + 22);

    // Card 2: Verified
    const card2X = margin + cardWidth + 5;
    doc.setFillColor(...COLORS.background);
    doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 3, 3, 'FD');

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.accent);
    doc.text(String(stats.verified), card2X + 8, currentY + 14);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.text('Verified Emails', card2X + 8, currentY + 22);

    // Card 3: Anonymous
    const card3X = margin + (cardWidth + 5) * 2;
    doc.setFillColor(...COLORS.background);
    doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 3, 3, 'FD');

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.secondary);
    doc.text(String(stats.anonymous), card3X + 8, currentY + 14);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.text('Anonymous', card3X + 8, currentY + 22);

    currentY += cardHeight + 15;

    // ===========================================
    // CHARTS SECTION
    // ===========================================
    if (includeCharts) {
        const hasCharts = chartImages.lineChart || chartImages.barChart || chartImages.pieChart;

        currentY = drawSectionTitle(doc, 'Response Analytics', currentY);

        if (hasCharts) {
            // Line chart (full width)
            if (chartImages.lineChart) {
                try {
                    const chartWidth = pageWidth - margin * 2;
                    const chartHeight = 55;

                    // Chart container with border
                    doc.setDrawColor(...COLORS.border);
                    doc.setLineWidth(0.3);
                    doc.roundedRect(margin, currentY, chartWidth, chartHeight, 2, 2, 'S');

                    doc.addImage(chartImages.lineChart, 'PNG', margin + 2, currentY + 2, chartWidth - 4, chartHeight - 4);
                    currentY += chartHeight + 8;
                } catch (e) {
                    console.warn('Failed to add line chart:', e);
                }
            }

            // Check if we need a new page
            if (currentY > pageHeight - 70) {
                doc.addPage();
                currentY = 25;
            }

            // Bar and Pie charts side by side
            const smallChartWidth = (pageWidth - margin * 2 - 8) / 2;
            const smallChartHeight = 45;

            if (chartImages.barChart) {
                try {
                    doc.setDrawColor(...COLORS.border);
                    doc.roundedRect(margin, currentY, smallChartWidth, smallChartHeight, 2, 2, 'S');
                    doc.addImage(chartImages.barChart, 'PNG', margin + 2, currentY + 2, smallChartWidth - 4, smallChartHeight - 4);
                } catch (e) {
                    console.warn('Failed to add bar chart:', e);
                }
            }

            if (chartImages.pieChart) {
                try {
                    const pieX = margin + smallChartWidth + 8;
                    doc.setDrawColor(...COLORS.border);
                    doc.roundedRect(pieX, currentY, smallChartWidth, smallChartHeight, 2, 2, 'S');
                    doc.addImage(chartImages.pieChart, 'PNG', pieX + 2, currentY + 2, smallChartWidth - 4, smallChartHeight - 4);
                } catch (e) {
                    console.warn('Failed to add pie chart:', e);
                }
            }

            currentY += smallChartHeight + 10;
        } else {
            // No charts placeholder
            doc.setFillColor(...COLORS.background);
            doc.roundedRect(margin, currentY, pageWidth - margin * 2, 25, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setTextColor(...COLORS.muted);
            doc.text('Charts not captured. Ensure charts are visible when exporting.', margin + 10, currentY + 15);
            currentY += 35;
        }
    }

    // ===========================================
    // RESPONSES TABLE
    // ===========================================
    if (includeResponses && responses.length > 0) {
        // New page for responses if needed
        if (currentY > pageHeight - 80) {
            doc.addPage();
            currentY = 25;
        }

        currentY = drawSectionTitle(doc, 'Response Data', currentY);

        // Summary line
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.muted);
        doc.text(`${responses.length} responses • ${selectedFields.length} fields selected`, margin, currentY);
        currentY += 8;

        // Build table headers - compact
        const headers = ['#', 'Date', 'Email', ...selectedFields.slice(0, 4).map(f => f.label.slice(0, 12))];

        // Build table data
        const tableData = responses.slice(0, 100).map((r, idx) => [
            String(idx + 1),
            new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            r.email ? r.email.slice(0, 20) : 'Anonymous',
            ...selectedFields.slice(0, 4).map(f => {
                const val = r.answers[f.id];
                if (val === null || val === undefined) return '-';
                if (typeof val === 'object') return JSON.stringify(val).slice(0, 20);
                return String(val).slice(0, 20);
            }),
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [headers],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontSize: 7,
                fontStyle: 'bold',
                cellPadding: 3,
            },
            bodyStyles: {
                fontSize: 7,
                textColor: COLORS.text,
                cellPadding: 2,
            },
            alternateRowStyles: {
                fillColor: COLORS.background,
            },
            columnStyles: {
                0: { cellWidth: 8, halign: 'center' },
                1: { cellWidth: 18 },
                2: { cellWidth: 35 },
            },
            styles: {
                overflow: 'ellipsize',
                lineWidth: 0.1,
                lineColor: COLORS.border,
            },
            margin: { left: margin, right: margin },
            didDrawPage: (data) => {
                addWatermark(doc, pageWidth, pageHeight);
                if (data.pageNumber > 1) {
                    addPageHeader(doc, formTitle, data.pageNumber, doc.getNumberOfPages());
                }
            },
        });

        // @ts-ignore - autoTable adds this property
        currentY = doc.lastAutoTable?.finalY || currentY + 50;
    }

    // ===========================================
    // INSIGHTS SECTION
    // ===========================================
    if (includeInsights && insights.length > 0) {
        // Check if we need a new page
        if (currentY > pageHeight - 60) {
            doc.addPage();
            currentY = 25;
        }

        currentY += 10;
        currentY = drawSectionTitle(doc, 'Key Insights', currentY);

        // Insights box
        doc.setFillColor(...COLORS.background);
        const insightBoxHeight = insights.length * 8 + 10;
        doc.roundedRect(margin, currentY, pageWidth - margin * 2, insightBoxHeight, 3, 3, 'F');

        currentY += 8;
        doc.setFontSize(9);

        insights.forEach((insight, idx) => {
            doc.setTextColor(...COLORS.primary);
            doc.setFont('helvetica', 'bold');
            doc.text(`${idx + 1}.`, margin + 5, currentY);
            doc.setTextColor(...COLORS.text);
            doc.setFont('helvetica', 'normal');
            doc.text(insight, margin + 12, currentY);
            currentY += 8;
        });
    }

    // ===========================================
    // ADD WATERMARKS TO ALL PAGES
    // ===========================================
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addWatermark(doc, pageWidth, pageHeight);
        if (i > 1) {
            addPageHeader(doc, formTitle, i, totalPages);
        }
    }

    // Return as blob
    return doc.output('blob');
}

/**
 * Download the generated PDF
 */
export function downloadPDF(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
