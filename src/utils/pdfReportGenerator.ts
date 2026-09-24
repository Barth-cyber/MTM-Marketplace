import { jsPDF } from 'jspdf';
import { PurchaseOrder } from '../types';

export function generatePurchaseOrderPdf(po: PurchaseOrder) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Palette
  const darkNavy = [26, 3, 6]; // #1A0306 Horse Blood Obsidian
  const primaryBlue = [122, 12, 20]; // #7A0C14 Horse Blood Dark Shiny Red
  const emeraldGreen = [5, 150, 105]; // #059669
  const amberOrange = [217, 119, 6]; // #D97706
  const slate600 = [71, 85, 105];
  const slate400 = [148, 163, 184];
  const bgLight = [248, 250, 252];
  const borderGrey = [226, 232, 240];

  // 1. Header Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 36, 'F');

  // MTM Logo Icon & Text
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.roundedRect(14, 8, 12, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('M', 17.5, 17);

  doc.setFontSize(16);
  doc.text('MTM INDUSTRIAL MARKETPLACE', 30, 15);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text('COMMERCIAL PROCUREMENT & ESCROW SERVICES • RC 1498224', 30, 22);

  // PO Badge on top right
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.roundedRect(132, 7, 64, 22, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('PURCHASE ORDER', 164, 14, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`PO #: ${po.poNumber}`, 164, 20, { align: 'center' });
  doc.text(`DATE: ${po.createdAt}`, 164, 25, { align: 'center' });

  // Accent Line
  doc.setFillColor(amberOrange[0], amberOrange[1], amberOrange[2]);
  doc.rect(0, 36, 210, 2, 'F');

  let yPos = 44;

  // 2. Buyer & Vendor Requisition Grid
  // Vendor Info Box (Left)
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(14, yPos, 88, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('MARKETPLACE & ESCROW VENDOR:', 18, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('MTM - Marketplace', 18, yPos + 12);
  doc.text('Corporate Reg: RC 1498224 • NITDA Certified', 18, yPos + 17);
  doc.text('Hub: Plot 18, Ikeja Industrial Estate, Lagos', 18, yPos + 22);
  doc.text('Escrow Desk: escrow@mtm-marketplace.com', 18, yPos + 27);
  doc.text('Support & Verification: +234 (01) 888-4321', 18, yPos + 32);

  // Buyer Info Box (Right)
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(108, yPos, 88, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('BUYER / ISSUING ENTERPRISE:', 112, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(`Company: ${po.buyerCompany || 'Enterprise Buyer'}`, 112, yPos + 12);
  doc.text(`Contact: ${po.buyerContactName || 'Procurement Officer'} (${po.buyerTitle || 'Procurement Lead'})`, 112, yPos + 17);
  doc.text(`Email: ${po.buyerEmail || 'procurement@company.ng'}`, 112, yPos + 22);
  doc.text(`Phone: ${po.buyerPhone || '+234 800 000 0000'}`, 112, yPos + 27);
  doc.text(`TIN/RC: ${po.buyerTIN || 'TIN-48920194-001'}`, 112, yPos + 32);

  yPos += 42;

  // 3. Logistics & Payment Terms Summary Bar
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(14, yPos, 182, 16, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('DESTINATION HUB & FACILITY:', 18, yPos + 6);
  doc.text('PAYMENT ROUTE & TERMS:', 108, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(`${po.deliveryHub || 'Lagos Hub'} • ${po.deliveryAddress || 'Customer Facility Address, Nigeria'}`.slice(0, 52), 18, yPos + 11);
  doc.text(`${po.paymentTerms || 'MTM Guaranteed Escrow (48h Acceptance Release)'}`.slice(0, 50), 108, yPos + 11);

  yPos += 20;

  // 4. Itemized Equipment Table
  // Table Header
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(14, yPos, 182, 7.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);

  doc.text('#', 17, yPos + 5);
  doc.text('ITEM DESCRIPTION & SPECS', 24, yPos + 5);
  doc.text('CONDITION', 98, yPos + 5);
  doc.text('QTY', 122, yPos + 5, { align: 'center' });
  doc.text('UNIT PRICE (NGN)', 146, yPos + 5, { align: 'right' });
  doc.text('TOTAL (NGN)', 192, yPos + 5, { align: 'right' });

  yPos += 7.5;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);

  po.items.forEach((item, index) => {
    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    
    const rowHeight = 11;
    doc.rect(14, yPos, 182, rowHeight, 'F');
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.rect(14, yPos, 182, rowHeight, 'S');

    // Index
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(`${index + 1}`, 17, yPos + 5);

    // Title & Brand
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(`${item.title}`.slice(0, 44), 24, yPos + 4.5);
    doc.setFontSize(6.5);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(`Brand: ${item.brand || 'Industrial'} | Category: ${item.category} | Seller: ${item.sellerName || 'Verified'}`, 24, yPos + 8.5);

    // Condition
    doc.setFontSize(7.5);
    doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.text(`${item.condition || 'Tested Working'}`.slice(0, 16), 98, yPos + 6);

    // Qty
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(`${item.quantity}`, 122, yPos + 6, { align: 'center' });

    // Unit Price
    doc.text(`₦${item.unitPriceNGN.toLocaleString()}`, 146, yPos + 6, { align: 'right' });

    // Total Line
    doc.setFont('helvetica', 'bold');
    doc.text(`₦${(item.unitPriceNGN * item.quantity).toLocaleString()}`, 192, yPos + 6, { align: 'right' });

    yPos += rowHeight;
  });

  yPos += 3;

  // 5. Financial Summary Box (Right Aligned)
  const summaryY = yPos;
  const summaryBoxWidth = 88;
  const summaryBoxX = 108;

  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(summaryBoxX, summaryY, summaryBoxWidth, 42, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.setFont('helvetica', 'normal');

  doc.text('Equipment Subtotal:', summaryBoxX + 4, summaryY + 7);
  doc.text(`₦${po.subtotalNGN.toLocaleString()}`, 192, summaryY + 7, { align: 'right' });

  doc.text('42-Point On-Site Inspections:', summaryBoxX + 4, summaryY + 13);
  doc.text(`+₦${po.totalInspectionNGN.toLocaleString()}`, 192, summaryY + 13, { align: 'right' });

  doc.text('Flatbed Heavy Freight Rigging:', summaryBoxX + 4, summaryY + 19);
  doc.text(`+₦${po.totalFreightNGN.toLocaleString()}`, 192, summaryY + 19, { align: 'right' });

  doc.text('Statutory VAT / Duties (7.5%):', summaryBoxX + 4, summaryY + 25);
  doc.text(`₦${po.vatTaxNGN.toLocaleString()}`, 192, summaryY + 25, { align: 'right' });

  // Divider
  doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.line(summaryBoxX + 4, summaryY + 28, 192, summaryY + 28);

  // Grand Total Highlight
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('GRAND TOTAL (ESCROW):', summaryBoxX + 4, summaryY + 34);
  doc.text(`₦${po.grandTotalNGN.toLocaleString()}`, 192, summaryY + 34, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text(`(~ $${po.grandTotalUSD.toLocaleString()} USD Equivalent)`, 192, summaryY + 39, { align: 'right' });

  // 6. Notes & Escrow Protection Protocol (Left Aligned opposite to Summary)
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(14, summaryY, 88, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('MTM ESCROW SETTLEMENT PROTOCOL:', 18, summaryY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('1. Buyer funds locked in secured Escrow vault upon PO execution.', 18, summaryY + 12);
  doc.text('2. Pre-dispatch diagnostic verification issued by MTM Certified Engineer.', 18, summaryY + 17);
  doc.text('3. Lowbed flatbed haulage with live GPS milestone tracking.', 18, summaryY + 22);
  doc.text('4. 48-Hour on-site factory acceptance trial window guaranteed.', 18, summaryY + 27);
  doc.text('5. Payout disbursed to seller only after written buyer acceptance sign-off.', 18, summaryY + 32);
  doc.text(`PO Validity: 30 days from issue (${po.validUntil || '30 Days'})`, 18, summaryY + 38);

  yPos += 48;

  // 7. Executive Procurement Sign-off Matrix
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(14, yPos, 182, 5.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CORPORATE PROCUREMENT APPROVAL & AUTHORIZATION SIGN-OFF', 18, yPos + 4);

  yPos += 5.5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(14, yPos, 182, 26, 'FD');

  // Signatures 3 Columns
  doc.setDrawColor(203, 213, 225);
  
  // Col 1: Prepared By
  doc.line(18, yPos + 16, 68, yPos + 16);
  doc.setFontSize(7);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared By: Requisition Officer', 18, yPos + 19);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${po.buyerContactName || 'Procurement Officer'}`, 18, yPos + 22);
  doc.text(`Date: ${po.createdAt}`, 18, yPos + 25);

  // Col 2: Plant/Engineering Approval
  doc.line(74, yPos + 16, 124, yPos + 16);
  doc.setFont('helvetica', 'bold');
  doc.text('Reviewed By: Head of Plant Operations', 74, yPos + 19);
  doc.setFont('helvetica', 'normal');
  doc.text('Signature: __________________________', 74, yPos + 22);
  doc.text('Date: __________________________', 74, yPos + 25);

  // Col 3: Finance / CFO Authorization
  doc.line(130, yPos + 16, 190, yPos + 16);
  doc.setFont('helvetica', 'bold');
  doc.text('Authorized By: CFO / Managing Director', 130, yPos + 19);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${po.approverName || 'Executive Signatory'}`, 130, yPos + 22);
  doc.text('Corporate Stamp: [   SEALED   ]', 130, yPos + 25);

  // 8. Footer Bar
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 287, 210, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('MTM Industrial Machinery Marketplace • Corporate Procurement Desk • Escrow Reference: ' + po.poNumber, 105, 293, { align: 'center' });

  // Save File
  const sanitizedPoNumber = po.poNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
  const fileName = `MTM_Purchase_Order_${sanitizedPoNumber}.pdf`;
  doc.save(fileName);
}
