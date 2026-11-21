"use client";

import { useState, type CSSProperties } from "react";
import { Palette, ShieldCheck } from "lucide-react";
import { AdminManagementPage, AdminManagementField } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { ADMIN_UI_FOUNDATION as f } from "@/domains/shared/ui/admin-design-contract/admin-ui.foundation";
import { useAdminNavigationProfile } from "@/domains/shared/ui/admin-design-contract/AdminNavigationProfile";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import styles from "./ProfileWorkspace.module.css";

export type ProfileUser = { id: string; email: string; name: string | null; avatarUrl: string | null; roles: string[] };
export default function ProfileWorkspace({ user, permissions }: { user: ProfileUser; permissions: { code: string; description: string | null }[] }) {
  const { profile, setProfile } = useAdminNavigationProfile(user.id);
  const [query, setQuery] = useState("");
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
  const visible = permissions.filter(p => normalize(`${p.code} ${p.description ?? ""}`).includes(normalize(query.trim())));
  return <AdminManagementPage title="Thông tin tài khoản"><div className={styles.layout}>
    <aside className={styles.identity} aria-label="Tài khoản hiện tại">
      <strong>{user.name || "Chưa đặt tên"}</strong>
      <span className={styles.metadata}>{user.email}</span>
      <span className={styles.metadata}>{user.roles.join(" · ") || "Chưa gán vai trò"}</span>
    </aside>
    <div className={styles.content}>
      <ProfileForm user={user} />
      <section className={styles.section} aria-labelledby="profile-appearance-title">
        <h2 id="profile-appearance-title" className={styles.heading}><Palette />Giao diện</h2>
        <fieldset><legend className={styles.metadata}>Màu top menu</legend><div className={styles.profiles}>
          {(["simple", "dark"] as const).map(value => <label key={value} className={styles.profile}>
            <input type="radio" name="navigation-profile" value={value} checked={profile === value} onChange={() => setProfile(value)} />
            <span aria-hidden="true" className={styles.swatch} style={{ "--profile-swatch": f.navigationProfiles[value].background } as CSSProperties} />
            <span>{value === "simple" ? "Simple" : "Dark"}<span className={`block ${styles.metadata}`}>{value === "simple" ? "Xám nhẹ" : "Nền tối"}</span></span>
          </label>)}
        </div></fieldset>
        <p className={styles.metadata}>Áp dụng ngay, ghi nhớ cho tài khoản này trên trình duyệt hiện tại.</p>
      </section>
      <ChangePasswordForm />
      <section className={styles.section} aria-labelledby="profile-access-title">
        <h2 id="profile-access-title" className={styles.heading}><ShieldCheck />Quyền truy cập</h2>
        <p className={styles.metadata}>{user.roles.join(" · ") || "Chưa gán vai trò"} · {permissions.length} quyền. Liên hệ quản trị viên để thay đổi quyền.</p>
        <details className={styles.advanced}>
          <AdminDisclosureSummary>Xem danh sách quyền</AdminDisclosureSummary>
          <AdminManagementField label="Tìm quyền" placeholder="Tên quyền hoặc mã quyền…" value={query} onChange={event => setQuery(event.target.value)} />
          <div className={styles.permissionList}>{visible.map(p => <div key={p.code} className={styles.permission}>{p.description || p.code}{p.description && <code>{p.code}</code>}</div>)}</div>
          {!visible.length && <p className={styles.metadata}>Không có quyền phù hợp.</p>}
        </details>
      </section>
    </div>
  </div></AdminManagementPage>;
}
