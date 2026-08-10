"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { CLIENT_API_PREFIX } from "@/lib/api/config";

/**
 * Downloads a PDF from the API.
 *
 * The file comes through the authenticated proxy, so a plain <a href> would
 * not carry the session. Fetching it as a blob and clicking a temporary link
 * keeps the download authenticated and lets the server choose the filename.
 */
export function DownloadButton({
  path,
  fallbackFilename,
  children,
  ...props
}: ButtonProps & { path: string; fallbackFilename: string }) {
  const { toast } = useToast();
  const [pending, setPending] = React.useState(false);

  const download = async () => {
    setPending(true);
    try {
      const response = await fetch(`${CLIENT_API_PREFIX}${path}`, {
        credentials: "same-origin",
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.detail ?? "The document could not be downloaded");
      }

      const blob = await response.blob();

      // Prefer the filename the server sent.
      const disposition = response.headers.get("content-disposition") ?? "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] ?? fallbackFilename;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download failed",
        description:
          error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "error",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button onClick={download} disabled={pending} {...props}>
      {pending ? <Loader2 className="animate-spin" /> : <Download />}
      {pending ? "Preparing…" : children}
    </Button>
  );
}
