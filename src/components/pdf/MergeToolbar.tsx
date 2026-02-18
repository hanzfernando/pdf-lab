"use client";

/**
 * MergeToolbar
 *
 * A sticky bottom bar that summarises the pending merge and triggers it.
 *
 * Shows:
 *  - Total file count and final page count
 *  - A "Merge & Download" button
 *  - A spinner while the merge is running
 *
 * The actual merge logic lives in pdf.helpers.ts — this component is
 * only responsible for UI state (loading / error feedback).
 */

import { useState } from "react";
import { Combine, Loader2 } from "lucide-react";
import { PdfFile } from "@/types/pdf.types";
import { mergePdfs, downloadBlob } from "@/helpers/pdf.helpers";

interface MergeToolbarProps {
  files: PdfFile[];
  onReset: () => void;
}

export default function MergeToolbar({ files, onReset }: MergeToolbarProps) {
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState("pdf-lab-by-hanz-merged");

  const totalPages = files.reduce((sum, f) => sum + f.pages.length, 0);
  const canMerge = files.length >= 1 && totalPages > 0;

  const handleMerge = async () => {
    if (!canMerge || isMerging) return;
    setError(null);
    setIsMerging(true);
    try {
      const blob = await mergePdfs(files);
      downloadBlob(blob, filename.trim() || "pdf-lab-by-hanz-merged");
    } catch (err) {
      console.error(err);
      setError("Merge failed. Make sure all uploaded files are valid PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-(--appbar-bg) shadow-[0_-2px_8px_0_rgb(0_0_0/0.08)] transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

        {/* Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <p className="text-sm font-medium text-foreground">
            {files.length} file{files.length !== 1 ? "s" : ""} &middot; {totalPages} page{totalPages !== 1 ? "s" : ""} total
          </p>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* Filename input + actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            disabled={isMerging}
            title="Clear all files and start over"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground-muted hover:text-red-500 hover:border-red-400 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="filename.pdf"
            disabled={isMerging}
            className="w-56 px-3 py-2 rounded-lg text-sm border border-border bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
            aria-label="Output filename"
          />
          <button
            onClick={handleMerge}
            disabled={!canMerge || isMerging}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer",
              canMerge && !isMerging
                ? "bg-accent text-white hover:bg-accent-hover"
                : "bg-surface-elevated text-foreground-muted cursor-not-allowed",
            ].join(" ")}
          >
            {isMerging ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Merging…
              </>
            ) : (
              <>
                <Combine className="w-4 h-4" />
                Merge &amp; Download
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
