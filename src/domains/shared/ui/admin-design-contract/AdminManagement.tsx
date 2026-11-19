import type { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { AdminPageCanvas, AdminPageHeader } from "./AdminPage";
import { ADMIN_UI_FOUNDATION as f } from "./admin-ui.foundation";
import { AsyncActionButton } from "../mutation/AsyncActionButton";
import styles from "./AdminManagement.module.css";
export { styles as ADMIN_MANAGEMENT };

export function AdminManagementPage({ title, eyebrow, description, actions, children }: { title: string; eyebrow?: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  const variables = {
    "--am-font": f.fontFamily, "--am-text": f.colors.text, "--am-body": f.colors.body, "--am-muted": f.colors.muted,
    "--am-line": f.colors.divider, "--am-border": f.colors.controlBorder, "--am-soft": f.colors.softSurface,
    "--am-ring": f.colors.focusRing, "--am-primary": f.colors.primary, "--am-hover": f.colors.primaryHover,
    "--am-error": f.colors.danger, "--am-link": f.colors.link, "--am-canvas": f.colors.canvas,
    "--am-radius": `${f.radius.control}px`, "--am-control": `${f.controls.height}px`,
    "--am-touch": `${f.controls.touchMinHeight}px`, "--am-section": `${f.spacing.section}px`,
  } as CSSProperties;
  return <div style={variables}>
    <AdminPageCanvas className={styles.page}><div className={styles.flow}>
      <AdminPageHeader title={title} eyebrow={eyebrow} description={description} meta={actions} />
      {children}
    </div></AdminPageCanvas>
  </div>;
}
/** A workspace pane owns its heading/actions; the surrounding page owns padding. */
export function AdminManagementSection({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return <section className={styles.flow} aria-label={title}>
    <div className={styles.sectionHeader}><div><h2 className={styles.sectionTitle}>{title}</h2>{description && <p className={styles.metadata}>{description}</p>}</div>{actions && <div className={styles.actions}>{actions}</div>}</div>
    {children}
  </section>;
}
export function AdminManagementButton({ primary, pending, pendingLabel, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean; pending?: boolean; pendingLabel?: string }) {
  return <AsyncActionButton type="button" className={`${styles.button} ${primary ? styles.primary : ""} ${className}`} pending={pending} pendingLabel={pendingLabel} {...props} />;
}
export function AdminManagementField({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId();
  return <label className={styles.field} htmlFor={id}>
    <span>{label}</span><input type="text" {...props} id={id} className={styles.input} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
    {error && <small id={`${id}-error`} className={styles.error}>{error}</small>}
  </label>;
}
