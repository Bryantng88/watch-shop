import type { CSSProperties } from "react";
import { Loader2 } from "lucide-react";
import { ADMIN_UI_FOUNDATION as f } from "./admin-ui.foundation";
import styles from "./AdminNavigationLoading.module.css";

/** Static loading boundary: no page queries, fake records or permission decisions. */
export function AdminNavigationLoading() {
  const style = {
    "--navigation-loading-font": f.fontFamily,
    "--navigation-loading-muted": f.colors.muted,
    "--navigation-loading-surface": f.colors.softSurface,
    "--navigation-loading-canvas": f.colors.canvas,
    "--navigation-loading-gutter": `${f.page.desktopPaddingX}px`,
    "--navigation-loading-mobile-gutter": `${f.page.mobilePaddingX}px`,
  } as CSSProperties;
  return <section className={styles.loading} style={style} role="status" aria-live="polite" aria-busy="true" aria-label="Đang tải nội dung">
    <p className={styles.message}><Loader2 size={16} className={styles.spinner} aria-hidden="true"/>Đang tải nội dung…</p>
    <div className={styles.placeholder} aria-hidden="true"><span/><span/><span/></div>
  </section>;
}
