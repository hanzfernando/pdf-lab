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
      <div className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">

        {/* Row 1 — summary + error */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">
            {files.length} file{files.length !== 1 ? "s" : ""} &middot; {totalPages} page{totalPages !== 1 ? "s" : ""} total
          </p>
          {error && (
            <p className="text-xs text-red-500 text-right">{error}</p>
          )}
        </div>

        {/* Row 2 — filename input + action buttons */}
        <div className="flex items-center gap-2">
          {/* Filename input grows to fill available space */}
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Output filename"
            disabled={isMerging}
            className="flex-1 min-w-0 px-3 py-2.5 rounded-lg text-sm border border-border bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
            aria-label="Output filename"
          />

          {/* Reset — icon-only on mobile, labelled on sm+ */}
          <button
            onClick={onReset}
            disabled={isMerging}
            title="Clear all files and start over"
            className="shrink-0 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground-muted hover:text-red-500 hover:border-red-400 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Show label on sm+, hide on mobile to save space */}
            <span className="hidden sm:inline">Reset</span>
            {/* Mobile icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>

          {/* Merge button */}
          <button
            onClick={handleMerge}
            disabled={!canMerge || isMerging}
            className={[
              "shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer",
              canMerge && !isMerging
                ? "bg-accent text-white hover:bg-accent-hover"
                : "bg-surface-elevated text-foreground-muted cursor-not-allowed",
            ].join(" ")}
          >
            {isMerging ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Merging…</span>
              </>
            ) : (
              <>
                <Combine className="w-4 h-4" />
                <span className="hidden sm:inline">Merge &amp; Download</span>
                <span className="sm:hidden">Merge</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
