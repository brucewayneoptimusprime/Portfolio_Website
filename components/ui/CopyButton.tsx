"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Labels = { copy: string; copied: string; failed: string };

const noSubscribe = () => () => {};

/** The old textarea + execCommand route, for browsers or contexts that deny the Clipboard API. */
function legacyCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

/**
 * Copies `text` and confirms through an aria-live region. If both copy routes fail, it selects the
 * element with id `selectId` so the visitor can copy it by hand. Hidden until hydrated, so a page
 * without JavaScript never shows a button that does nothing (the mailto link still works).
 */
export function CopyButton({ text, selectId, labels }: { text: string; selectId: string; labels: Labels }) {
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = legacyCopy(text);
    }
    if (!ok) {
      const target = document.getElementById(selectId);
      if (target) window.getSelection()?.selectAllChildren(target);
    }
    setStatus(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), ok ? 2000 : 6000);
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${hydrated ? "" : "invisible"}`}>
      <button
        type="button"
        onClick={copy}
        disabled={!hydrated}
        className="inline-flex min-h-11 items-center gap-2 rounded-card border border-border-strong px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent-soft hover:bg-surface-2"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
          {status === "copied" ? (
            <path d="M3 8.5l3 3 7-7" />
          ) : (
            <>
              <rect x="5.5" y="5.5" width="8" height="8" rx="1" />
              <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
            </>
          )}
        </svg>
        {status === "copied" ? labels.copied : labels.copy}
      </button>
      <p aria-live="polite" className={status === "failed" ? "max-w-xs text-center text-sm text-text" : "sr-only"}>
        {status === "copied" ? labels.copied : status === "failed" ? labels.failed : ""}
      </p>
    </div>
  );
}
