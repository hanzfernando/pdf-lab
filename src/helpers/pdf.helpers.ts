import { PDFDocument } from "pdf-lib";
import { PdfFile } from "@/types/pdf.types";

/**
 * Reads a File object into an ArrayBuffer and returns the page count.
 * Uses pdf-lib so we don't need a separate parse step.
 *
 * @throws if the file is not a valid PDF
 */
export async function parsePdfFile(
  file: File
): Promise<{ arrayBuffer: ArrayBuffer; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuffer, {
    // Don't throw on encrypted PDFs without passwords – surface count info
    ignoreEncryption: true,
  });
  return { arrayBuffer, pageCount: doc.getPageCount() };
}

/**
 * Merges an ordered list of PdfFile objects into a single PDF blob.
 *
 * Each PdfFile carries:
 *  - `arrayBuffer`  – the raw source PDF bytes
 *  - `pages`        – the ordered, possibly-filtered list of page slots
 *
 * Only pages still present in `pages` (user may have removed some) are
 * copied, in the order they currently appear.
 *
 * @returns a Blob that can be downloaded or opened in the browser
 */
export async function mergePdfs(pdfFiles: PdfFile[]): Promise<Blob> {
  const merged = await PDFDocument.create();

  for (const pdfFile of pdfFiles) {
    const source = await PDFDocument.load(pdfFile.arrayBuffer, {
      ignoreEncryption: true,
    });

    // Build a list of 0-based indices in the order the user arranged them
    const pageIndices = pdfFile.pages.map((p) => p.originalIndex);

    if (pageIndices.length === 0) continue;

    const copied = await merged.copyPages(source, pageIndices);
    copied.forEach((page) => merged.addPage(page));
  }

  const mergedBytes = await merged.save();
  // Cast to ArrayBuffer to satisfy the Blob constructor's strict typing
  return new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/**
 * Triggers a file-save dialog in the browser for the given Blob.
 *
 * @param blob     - the PDF Blob to download
 * @param filename - suggested download name (defaults to "merged.pdf")
 */
export function downloadBlob(blob: Blob, filename = "merged.pdf"): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  // Revoke after a short delay to allow the download to start
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
