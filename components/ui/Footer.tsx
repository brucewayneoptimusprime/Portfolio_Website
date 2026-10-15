import { ArchDivider } from "./Arch";

/** Name and year only. */
export function Footer({ name }: { name: string }) {
  return (
    <footer className="mx-auto max-w-content px-4 pt-8 pb-12 md:px-8">
      <ArchDivider />
      <p className="label mt-8 text-center">
        {name} · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
