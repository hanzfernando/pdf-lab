"use client";

/**
 * Home / Dashboard page
 *
 * Composes all PDF Lab features:
 *  1. UploadZone       – drag-and-drop or click to add PDFs
 *  2. FileList         – sortable list of uploaded files (sets merge order)
 *  3. PageEditor       – modal to rearrange / remove pages per file
 *  4. MergeToolbar     – sticky bottom bar with the Merge & Download button
 *
 * State lives in usePdfStore and flows down as props.
 * PageEditor is shown only when the user clicks the LayoutGrid icon on a card.
 */

import { useState } from "react";
import { usePdfStore } from "@/hooks/usePdfStore";
import UploadZone from "@/components/pdf/UploadZone";
import FileList from "@/components/pdf/FileList";
import PageEditor from "@/components/pdf/PageEditor";
import MergeToolbar from "@/components/pdf/MergeToolbar";

export default function Home() {
  const store = usePdfStore();

  // ID of the file whose PageEditor is currently open (null = closed)
  const [editingFileId, setEditingFileId] = useState<string | null>(null);

  const editingFile = store.files.find((f) => f.id === editingFileId) ?? null;

  return (
    <>
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-6 pb-24"
        /* pb-24 leaves room above the sticky MergeToolbar */
      >
        {/* Upload area */}
        <UploadZone onUpload={store.addFiles} isLoading={store.isLoading} />

        {/* File list (only shown after at least one upload) */}
        {store.files.length > 0 && (
          <FileList
            files={store.files}
            onMove={store.moveFile}
            onRemove={store.removeFile}
            onEditPages={(id) => setEditingFileId(id)}
          />
        )}
      </div>

      {/* ── Merge toolbar ─────────────────────────────────────────────── */}
      <MergeToolbar files={store.files} onReset={store.resetAll} />

      {/* ── Page editor modal ─────────────────────────────────────────── */}
      {editingFile && (
        <PageEditor
          file={editingFile}
          onMovePage={store.movePage}
          onRemovePage={store.removePage}
          onClose={() => setEditingFileId(null)}
        />
      )}
    </>
  );
}


