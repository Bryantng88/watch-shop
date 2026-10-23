"use client";

import { Share2, X } from "lucide-react";
import { AdminUserAvatar } from "@/domains/shared/ui/admin-design-contract";
import type { PersonalWorkShare, PersonalWorkUser } from "../shared/personal-work.types";

type Props = {
  users: PersonalWorkUser[];
  shares: PersonalWorkShare[];
  onChange: (shares: PersonalWorkShare[]) => void;
  disabled?: boolean;
};

export function PersonalWorkShareEditor({ users, shares, onChange, disabled }: Props) {
  const available = users.filter((user) => !shares.some((share) => share.user.id === user.id));

  return (
    <section className="space-y-3 rounded-xl bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Share2 className="h-4 w-4 text-violet-600" /> Chia sẻ công việc
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Người nhận chỉ thấy công việc được chia sẻ. Lịch Google của họ không tự động thay đổi.
          </p>
        </div>
        <select
          aria-label="Thêm người được chia sẻ"
          disabled={disabled || available.length === 0}
          value=""
          onChange={(event) => {
            const user = users.find((candidate) => candidate.id === event.target.value);
            if (user) onChange([...shares, { user, accessLevel: "VIEWER" }]);
          }}
          className="h-9 max-w-52 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
        >
          <option value="">{available.length > 0 ? "+ Thêm người" : "Chưa có người dùng khác"}</option>
          {available.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
      </div>
      {shares.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {shares.map((share) => (
            <div key={share.user.id} className="flex items-center gap-3 py-2.5">
              <AdminUserAvatar user={share.user} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{share.user.name || share.user.email}</p>
                {share.user.name && <p className="truncate text-xs text-slate-500">{share.user.email}</p>}
              </div>
              <select
                disabled={disabled}
                value={share.accessLevel}
                onChange={(event) =>
                  onChange(
                    shares.map((item) =>
                      item.user.id === share.user.id
                        ? { ...item, accessLevel: event.target.value as "VIEWER" | "EDITOR" }
                        : item,
                    ),
                  )
                }
                className="h-8 rounded-lg border-0 bg-white px-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-200"
              >
                <option value="VIEWER">Chỉ xem</option>
                <option value="EDITOR">Có thể sửa</option>
              </select>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(shares.filter((item) => item.user.id !== share.user.id))}
                aria-label={`Bỏ chia sẻ với ${share.user.name || share.user.email}`}
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-1 text-xs text-slate-400">
          {users.length > 0
            ? "Công việc này chưa được chia sẻ."
            : "Chưa có người dùng đang hoạt động khác để chia sẻ công việc."}
        </p>
      )}
    </section>
  );
}
