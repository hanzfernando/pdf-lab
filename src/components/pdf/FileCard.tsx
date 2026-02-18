"use client";

/**
 * FileCard
 *
 * Displays a single uploaded PDF in the merge list.
 * Shows the file name, page count, and action buttons:
 *   - "Edit pages" → opens PageEditor for this file
 *   - "Remove"     → removes the file from the store
 *
 * The card is also the drag handle for reordering the merge order.
 * @dnd-kit provides the drag attributes via the parent FileList.
 */

import { FileText, Trash2, LayoutGrid, GripVertical } from "lucide-react";
import { PdfFile } from "@/types/pdf.types";

interface FileCardProps {
  file: PdfFile;
  mergeIndex: number;           // 1-based position shown to the user
  onRemove: (id: string) => void;
  onEditPages: (id: string) => void;
  // @dnd-kit injects these so the card can serve as a drag handle
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}

export default function FileCard({
  file,
  mergeIndex,
  onRemove,
  onEditPages,
  dragHandleProps,
  isDragging = false,
}: FileCardProps) {
  const removedPageCount = file.pageCount - file.pages.length;

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-lg border px-4 py-3 transition-shadow duration-150",
        isDragging
          ? "shadow-xl opacity-80 bg-surface-elevated border-accent/40"
          : "bg-surface border-border shadow-sm",
      ].join(" ")}
    >
      {/* Drag handle */}
      <button
        {...dragHandleProps}
        aria-label="Drag to reorder"
        className="cursor-grab active:cursor-grabbing text-foreground-muted hover:text-foreground transition-colors shrink-0 touch-none"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Merge order badge */}
      <span className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full bg-accent text-white shrink-0">
        {mergeIndex}
      </span>

      {/* File icon */}
      <FileText className="w-5 h-5 text-accent shrink-0" />

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-foreground-muted">
          {file.pages.length} page{file.pages.length !== 1 ? "s" : ""}
          {removedPageCount > 0 && (
            <span className="ml-1 text-accent">
              ({removedPageCount} removed)
            </span>
          )}
        </p>
      </div>

      {/* Edit pages */}
      <button
        onClick={() => onEditPages(file.id)}
        aria-label={`Edit pages of ${file.name}`}
        title="Edit / rearrange pages"
        className="p-1.5 rounded-md text-foreground-muted hover:text-accent hover:bg-accent/10 transition-colors shrink-0"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      {/* Remove file */}
      <button
        onClick={() => onRemove(file.id)}
        aria-label={`Remove ${file.name}`}
        title="Remove file"
        className="p-1.5 rounded-md text-foreground-muted hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
