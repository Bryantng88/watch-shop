import type { CSSProperties } from "react";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";

/** Shared, opt-in raised finish; static statuses and row surfaces stay flat. */
export const ADMIN_BUTTON_SURFACE_STYLE = {
  "--admin-button-neutral-gradient": F.buttonSurface.neutral,
  "--admin-button-neutral-hover": F.buttonSurface.neutralHover,
  "--admin-button-neutral-pressed": F.buttonSurface.neutralPressed,
  "--admin-button-neutral-border": F.buttonSurface.neutralBorder,
  "--admin-button-neutral-hover-border": F.buttonSurface.neutralHoverBorder,
  "--admin-button-neutral-shadow": F.buttonSurface.neutralShadow,
  "--admin-button-neutral-inset": F.buttonSurface.neutralInset,
  "--admin-button-primary-gradient": F.buttonSurface.primary,
  "--admin-button-primary-pressed": F.buttonSurface.primaryPressed,
  "--admin-button-primary-shadow": F.buttonSurface.primaryShadow,
  "--admin-button-primary-inset": F.buttonSurface.primaryInset,
} as CSSProperties;
