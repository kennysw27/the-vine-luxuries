/**
 * Export utilities for CSV, Excel, and PDF.
 */

/**
 * Format a date string for display.
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Export data as CSV and trigger download.
 */
export function exportToCSV(data, filename = "vine_luxuries_log") {
  const headers = [
    "Date & Time",
    "Unit Number",
    "Visitor/Vendor Name",
    "Type of Visit",
    "Concierge Name",
    "Comments/Notes",
  ];

  const rows = data.map((entry) => [
    formatDateTime(entry.dateTime),
    entry.unitNumber || "",
    entry.visitorName || "",
    entry.visitType || "",
    entry.conciergeName || "",
    `"${(entry.comments || "").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export data as Excel (.xlsx).
 */
export async function exportToExcel(data, filename = "vine_luxuries_log") {
  const XLSX = (await import("xlsx")).default;

  const wsData = [
    [
      "Date & Time",
      "Unit Number",
      "Visitor/Vendor Name",
      "Type of Visit",
      "Concierge Name",
      "Comments/Notes",
    ],
    ...data.map((entry) => [
      formatDateTime(entry.dateTime),
      entry.unitNumber || "",
      entry.visitorName || "",
      entry.visitType || "",
      entry.conciergeName || "",
      entry.comments || "",
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws["!cols"] = [
    { wch: 22 },
    { wch: 12 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 35 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Log History");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Export data as PDF.
 */
export async function exportToPDF(data, filename = "vine_luxuries_log") {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape" });

  // Header
  doc.setFontSize(18);
  doc.setTextColor(12, 14, 26);
  doc.text("The Vine Luxuries", 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text("Visitor & Vendor Log History", 14, 28);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);

  // Table
  autoTable(doc, {
    startY: 42,
    head: [
      [
        "Date & Time",
        "Unit #",
        "Visitor/Vendor",
        "Type",
        "Concierge",
        "Notes",
      ],
    ],
    body: data.map((entry) => [
      formatDateTime(entry.dateTime),
      entry.unitNumber || "",
      entry.visitorName || "",
      entry.visitType || "",
      entry.conciergeName || "",
      entry.comments || "",
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [12, 14, 26],
      textColor: [212, 175, 55],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 240, 232],
    },
    margin: { top: 42 },
  });

  doc.save(`${filename}.pdf`);
}

/**
 * Helper to trigger file download from Blob.
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
