import type { CSSProperties } from "react";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import styles from "./AdminPrimaryAction.module.css";

/** Blue primary actions are opt-in; secondary/destructive semantics stay distinct. */
export const ADMIN_PRIMARY_ACTION = styles.primary;
export const ADMIN_PRIMARY_ACTION_STYLE = {
  "--admin-action-bg": F.primaryAction.background, "--admin-action-hover": F.primaryAction.hover,
  "--admin-action-pressed": F.primaryAction.pressed, "--admin-action-border": F.primaryAction.border,
  "--admin-action-text": F.primaryAction.foreground, "--admin-action-focus": F.colors.focusRing,
  "--admin-action-radius": `${F.radius.control}px`, "--admin-action-height": `${F.controls.height}px`,
  "--admin-action-touch": `${F.controls.touchMinHeight}px`, "--admin-action-font": F.fontFamily,
} as CSSProperties;
