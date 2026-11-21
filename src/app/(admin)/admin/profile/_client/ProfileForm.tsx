"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserRound, ImagePlus } from "lucide-react";
import MediaBrowserDialog from "@/components/media/MediaBrowserDialog";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { AdminButton, AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { AdminManagementField } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { readUiResponse, uiFeedbackMessage } from "@/domains/shared/feedback/read-ui-response";
import type { ProfileUser } from "./ProfileWorkspace";
import styles from "./ProfileWorkspace.module.css";

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const [saved, setSaved] = useState({ name: user.name ?? "", avatarUrl: user.avatarUrl ?? "" });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null);
  const lock = useRef(false);
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const avatarSrc = resolveMediaPreviewSrc(avatarUrl);
  const dirty = name !== saved.name || avatarUrl !== saved.avatarUrl;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.current || !dirty) return;
    lock.current = true; setLoading(true); setFeedback(null);
    try {
      const next = { name: name.trim(), avatarUrl: avatarUrl.trim() };
      const result = await readUiResponse(await fetch("/api/admin/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...next, avatarUrl: next.avatarUrl || null }) }), "Không thể lưu hồ sơ. Vui lòng thử lại.");
      if (result.success !== true) throw new Error("Không thể xác nhận hồ sơ đã được lưu.");
      setName(next.name); setAvatarUrl(next.avatarUrl); setSaved(next);
      setFeedback({ error: false, message: "Đã lưu thông tin cá nhân." }); router.refresh();
    } catch (error) { setFeedback({ error: true, message: uiFeedbackMessage(error, "Không thể lưu hồ sơ. Vui lòng thử lại.") }); }
    finally { lock.current = false; setLoading(false); }
  };
  return <form onSubmit={submit} className={styles.section} aria-label="Thông tin cá nhân" aria-busy={loading}>
    <h2 className={styles.heading}><UserRound />Thông tin cá nhân</h2>
    <div className={styles.avatar}>
      <AdminButton variant="contextual" type="button" className={styles.avatarButton} aria-label="Chọn ảnh đại diện" disabled={loading} onClick={() => setOpen(true)}>
        {avatarSrc && failedAvatar !== avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarSrc} alt="Ảnh đại diện" onError={() => setFailedAvatar(avatarSrc)} />
        ) : <UserRound className="mx-auto" size={24} />}
      </AdminButton>
      <div><AdminButton variant="quiet" type="button" density="compact" disabled={loading} onClick={() => setOpen(true)}><ImagePlus size={14} />Đổi ảnh</AdminButton>
        {avatarUrl && <AdminButton variant="quiet" type="button" density="compact" disabled={loading} onClick={() => setAvatarUrl("")}>Bỏ ảnh</AdminButton>}
        <p className={styles.metadata}>Ảnh hiển thị cùng tài khoản trong hệ thống.</p></div>
    </div>
    <fieldset disabled={loading} className={styles.fields}>
      <AdminManagementField label="Tên hiển thị" name="name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} />
      <AdminManagementField label="Email đăng nhập" type="email" value={user.email} readOnly />
    </fieldset>
    <details className={styles.advanced}><AdminDisclosureSummary>Đường dẫn ảnh nâng cao</AdminDisclosureSummary>
      <AdminManagementField label="URL hoặc mã ảnh" value={avatarUrl} disabled={loading} onChange={event => setAvatarUrl(event.target.value)} />
    </details>
    {feedback && <p role={feedback.error ? "alert" : "status"} data-error={feedback.error} className={styles.feedback}>{feedback.message}</p>}
    <div className={styles.actions}>
      {dirty && <AdminButton variant="quiet" type="button" density="compact" disabled={loading} onClick={() => { setName(saved.name); setAvatarUrl(saved.avatarUrl); setFeedback(null); }}>Hoàn tác</AdminButton>}
      <AdminButton variant="primary" type="submit" density="compact" disabled={loading || !dirty}>{loading ? "Đang lưu…" : "Lưu thay đổi"}</AdminButton>
    </div>
    <MediaBrowserDialog open={open} onClose={() => setOpen(false)} profile="inline" selectedKey={avatarUrl || null} selectedKeys={avatarUrl ? [avatarUrl] : []} onSelect={key => { setAvatarUrl(key); setOpen(false); }} onSubmit={keys => { if (keys[0]) setAvatarUrl(keys[0]); setOpen(false); }} />
  </form>;
}
