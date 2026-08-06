"use client";

import * as React from "react";
import { ImagePlus, MoveLeft, MoveRight, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MAX_SCREENSHOTS,
  MAX_SCREENSHOT_MB,
  MIN_SCREENSHOTS,
} from "@/lib/validation";

export interface LocalScreenshot {
  id: string;
  file: File;
  previewUrl: string;
}


/**
 * Local-only uploader. Previews use object URLs; nothing leaves the browser.
 * Phase 3 posts these files to Cloudflare R2 as multipart form data.
 */
export function ScreenshotUploader({
  value,
  onChange,
}: {
  value: LocalScreenshot[];
  onChange: (next: LocalScreenshot[]) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);

    const accepted: LocalScreenshot[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files can be uploaded.");
        continue;
      }
      if (file.size > MAX_SCREENSHOT_MB * 1024 * 1024) {
        setError(`Each screenshot must be under ${MAX_SCREENSHOT_MB} MB.`);
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    const next = [...value, ...accepted].slice(0, MAX_SCREENSHOTS);
    if (value.length + accepted.length > MAX_SCREENSHOTS) {
      setError(`You can attach up to ${MAX_SCREENSHOTS} screenshots.`);
    }
    onChange(next);
  };

  const remove = (id: string) => {
    const target = value.find((s) => s.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(value.filter((s) => s.id !== id));
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remaining = Math.max(0, MIN_SCREENSHOTS - value.length);

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center rounded-card border border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-brand bg-brand-50" : "border-line bg-canvas/60",
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-brand shadow-soft">
          <ImagePlus className="size-5" />
        </span>
        <p className="mt-4 text-[15px] font-medium text-ink">
          Drag screenshots here, or browse
        </p>
        <p className="mt-1 text-[13px] text-muted">
          PNG or JPG, up to {MAX_SCREENSHOT_MB} MB each. Minimum {MIN_SCREENSHOTS}, maximum{" "}
          {MAX_SCREENSHOTS}.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft transition-colors hover:border-brand/40"
        >
          <Upload className="size-4" />
          Choose files
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="text-[13px] text-danger">{error}</p>}

      {value.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((shot, i) => (
            <li
              key={shot.id}
              className="overflow-hidden rounded-field border border-line bg-white shadow-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.previewUrl}
                alt={`Screenshot ${i + 1}`}
                className="h-32 w-full bg-canvas object-cover"
              />
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate text-[13px] text-muted">
                  {i + 1}. {shot.file.name}
                </span>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move earlier"
                    className="rounded-full p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink disabled:opacity-30"
                  >
                    <MoveLeft className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    aria-label="Move later"
                    className="rounded-full p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink disabled:opacity-30"
                  >
                    <MoveRight className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(shot.id)}
                    aria-label="Remove screenshot"
                    className="rounded-full p-1.5 text-muted transition-colors hover:bg-danger-bg hover:text-danger"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p
        className={cn(
          "text-[13px]",
          remaining > 0 ? "text-warning" : "text-accent",
        )}
      >
        {remaining > 0
          ? `${remaining} more screenshot${remaining === 1 ? "" : "s"} required`
          : `${value.length} screenshots attached — minimum met`}
      </p>
    </div>
  );
}
