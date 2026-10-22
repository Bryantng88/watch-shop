import type { ReactNode } from "react";
import clsx from "clsx";
import { ADMIN_UI } from "./admin-ui.tokens";

export function AdminPageCanvas({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(ADMIN_UI.page, ADMIN_UI.pageFlow, className)}>{children}</div>;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  meta,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  className?: string;
}) {
  return <header className={clsx("flex flex-wrap items-end justify-between gap-4", className)}>
    <div>
      {eyebrow ? <p className={ADMIN_UI.eyebrow}>{eyebrow}</p> : null}
      <h1 className={ADMIN_UI.pageTitle}>{title}</h1>
      {description ? <p className={ADMIN_UI.pageDescription}>{description}</p> : null}
    </div>
    {meta ? <div className="flex items-center gap-5 text-sm">{meta}</div> : null}
  </header>;
}

export function AdminFlatToolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(ADMIN_UI.toolbar, className)}>{children}</div>;
}
