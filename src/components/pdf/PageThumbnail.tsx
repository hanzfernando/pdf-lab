"use client";

/**
 * PageThumbnail
 *
 * Renders a single PDF page as a canvas thumbnail using pdfjs-dist.
 *
 * Key decisions for Next.js App Router compatibility:
 *  1. pdfjs-dist is dynamically imported INSIDE useEffect — it must never
 *     run during SSR because it references browser globals (DOMMatrix, etc.)
 *  2. The worker is served from /public/pdf.worker.min.mjs (copied at build
 *     time) to avoid any CDN CORS issues.
 */

import { useEffect, useRef, useState } from "react";

const THUMBNAIL_WIDTH = 160; // px

interface PageThumbnailProps {
  arrayBuffer: ArrayBuffer;
  pageIndex: number;
  label?: string;
  isDragging?: boolean;
  onRemove?: () => void;
  dragHandleProps?: Record<string, unknown>;
}

export default function PageThumbnail({
  arrayBuffer,
  pageIndex,
  label,
  isDragging = false,
  onRemove,
  dragHandleProps,
}: PageThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsRendering(true);
    setError(false);

    (async () => {
      try {
        // ── Lazy import — runs only on the client, never during SSR ──
        const pdfjsLib = await import("pdfjs-dist");

        // Point the worker at the local file we copied to /public
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        // pdfjs page numbers are 1-based
        const page = await pdf.getPage(pageIndex + 1);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1 });
        const scale = THUMBNAIL_WIDTH / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport: scaledViewport, canvas }).promise;

        if (!cancelled) setIsRendering(false);
      } catch (err) {
        console.error("PageThumbnail render error:", err);
        if (!cancelled) {
          setError(true);
          setIsRendering(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [arrayBuffer, pageIndex]);

  return (
    <div
      className={[
        "relative flex flex-col items-center gap-1 rounded-lg border overflow-hidden group transition-shadow duration-150",
        isDragging
          ? "shadow-xl opacity-75 border-accent/40"
          : "border-border bg-surface hover:shadow-md",
      ].join(" ")}
      style={{ width: THUMBNAIL_WIDTH + 2 }}
    >
      {/* Drag handle overlay */}
      <div
        {...dragHandleProps}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        aria-label="Drag to reorder page"
      />

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove page"
          title="Remove page"
          className="absolute top-1 right-1 z-20 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
        >
          ×
        </button>
      )}

      {/* Canvas / skeleton */}
      {(isRendering || error) && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-foreground-muted text-xs ${isRendering ? "animate-pulse bg-surface-elevated" : "bg-red-500/10 text-red-500"}`}
          style={{ width: THUMBNAIL_WIDTH, height: Math.round(THUMBNAIL_WIDTH * 1.414) }}
        >
          {error ? "Error" : ""}
        </div>
      )}
      <canvas ref={canvasRef} className="block" />

      {/* Page label */}
      <p className="w-full text-center text-[10px] text-foreground-muted py-1 bg-surface truncate px-1 z-10 relative pointer-events-none">
        {label ?? `Page ${pageIndex + 1}`}
      </p>
    </div>
  );
}