"use client";

import { AdminButton, type AdminButtonVariant, type AdminButtonDensity } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type AsyncActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AdminButtonVariant;
  density?: AdminButtonDensity;
  pending?: boolean;
  pendingLabel?: ReactNode;
};

export function AsyncActionButton({
  pending = false,
  pendingLabel,
  disabled,
  children,
  className,
  variant = "secondary",
  density,
  ...props
}: AsyncActionButtonProps) {
  return (
    <AdminButton variant={variant} density={density}
      {...props}
      disabled={disabled || pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 ${className || ""}`}
    >
      {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin" /> : null}
      <span className="inline-flex min-w-0 items-center justify-center gap-2">
        {pending && pendingLabel !== undefined ? pendingLabel : children}
      </span>
    </AdminButton>
  );
}
