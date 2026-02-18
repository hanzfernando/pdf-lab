"use client";

/**
 * usePdfStore
 *
 * Central state management hook for all uploaded PDFs and their pages.
 * Lives at the top of the component tree (page.tsx) and is passed down
 * as props — no external state library needed at this scale.
 *
 * Responsibilities:
 *  - Add / remove PDF files
 *  - Reorder PDF files (for merge order)
 *  - Reorder / remove individual pages within a PDF
 */

import { useState, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { PdfFile, PdfPage } from "@/types/pdf.types";
import { parsePdfFile } from "@/helpers/pdf.helpers";

export interface PdfStore {
  files: PdfFile[];
  addFiles: (rawFiles: File[]) => Promise<void>;
  removeFile: (fileId: string) => void;
  moveFile: (oldIndex: number, newIndex: number) => void;
  movePage: (fileId: string, oldIndex: number, newIndex: number) => void;
  removePage: (fileId: string, pageId: string) => void;
  resetAll: () => void;
  isLoading: boolean;
}

export function usePdfStore(): PdfStore {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Parse one or more File objects and append them to the list.
   * Skips files that are not PDFs.
   */
  const addFiles = useCallback(async (rawFiles: File[]) => {
    const pdfs = rawFiles.filter((f) => f.type === "application/pdf");
    if (pdfs.length === 0) return;

    setIsLoading(true);
    try {
      const parsed = await Promise.all(
        pdfs.map(async (file) => {
          const { arrayBuffer, pageCount } = await parsePdfFile(file);
          const id = crypto.randomUUID();

          // Build initial page list — all pages in original order
          const pages: PdfPage[] = Array.from({ length: pageCount }, (_, i) => ({
            id: `${id}-page-${i}`,
            fileId: id,
            originalIndex: i,
          }));

          const pdfFile: PdfFile = {
            id,
            name: file.name,
            pageCount,
            pages,
            arrayBuffer,
          };
          return pdfFile;
        })
      );

      setFiles((prev) => [...prev, ...parsed]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Remove an entire PDF from the list */
  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  /** Reorder PDFs in the merge list (drag-and-drop on file cards) */
  const moveFile = useCallback((oldIndex: number, newIndex: number) => {
    setFiles((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  /**
   * Reorder pages within a single PDF (drag-and-drop in PageEditor).
   * Works on the mutable `pages` array, not the original file.
   */
  const movePage = useCallback(
    (fileId: string, oldIndex: number, newIndex: number) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, pages: arrayMove(f.pages, oldIndex, newIndex) }
            : f
        )
      );
    },
    []
  );

  /** Clear all files and reset to an empty session */
  const resetAll = useCallback(() => {
    setFiles([]);
  }, []);

  /** Remove a single page from a PDF */
  const removePage = useCallback((fileId: string, pageId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, pages: f.pages.filter((p) => p.id !== pageId) }
          : f
      )
    );
  }, []);

  return { files, addFiles, removeFile, moveFile, movePage, removePage, resetAll, isLoading };
}
