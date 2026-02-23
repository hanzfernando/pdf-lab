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

import { useMemo, useState } from "react";
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

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "PDF Lab – Online PDF Merger & Editor",
      description:
        "Merge, split, reorder and delete PDF pages in your browser with PDF Lab. Free, fast and secure online PDF tools.",
      applicationCategory: "Utility",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Merge multiple PDF files into one",
        "Reorder and delete individual PDF pages",
        "Organize documents before downloading",
        "Works in the browser, no installation",
      ],
    }),
    []
  );

  return (
    <>
      {/* ── SEO structured data ───────────────────────────────────────── */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-8 pb-28">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center gap-4 pt-8 md:pt-14 max-w-xl w-full">
          {/* pill badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full select-none">
            Free · Private · No sign-up
          </span>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
            Merge &amp; edit{" "}
            <span className="text-accent">PDF files</span>{" "}
            online
          </h1>

          <p className="text-sm md:text-base text-foreground-muted max-w-sm">
            Combine multiple PDFs, reorder pages and download in seconds —
            no account, no install, nothing uploaded to a server.
          </p>
        </section>

        {/* ── Upload zone ───────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl">
          <UploadZone onUpload={store.addFiles} isLoading={store.isLoading} />
        </div>

        {/* ── File list (after first upload) ────────────────────────────── */}
        {store.files.length > 0 && (
          <section className="w-full max-w-2xl space-y-3" aria-label="PDF files ready to merge">
            
            <FileList
              files={store.files}
              onMove={store.moveFile}
              onRemove={store.removeFile}
              onEditPages={(id) => setEditingFileId(id)}
            />
          </section>
        )}

        {/* ── Hidden SEO copy: visible to crawlers & screen readers only ── */}
        <section className="sr-only">
          <h2>Merge PDF files without uploading to a server — free &amp; private</h2>
          <p>
            PDF Lab is a free browser-based PDF merger that works entirely on
            your device. Combine PDF files, reorder or delete individual pages,
            and download the result — no account, no sign-up, no file upload to
            any server required. It is the fastest way to merge PDFs online
            without registration.
          </p>
          <ul>
            <li>Merge PDF files without uploading to a server</li>
            <li>Combine PDFs in browser without an account</li>
            <li>Free PDF merger — no sign-up required</li>
            <li>Reorder and delete PDF pages online for free</li>
            <li>Browser-based PDF editor, no install needed</li>
          </ul>
        </section>

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


