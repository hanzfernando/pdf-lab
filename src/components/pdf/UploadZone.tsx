"use client";

/**
 * UploadZone
 *
 * A drag-and-drop target + file-picker button for PDF uploads.
 * Accepts multiple files at once. Non-PDF files are silently ignored
 * (the store's addFiles() also checks MIME type as a second guard).
 *
 * Props:
 *  - onUpload: called with the raw File array when the user drops / picks files
 *  - isLoading: shows a spinner while the parent is parsing the PDFs
 */

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  isLoading?: boolean;
}

export default function UploadZone({ onUpload, isLoading = false }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // ── event handlers ──────────────────────────────────────────────────────────

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    // Allow dropping
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => setIsDraggingOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onUpload(files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onUpload(files);
    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isLoading && inputRef.current?.click()}
      role="button"
      aria-label="Upload PDF files"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={[
        "w-full rounded-xl border-2 border-dashed px-6 py-14 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors duration-200 select-none",
        isDraggingOver
          ? "border-accent bg-accent/10"
          : "border-border bg-surface hover:border-accent/60 hover:bg-surface-elevated",
      ].join(" ")}
    >
      {/* Hidden native file input */}
      {/* accept must include BOTH the MIME type AND the .pdf extension.
          Mobile browsers (Android/iOS) rely on the extension to show the
          general file manager instead of the camera / media picker. */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Icon */}
      <UploadCloud
        className={`w-10 h-10 transition-colors duration-200 ${
          isDraggingOver ? "text-accent" : "text-foreground-muted"
        }`}
      />

      {/* Label */}
      {isLoading ? (
        <p className="text-sm text-foreground-muted animate-pulse">Processing…</p>
      ) : (
        <>
          <p className="text-base font-semibold text-foreground">
            {isDraggingOver ? "Drop PDFs here" : "Drag & drop PDFs here"}
          </p>
          <p className="text-sm text-foreground-muted">
            or{" "}
            <span className="text-accent underline underline-offset-2">
              browse files
            </span>
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            PDF files only · multiple files supported
          </p>
        </>
      )}
    </div>
  );
}
