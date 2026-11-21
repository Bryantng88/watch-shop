"use client";
import { useRef, useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { AdminManagementField } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { readUiResponse, uiFeedbackMessage } from "@/domains/shared/feedback/read-ui-response";
import styles from "./ProfileWorkspace.module.css";

export default function ChangePasswordForm() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null);
  const lock = useRef(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (lock.current) return;
    if (newPassword !== confirm) { setFeedback({ error: true, message: "Mật khẩu xác nhận chưa khớp." }); return; }
    lock.current = true; setLoading(true); setFeedback(null);
    try {
      const result = await readUiResponse(await fetch("/api/admin/profile/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ oldPassword, newPassword }) }), "Không thể đổi mật khẩu. Vui lòng thử lại.");
      if (result.success !== true) throw new Error("Không thể xác nhận mật khẩu đã được đổi.");
      setOld(""); setNew(""); setConfirm(""); setShow(false); setFeedback({ error: false, message: "Đã đổi mật khẩu." });
    } catch (error) { setFeedback({ error: true, message: uiFeedbackMessage(error, "Không thể đổi mật khẩu. Vui lòng thử lại.") }); }
    finally { lock.current = false; setLoading(false); }
  };
  return <form className={styles.section} onSubmit={submit} aria-label="Đổi mật khẩu" aria-busy={loading}>
    <h2 className={styles.heading}><LockKeyhole />Bảo mật</h2>
    <p className={styles.metadata}>Nhập mật khẩu hiện tại để đặt mật khẩu mới.</p>
    <fieldset disabled={loading} className={styles.fields}>
      <AdminManagementField label="Mật khẩu hiện tại" type={show ? "text" : "password"} autoComplete="current-password" required value={oldPassword} onChange={event => setOld(event.target.value)} />
      <div />
      <AdminManagementField label="Mật khẩu mới" type={show ? "text" : "password"} autoComplete="new-password" required value={newPassword} onChange={event => setNew(event.target.value)} />
      <AdminManagementField label="Nhập lại mật khẩu mới" type={show ? "text" : "password"} autoComplete="new-password" required value={confirm} onChange={event => setConfirm(event.target.value)} />
    </fieldset>
    <label className="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={show} disabled={loading} onChange={event => setShow(event.target.checked)} />Hiện mật khẩu</label>
    {feedback && <p role={feedback.error ? "alert" : "status"} data-error={feedback.error} className={styles.feedback}>{feedback.message}</p>}
    <div className={styles.actions}><AdminButton variant="primary" type="submit" density="compact" disabled={loading || !oldPassword || !newPassword || !confirm}>{loading ? "Đang đổi…" : "Đổi mật khẩu"}</AdminButton></div>
  </form>;
}
