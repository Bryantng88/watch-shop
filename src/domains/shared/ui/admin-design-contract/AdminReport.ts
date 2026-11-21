import type { CSSProperties } from "react";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import styles from "./AdminReport.module.css";
export const ADMIN_REPORT = styles;
export const ADMIN_REPORT_STYLE = {
  ...Object.fromEntries(Object.entries(F.colors).map(([key,value])=>[`--report-${key}`,value])),
  "--report-font": F.fontFamily,
} as CSSProperties;
