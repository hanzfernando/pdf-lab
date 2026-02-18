"use client";

/**
 * PageEditor
 *
 * A full-screen modal that lets the user:
 *  - Preview all pages of a single PDF as thumbnails
 *  - Drag thumbnails to reorder them
 *  - Click × on a thumbnail to remove the page
 *
 * Opened from FileCard via the LayoutGrid button.
 *
 * Props:
 *  - file          – the PdfFile whose pages are being edited
 *  - onMovePage    – reorder callback (oldIndex, newIndex)
 *  - onRemovePage  – remove page by id
 *  - onClose       – close the modal
 */

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, RotateCcw } from "lucide-react";
import { PdfFile, PdfPage } from "@/types/pdf.types";
import PageThumbnail from "./PageThumbnail";

// ── Sortable thumbnail wrapper ───────────────────────────────────────────────

function SortablePage({
  page,
  arrayBuffer,
  onRemove,
}: {
  page: PdfPage;
  arrayBuffer: ArrayBuffer;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PageThumbnail
        arrayBuffer={arrayBuffer}
        pageIndex={page.originalIndex}
        label={`Page ${page.originalIndex + 1}`}
        isDragging={isDragging}
        onRemove={() => onRemove(page.id)}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ── PageEditor modal ─────────────────────────────────────────────────────────

interface PageEditorProps {
  file: PdfFile;
  onMovePage: (fileId: string, oldIndex: number, newIndex: number) => void;
  onRemovePage: (fileId: string, pageId: string) => void;
  onClose: () => void;
}

export default function PageEditor({
  file,
  onMovePage,
  onRemovePage,
  onClose,
}: PageEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = file.pages.findIndex((p) => p.id === active.id);
    const newIndex = file.pages.findIndex((p) => p.id === over.id);
    onMovePage(file.id, oldIndex, newIndex);
  };

  const removedCount = file.pageCount - file.pages.length;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div className="w-full max-w-5xl bg-background rounded-2xl shadow-2xl border border-border flex flex-col">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground truncate max-w-sm" title={file.name}>
              {file.name}
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              {file.pages.length} page{file.pages.length !== 1 ? "s" : ""} visible
              {removedCount > 0 && (
                <span className="ml-1 text-accent">· {removedCount} removed</span>
              )}
            </p>
          </div>

          {/* Tips */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-foreground-muted">
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Drag to reorder
            </span>
            <span>· Click × to remove</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close page editor"
            className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Page grid ───────────────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto">
          {file.pages.length === 0 ? (
            <p className="text-center text-foreground-muted py-20 text-sm">
              All pages removed. Close this editor and remove the file, or re-upload it.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={file.pages.map((p) => p.id)}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-wrap gap-4">
                  {file.pages.map((page) => (
                    <SortablePage
                      key={page.id}
                      page={page}
                      arrayBuffer={file.arrayBuffer}
                      onRemove={(id) => onRemovePage(file.id, id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
