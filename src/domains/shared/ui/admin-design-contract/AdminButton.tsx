"use client";

import Link, { type LinkProps } from "next/link";
import { createContext, forwardRef, useContext, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ADMIN_BUTTON_SURFACE_STYLE } from "./AdminButtonSurface";
import styles from "./AdminButton.module.css";

export type AdminButtonVariant = "primary" | "secondary" | "danger" | "contextual";
export type AdminButtonDensity = "default" | "compact";
const AdminButtonContext = createContext(false);

/** Scope follows React portals, so public storefront consumers retain their own UI. */
export function AdminButtonProvider({ children }: { children: ReactNode }) {
  return <AdminButtonContext.Provider value={true}>{children}</AdminButtonContext.Provider>;
}

type Appearance = { variant?: AdminButtonVariant; density?: AdminButtonDensity; iconOnly?: boolean };
function useAppearance({ variant = "secondary", density = "default", iconOnly = false, className, style }: Appearance & { className?: string; style?: React.CSSProperties }) {
  const admin = useContext(AdminButtonContext);
  // Existing inline colors cannot bypass the action system. Retain geometry and domain CSS variables.
  const safeStyle = admin && variant !== "contextual" && style
    ? Object.fromEntries(Object.entries(style).filter(([key]) => !/^(?:background.*|color|border.*|boxShadow|font.*|textTransform|transform)$/.test(key)))
    : style;
  return {
    className: [className, admin ? styles.control : ""].filter(Boolean).join(" "),
    style: admin ? { ...ADMIN_BUTTON_SURFACE_STYLE, ...safeStyle } as React.CSSProperties : style,
    "data-admin-button": admin ? variant : undefined,
    "data-admin-density": admin ? density : undefined,
    "data-admin-icon": admin && iconOnly ? "true" : undefined,
  };
}

/** Preserve native type, formAction, refs, events, disabled and ARIA semantics. */
export const AdminButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & Appearance>(
  function AdminButton({ variant, density, iconOnly, className, style, ...props }, ref) {
    const appearance = useAppearance({ variant, density, iconOnly, className, style });
    return <button {...props} {...appearance} ref={ref} />;
  },
);

export const AdminAnchorAction = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & Appearance>(
  function AdminAnchorAction({ variant, density, iconOnly, className, style, ...props }, ref) {
    const appearance = useAppearance({ variant, density, iconOnly, className, style });
    return <a {...props} {...appearance} ref={ref} />;
  },
);

export const AdminLinkAction = forwardRef<HTMLAnchorElement, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & Appearance>(
  function AdminLinkAction({ variant, density, iconOnly, className, style, ...props }, ref) {
    const appearance = useAppearance({ variant, density, iconOnly, className, style });
    return <Link {...props} {...appearance} ref={ref} />;
  },
);

/** Keep native details/summary semantics and disclosure styling. */
export const AdminDisclosureSummary = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function AdminDisclosureSummary({ className, style, ...props }, ref) {
    const appearance = useAppearance({ variant: "contextual", className, style });
    return <summary {...props} {...appearance} ref={ref} />;
  },
);
