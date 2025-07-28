import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// util to Title Case station names
const toTitle = (str: string) => str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
import { format, parseISO } from "date-fns";

// Minimal booking and passenger type definitions for PDF generator
interface Passenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
  bookingStatus: string;
}

interface Booking {
  pnr: string | number;
  trainName: string;
  journeyDate: string; // ISO or display date
  fromStation: string;
  toStation: string;
  passengers: Passenger[];
  totalFare: number;
}

/**
 * Generates and triggers download of an IRCTC-style e-ticket PDF for a booking.
 */
export function downloadTicketPdf(booking: Booking) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  // Brand banner
  doc.setFillColor(37, 99, 235); // primary blue
  doc.rect(0, 0, pageWidth, 20, "F");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("INDIAN RAILWAYS", pageWidth / 2, 12, { align: "center" });

  // sub-title below banner
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");
  doc.text("E-Ticket / Passenger Reservation Slip", pageWidth / 2, 28, { align: "center" });

  // PNR & Journey box
  const boxY = 35;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.rect(12, boxY, pageWidth - 24, 30);

  doc.setFontSize(11);
  // left column
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("PNR No:", 16, boxY + 8);
  doc.text("Train:", 16, boxY + 16);
  doc.text("Date:", 16, boxY + 24);
  doc.setFont("helvetica", "bold");
  doc.text(String(booking.pnr), 45, boxY + 8);
  doc.setFont("helvetica", "normal");

  doc.text(booking.trainName, 45, boxY + 16);
  const journeyDate = format(parseISO(booking.journeyDate), "PPP");
  doc.text(journeyDate, 45, boxY + 24);

  // right column
  doc.setFont("helvetica", "bold");
  doc.text("Route:", 110, boxY + 8);
  doc.text("Total Fare:", 110, boxY + 16);
  doc.setFont("helvetica", "normal");
  const routeStr = `${toTitle(booking.fromStation)} -- ${toTitle(booking.toStation)}`;
  doc.text(routeStr, 140, boxY + 8, { maxWidth: pageWidth - 150 });
  const fareFormatted = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(booking.totalFare);
  doc.setFont("courier", "bold");
  doc.text(`INR ${booking.totalFare}`, 140, boxY + 16);
  doc.setFont("helvetica", "normal");

  // ---------------- Passenger details table with jspdf-autotable ----------------
  let currentY = 80;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Passenger Details", 14, currentY);
  doc.setFont("helvetica", "normal");
  currentY += 6; // spacing before table

  // Build data array for autoTable
  const tableBody = booking.passengers.map((p, idx) => [
    idx + 1,
    p.name,
    p.age,
    p.gender.charAt(0).toUpperCase() + p.gender.slice(1),
    p.seatNumber,
    p.bookingStatus,
  ]);

  autoTable(doc, {
    startY: currentY + 2,
    head: [["S.No", "Name", "Age", "Gender", "Seat", "Status"]],
    body: tableBody,
    margin: { left: 14, right: 14 },
    styles: { font: "helvetica", fontSize: 10, halign: "center", cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    bodyStyles: { textColor: 40, halign: "center" },
    columnStyles: {
      0: { halign: "center", cellWidth: 14 },
      1: { halign: "left", cellWidth: 60 },
      2: { cellWidth: 18 },
      3: { cellWidth: 24 },
      4: { cellWidth: 24 },
      5: { cellWidth: 34 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "This e-ticket is valid only with an ID proof. Please carry a government-issued ID during travel.",
    14,
    285
  );

  // watermark
  doc.setFontSize(50);
  doc.setTextColor(230, 230, 230);
  doc.text("IRCTC", pageWidth / 2, 180, { align: "center", angle: 45 });

  doc.save(`Ticket_${booking.pnr}.pdf`);
}
