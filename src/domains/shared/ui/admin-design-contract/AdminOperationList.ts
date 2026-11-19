import type { CSSProperties } from "react";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import styles from "./AdminOperationList.module.css";

/** Opt-in flat Operations table; domain columns may supply their own widths. */
export const ADMIN_OPERATION_LIST = styles;
export const ADMIN_OPERATION_LIST_STYLE = {
  ...Object.fromEntries(Object.entries(F.colors).map(([key, value]) => [`--admin-list-${key}`, value])),
  "--admin-list-cell-padding": `${F.table.cellPaddingY}px ${F.table.cellPaddingX}px`,
  "--admin-list-thumbnail": `${F.thumbnail.row}px`,
  "--admin-list-title-size": `${F.typography.rowTitle.size}px`,
  "--admin-list-title-line": `${F.typography.rowTitle.lineHeight}px`,
  "--admin-list-title-weight": F.typography.rowTitle.weight,
  "--admin-list-meta-size": `${F.typography.metadata.size}px`,
  "--admin-list-meta-line": `${F.typography.metadata.lineHeight}px`,
  "--admin-list-touch": `${F.controls.touchMinHeight}px`,
} as CSSProperties;
