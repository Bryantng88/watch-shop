import type { CSSProperties } from "react";
import { ADMIN_OPERATION_LIST_STYLE } from "./AdminOperationList";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import styles from "./AdminTechnicalList.module.css";
/** Compact technical rows: foundation presentation; domain owns data and callbacks. */
export const ADMIN_TECHNICAL_LIST = styles;
export const ADMIN_TECHNICAL_LIST_STYLE = {
  ...ADMIN_OPERATION_LIST_STYLE,
  "--ti-row-padding": `${F.row.paddingY}px`,
  "--ti-row-gap": `${F.row.gap}px`,
  "--ti-radius": `${F.radius.control}px`,
  "--ti-control-height": `${F.controls.height}px`,
  "--ti-body-size": `${F.typography.body.size}px`,
  "--ti-body-line": `${F.typography.body.lineHeight}px`,
} as CSSProperties;
