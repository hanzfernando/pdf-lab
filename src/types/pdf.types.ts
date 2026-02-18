/**
 * Shared TypeScript types for the PDF Lab feature set.
 */

/**
 * Represents a single page slot within an uploaded PDF.
 * The `originalIndex` is the 0-based page number in the source file and
 * never changes — it is used when merging to copy the right page from
 * the original ArrayBuffer.
 * The `id` is a unique string so @dnd-kit can track items across re-renders.
 */
export interface PdfPage {
  id: string;           // e.g. "<fileId>-page-<originalIndex>"
  fileId: string;
  originalIndex: number; // 0-based
}

/**
 * Represents an uploaded PDF file and its current page arrangement.
 * `pages` is a mutable array — the user can reorder or remove entries.
 * `arrayBuffer` is kept in memory so pdf-lib can copy pages at merge time.
 */
export interface PdfFile {
  id: string;           // crypto.randomUUID()
  name: string;
  pageCount: number;    // total pages in the original file
  pages: PdfPage[];     // current visible + ordered pages (subset of originals)
  arrayBuffer: ArrayBuffer;
}
