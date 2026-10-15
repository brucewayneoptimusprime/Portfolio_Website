"use client";

import Image from "next/image";
import { useRef } from "react";

type Props = {
  image: { src: string; alt: string; width: number; height: number };
  /** Accessible name for the enlarge button, e.g. "Enlarge image: <project title>". */
  enlargeLabel: string;
  closeLabel: string;
  /** Classes for the thumbnail frame (corners, borders). */
  frameClassName?: string;
  /** Thumbnail frame ratio, e.g. "16 / 9". The image is contained inside it, never cropped. */
  aspect: string;
};

/**
 * A card image that opens large in a native modal <dialog>. The dialog keeps focus inside it, closes
 * with the button, Escape or a click on the backdrop, and the browser returns focus to the image.
 * Page scrolling is paused while it's open. No animation, so reduced motion needs nothing extra.
 */
export function ImageZoom({ image, enlargeLabel, closeLabel, frameClassName = "", aspect }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  const open = () => {
    document.documentElement.style.overflow = "hidden";
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={enlargeLabel}
        style={{ aspectRatio: aspect }}
        className={`block w-full cursor-zoom-in overflow-hidden bg-surface ${frameClassName}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          unoptimized
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </button>

      <dialog
        ref={dialog}
        aria-label={image.alt}
        // Only a click on the dialog box itself (the backdrop area around the content) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        onClose={() => (document.documentElement.style.overflow = "")}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-bg/90 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-[100svh] w-[100vw] flex-col items-center justify-center gap-3 p-4 md:p-8" onClick={(e) => e.target === e.currentTarget && close()}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            unoptimized
            className="h-auto max-h-[calc(100svh-7rem)] w-auto max-w-full rounded-card border border-border-strong object-contain"
          />
          <button
            type="button"
            onClick={close}
            autoFocus
            className="label inline-flex min-h-11 items-center rounded-card border border-border-strong bg-bg px-5 text-text hover:border-accent-soft"
          >
            {closeLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
