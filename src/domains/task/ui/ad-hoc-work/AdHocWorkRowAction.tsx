"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, ClipboardPlus, UserRound, X } from "lucide-react";
import type { RowAction } from "@/domains/shared/ui/list/RowActions";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  createAdHocWorkAction,
  listAdHocWorkAssigneesAction,
  type AdHocWorkTarget,
} from "@/domains/task/actions/ad-hoc-work.actions";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

type AssigneeOption = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

function userLabel(user?: AssigneeOption | null) {
  return user?.name || user?.email || "Người dùng";
}

function UserAvatar({ user }: { user?: AssigneeOption | null }) {
  const src = resolveMediaPreviewSrc(user?.avatarUrl);
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={userLabel(user)} className="h-full w-full object-cover" />
      ) : <UserRound className="h-3.5 w-3.5" />}
    </span>
  );
}

export function useAdHocWorkRowAction<T>(
  getTarget: (row: T) => AdHocWorkTarget,
): { action: RowAction<T>; modal: ReactNode } {
  const [target, setTarget] = useState<AdHocWorkTarget | null>(null);
  const [request, setRequest] = useState("");
  const [detail, setDetail] = useState("");
  const [users, setUsers] = useState<AssigneeOption[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const progress = useAppProgress();
  const notify = useNotify();
  const selectedAssignee = useMemo(
    () => users.find((user) => user.id === assigneeId) ?? null,
    [assigneeId, users],
  );

  useEffect(() => {
    if (!target || users.length) return;
    let active = true;
    setUsersLoading(true);
    void listAdHocWorkAssigneesAction()
      .then((result) => {
        if (!active) return;
        setUsers(result.users);
        setCurrentUserId(result.currentUserId);
        setAssigneeId(result.currentUserId);
      })
      .catch((error) => {
        if (!active) return;
        notify.error({
          title: "Không thể tải danh sách người xử lý",
          message: error instanceof Error ? error.message : "Có lỗi không xác định.",
        });
      })
      .finally(() => {
        if (active) setUsersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [notify, target, users.length]);

  function close() {
    if (pending) return;
    setTarget(null);
    setRequest("");
    setDetail("");
    setAssigneeId(currentUserId);
    setAssigneeOpen(false);
  }

  async function submit() {
    if (!target || !request.trim() || pending) return;
    setPending(true);
    progress.show({
      title: "Đang tạo việc phát sinh",
      message: target.title,
    });
    try {
      await createAdHocWorkAction({
        request,
        detail: detail || null,
        assignedToUserId: assigneeId || null,
        target,
      });
      notify.success({
        title: "Đã tạo việc phát sinh",
        message: "Công việc đã được đưa vào Space Vận hành.",
      });
      close();
    } catch (error) {
      notify.error({
        title: "Không thể tạo việc phát sinh",
        message: error instanceof Error ? error.message : "Có lỗi không xác định.",
      });
    } finally {
      progress.hide();
      setPending(false);
      setTarget(null);
      setRequest("");
      setDetail("");
      setAssigneeId(currentUserId);
      setAssigneeOpen(false);
    }
  }

  const modal = target && typeof document !== "undefined"
    ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-950">Tạo việc phát sinh</h2>
                <p className="mt-1 text-sm text-slate-500">{target.title}{target.ref ? ` · ${target.ref}` : ""}</p>
              </div>
              <button type="button" onClick={close} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Yêu cầu <span className="text-rose-500">*</span></span>
                <input autoFocus value={request} onChange={(event) => setRequest(event.target.value)} placeholder="Ví dụ: Gửi mẫu này cho khách xem" className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </label>
              <div className="relative">
                <span className="text-sm font-medium text-slate-700">Người xử lý</span>
                <button
                  type="button"
                  onClick={() => setAssigneeOpen((open) => !open)}
                  disabled={usersLoading}
                  className="mt-1 flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 px-3 text-left text-sm outline-none hover:border-violet-300 disabled:bg-slate-50"
                >
                  {selectedAssignee ? <UserAvatar user={selectedAssignee} /> : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100"><UserRound className="h-3.5 w-3.5 text-slate-400" /></span>}
                  <span className="min-w-0 flex-1 truncate">
                    {usersLoading ? "Đang tải…" : selectedAssignee ? userLabel(selectedAssignee) : "Chưa gán"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                {assigneeOpen ? (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                    <button type="button" onClick={() => { setAssigneeId(""); setAssigneeOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100"><UserRound className="h-3.5 w-3.5 text-slate-400" /></span>
                      <span className="flex-1">Chưa gán</span>
                      {!assigneeId ? <Check className="h-4 w-4 text-violet-600" /> : null}
                    </button>
                    {users.map((user) => (
                      <button key={user.id} type="button" onClick={() => { setAssigneeId(user.id); setAssigneeOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-violet-50">
                        <UserAvatar user={user} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-slate-800">{userLabel(user)}</span>
                          {user.name && user.email ? <span className="block truncate text-xs text-slate-400">{user.email}</span> : null}
                        </span>
                        {assigneeId === user.id ? <Check className="h-4 w-4 text-violet-600" /> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
                <p className="mt-1 text-xs text-slate-400">Người được gán chỉ nhận quyền truy cập vào đúng việc này.</p>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Chi tiết</span>
                <textarea value={detail} onChange={(event) => setDetail(event.target.value)} rows={4} placeholder="Thông tin cần thiết để người nhận xử lý…" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button type="button" onClick={close} disabled={pending} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Hủy</button>
              <button type="button" onClick={submit} disabled={pending || !request.trim()} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Tạo việc</button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return {
    action: {
      key: "create-ad-hoc-work",
      label: "Tạo việc phát sinh",
      icon: <ClipboardPlus className="h-4 w-4" />,
      onClick: (row) => setTarget(getTarget(row)),
      separatorBefore: true,
    },
    modal,
  };
}
