"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import MediaBrowserDialog, { type SharedMediaProfile } from "@/components/media/MediaBrowserDialog";
import { ADMIN_OPERATION_PAGE_CLASS } from "@/domains/shared/ui/layout/admin-content";

export default function MediaRecycleAdminClient() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<SharedMediaProfile>("cover");
  const [segment, setSegment] = React.useState<"MEN" | "WOMEN" | "UNISEX">("MEN");

  return <main className={ADMIN_OPERATION_PAGE_CLASS}>
    <MediaBrowserDialog
      key={`${profile}-${segment}`}
      open
      onClose={() => router.push("/admin/media")}
      profile={profile}
      audienceSegment={segment}
      selectionMode="multiple"
      enableRecycle
      initialLocation="recycle"
      presentation="page"
      title="Quản lý Recycle Media"
      description="Khu vực độc lập để khôi phục hoặc kiểm tra file đã recycle; không thuộc modal xử lý Watch."
      footerLeadingAction={(
        <div className="flex flex-wrap items-center gap-2">
          <select value={segment} onChange={(event) => setSegment(event.target.value as typeof segment)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
            <option value="MEN">Nam</option>
            <option value="WOMEN">Nữ</option>
            <option value="UNISEX">Unisex</option>
          </select>
          <select value={profile} onChange={(event) => setProfile(event.target.value as SharedMediaProfile)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
            <option value="cover">Cover</option>
            <option value="edit">Gallery/Edit</option>
            <option value="inline">Inline</option>
          </select>
        </div>
      )}
      footerHint="Recycle được quản lý tập trung tại đây. Chọn file để khôi phục về đúng thư viện nguồn."
    />
  </main>;
}
