"use client";

import Image from "next/image";
import { useRef } from "react";

type Labels = { view: string; close: string };

/**
 * A company logo in a black tile. Clicking it opens the logo large in a native <dialog>;
 * a click anywhere, Escape, or the close button returns to the page.
 */
export function LogoViewer({ src, company, labels }: { src: string; company: string; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewLabel = labels.view.replace("{company}", company);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={viewLabel}
        className="flex h-14 w-14 shrink-0 cursor-zoom-in items-center justify-center rounded-card border border-border-strong bg-logo-tile p-1 md:h-18 md:w-18"
      >
        <Image src={src} alt="" width={72} height={72} unoptimized loading="lazy" className="h-full w-full object-contain" />
      </button>

      <dialog
        ref={dialog}
        aria-label={viewLabel}
        onClick={() => dialog.current?.close()}
        className="m-auto cursor-zoom-out bg-transparent p-0 backdrop:bg-bg/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="rounded-card border border-border-strong bg-logo-tile p-4">
            <Image
              src={src}
              alt={company}
              width={320}
              height={320}
              unoptimized
              loading="lazy"
              className="h-[min(70vw,20rem)] w-[min(70vw,20rem)] object-contain"
            />
          </div>
          <button
            type="button"
            className="label inline-flex min-h-11 items-center rounded-card border border-border-strong bg-bg px-4 text-text hover:border-accent-soft"
          >
            {labels.close}
          </button>
        </div>
      </dialog>
    </>
  );
}
