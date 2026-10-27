"use client";

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type AsyncActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  pendingLabel?: ReactNode;
};

export function AsyncActionButton({
  pending = false,
  pendingLabel,
  disabled,
  children,
  className,
  ...props
}: AsyncActionButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 ${className || ""}`}
    >
      {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin" /> : null}
      <span>{pending && pendingLabel !== undefined ? pendingLabel : children}</span>
    </button>
  );
}
