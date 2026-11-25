"use client";
import { useAdminShellHeading } from "./AdminShellHeading";
import type { ReactNode } from "react";
import clsx from "clsx";
import headerStyles from "./AdminPageHeader.module.css";
import { ADMIN_UI_FOUNDATION } from "./admin-ui.foundation";
import { ADMIN_UI } from "./admin-ui.tokens";

export function AdminPageCanvas({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(ADMIN_UI.page, ADMIN_UI.pageFlow, className)} style={{ fontFamily: ADMIN_UI_FOUNDATION.fontFamily }}>{children}</div>;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  meta,
  className,
  variant = "default",
  showInShell = false,
}: {
  variant?: "default" | "workspace";
  showInShell?: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  className?: string;
}) {
  const shellHeading = useAdminShellHeading();
  if (shellHeading && !showInShell) return meta ? <header className="flex min-w-0 flex-wrap items-center justify-end gap-3">{meta}</header> : null;
  return <header className={clsx("flex flex-wrap items-end justify-between gap-4", variant === "workspace" && headerStyles.workspace, className)}>
    <div>
      {eyebrow ? <p className={ADMIN_UI.eyebrow}>{eyebrow}</p> : null}
      <h1 className={variant === "workspace" ? "m-0 text-xl font-bold leading-7 text-slate-950 sm:text-2xl sm:leading-8" : ADMIN_UI.pageTitle}>{title}</h1>
      {description ? <p className={variant === "workspace" ? "mt-1 text-sm font-normal leading-5 text-slate-500" : ADMIN_UI.pageDescription}>{description}</p> : null}
    </div>
    {meta ? <div className="flex items-center gap-5 text-sm">{meta}</div> : null}
  </header>;
}

/** Filters are grouped; document actions sit flat between the header and editor. */
export function AdminFlatToolbar({
  children,
  className,
  variant = "filters",
}: {
  children: ReactNode;
  className?: string;
  variant?: "filters" | "actions";
}) {
  return <div className={clsx(
    variant === "actions"
      ? "flex flex-col gap-3 border-b border-slate-100 bg-white pb-4 lg:flex-row lg:items-center lg:justify-between"
      : ADMIN_UI.toolbar,
    className,
  )}>{children}</div>;
}


/** Page-wide document commands live at the bottom, outside workspace headings. */
export function AdminDocumentFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <footer aria-label="Thao tác tài liệu" className={clsx(
    "flex min-w-0 flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-white py-3 pb-[max(12px,env(safe-area-inset-bottom))]",
    className,
  )}>{children}</footer>;
}
