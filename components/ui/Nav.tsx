"use client";

import { useEffect, useRef, useState } from "react";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";

type NavItem = { label: string; href: string; match?: string[] };

type Props = {
  name: string;
  items: NavItem[];
  linkedin?: { href: string; label: string };
  github?: { href: string; label: string };
  labels: { mainNav: string; openMenu: string; closeMenu: string };
};

/** Section ids a nav item covers ("Projects" covers both project sections). */
const idsFor = (item: NavItem) => item.match ?? [item.href.replace(/^#/, "")];

/** Tracks which page section is currently under the top third of the viewport. */
function useActiveSection(): string | undefined {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | undefined;
      for (const el of document.querySelectorAll<HTMLElement>("main section[id]")) {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = el.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}

const iconLink =
  "flex h-11 w-11 items-center justify-center rounded-card text-muted transition-colors hover:text-text";

export function Nav({ name, items, linkedin, github, labels }: Props) {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // While the sheet is open: lock page scroll, move focus into it, close on Escape or on desktop widths.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    sheetRef.current?.querySelector("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const isActive = (item: NavItem) => !!active && idsFor(item).includes(active);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
      <nav aria-label={labels.mainNav} className="mx-auto flex h-[var(--nav-h)] max-w-content items-center gap-2 px-4 md:px-8">
        <a href="#top" className="mr-auto flex h-11 items-center font-medium tracking-tight text-text no-underline">
          {name}
        </a>

        <ul className="hidden items-center lg:flex">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isActive(item) ? "true" : undefined}
                className="label flex h-11 items-center px-3 no-underline transition-colors hover:text-text aria-[current=true]:text-accent-soft"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-border-strong lg:block" />

        {linkedin && (
          <a href={linkedin.href} target="_blank" rel="noopener noreferrer" aria-label={linkedin.label} className={iconLink}>
            <LinkedInIcon className="h-[18px] w-[18px]" />
          </a>
        )}
        {github && (
          <a href={github.href} target="_blank" rel="noopener noreferrer" aria-label={github.label} className={iconLink}>
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
        )}

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="nav-sheet"
          aria-label={open ? labels.closeMenu : labels.openMenu}
          onClick={() => setOpen((o) => !o)}
          className={`${iconLink} lg:hidden`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          id="nav-sheet"
          ref={sheetRef}
          className="fixed inset-x-0 top-[var(--nav-h)] bottom-0 overflow-y-auto bg-bg lg:hidden"
        >
          <ul className="mx-auto max-w-content px-4 py-4 md:px-8">
            {items.map((item) => (
              <li key={item.href} className="border-b border-border">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item) ? "true" : undefined}
                  className="flex min-h-14 items-center font-serif text-h3 text-text no-underline aria-[current=true]:text-accent-soft"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
