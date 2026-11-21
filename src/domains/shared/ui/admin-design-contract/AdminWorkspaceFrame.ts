import type { CSSProperties } from "react";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import styles from "./AdminWorkspaceFrame.module.css";
export const ADMIN_WORKSPACE_FRAME = styles.frame;
export const ADMIN_WORKSPACE_FRAME_STYLE = {
  "--admin-workspace-max": `${F.page.workspaceMaxWidth}px`,
  "--admin-workspace-edge": `${F.page.desktopOuterGutter}px`,
} as CSSProperties;
