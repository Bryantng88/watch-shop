"use client";

import Link, { type LinkProps } from "next/link";
import React, { forwardRef, type AnchorHTMLAttributes } from "react";
import { useAdminButtonAppearance, type AdminButtonAppearance } from "./AdminButton";

export const AdminLinkAction = forwardRef<HTMLAnchorElement, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & AdminButtonAppearance>(
  function AdminLinkAction({ variant, density, iconOnly, className, style, ...props }, ref) {
    const appearance = useAdminButtonAppearance({ variant, density, iconOnly, className, style });
    return <Link {...props} {...appearance} ref={ref} />;
  },
);

