"use client";

/**
 * FileList
 *
 * Sortable list of uploaded PDF files.
 * Uses @dnd-kit/sortable so the user can drag cards to set the merge order.
 *
 * Props:
 *  - files        – ordered array from usePdfStore
 *  - onMove       – reorder callback (oldIndex → newIndex)
 *  - onRemove     – remove a file by id
 *  - onEditPages  – open PageEditor for a file by id
 */

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PdfFile } from "@/types/pdf.types";
import FileCard from "./FileCard";

// ── Sortable wrapper ────────────────────────────────────────────────────────

/**
 * SortableFileCard wraps FileCard with @dnd-kit's useSortable hook.
 * It passes CSS transform / transition to the root element and injects
 * drag-handle props into FileCard.
 */
function SortableFileCard({
  file,
  index,
  onRemove,
  onEditPages,
}: {
  file: PdfFile;
  index: number;
  onRemove: (id: string) => void;
  onEditPages: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FileCard
        file={file}
        mergeIndex={index + 1}
        onRemove={onRemove}
        onEditPages={onEditPages}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

// ── FileList ────────────────────────────────────────────────────────────────

interface FileListProps {
  files: PdfFile[];
  onMove: (oldIndex: number, newIndex: number) => void;
  onRemove: (id: string) => void;
  onEditPages: (id: string) => void;
}

export default function FileList({
  files,
  onMove,
  onRemove,
  onEditPages,
}: FileListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = files.findIndex((f) => f.id === active.id);
    const newIndex = files.findIndex((f) => f.id === over.id);
    onMove(oldIndex, newIndex);
  };

  if (files.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2">
        Merge order — drag to reorder
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {files.map((file, index) => (
              <SortableFileCard
                key={file.id}
                file={file}
                index={index}
                onRemove={onRemove}
                onEditPages={onEditPages}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
