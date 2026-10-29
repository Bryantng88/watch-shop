"use client";

import { useState, useTransition } from "react";
import { X, Trash2, Pencil, Plus, LockKeyhole, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  savePersonalWorkCategoryAction,
  deletePersonalWorkCategoryAction,
} from "../actions/personal-work.actions";
import {
  personalCategoryStyle,
  type PersonalWorkCategory,
} from "../shared/personal-work.types";

const COLORS = [
  "#64748b",
  "#6366f1",
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#ec4899",
];

export function PersonalWorkCategoryManager({
  categories,
  canManageDefaults,
  onClose,
}: {
  categories: PersonalWorkCategory[];
  canManageDefaults: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<{
    key?: string;
    label: string;
    color: string;
    isDefault: boolean;
  } | null>(null);
  const [deleting, setDeleting] = useState<PersonalWorkCategory | null>(null);
  const [replacement, setReplacement] = useState("GENERAL");
  const custom = categories.filter((c) => !c.isDefault);

  function run(action: () => Promise<unknown>, message: string) {
    setError("");
    setNotice("");
    startTransition(async () => {
      try {
        await action();
        setEditing(null);
        setDeleting(null);
        setNotice(message);
        router.refresh();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Không thể lưu loại công việc",
        );
      }
    });
  }
  function edit(category?: PersonalWorkCategory) {
    setEditing(category ?? { label: "", color: COLORS[0], isDefault: false });
    setDeleting(null);
    setError("");
    setNotice("");
  }
  function row(category: PersonalWorkCategory) {
    const editable = !category.isDefault || canManageDefaults;
    return (
      <div
        key={category.key}
        className={`group flex min-h-10 items-center gap-3 rounded-lg px-2 ${editing?.key === category.key ? "bg-slate-100" : "hover:bg-slate-50"}`}
      >
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
          {category.label}
        </span>
        {editable ? (
          <button
            type="button"
            aria-label={`Sửa ${category.label}`}
            title={
              category.isDefault
                ? "Đổi màu cho tất cả người dùng"
                : "Sửa loại công việc"
            }
            disabled={pending}
            onClick={() => edit(category)}
            className="rounded p-1.5 text-slate-400 hover:bg-white hover:text-slate-900"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        ) : (
          <LockKeyhole
            aria-label="Chỉ admin được đổi màu"
            className="mr-1.5 h-3.5 w-3.5 text-slate-300"
          />
        )}
        {!category.isDefault && (
          <button
            type="button"
            aria-label={`Xóa ${category.label}`}
            disabled={pending}
            onClick={() => {
              setDeleting(category);
              setEditing(null);
              setReplacement("GENERAL");
              setError("");
              setNotice("");
            }}
            className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/20 p-4 backdrop-blur-[2px]"
      onKeyDown={(e) => {
        if (e.key === "Escape" && !pending) {
          e.stopPropagation();
          onClose();
        }
        if (e.key === "Tab") {
          const controls = Array.from(
            e.currentTarget.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input:not(:disabled), select:not(:disabled)",
            ),
          );
          const first = controls[0],
            last = controls[controls.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-manager-title"
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-950/10"
      >
        <header className="flex items-center justify-between gap-3 px-5 pb-3 pt-5">
          <h2
            id="category-manager-title"
            className="text-base font-semibold text-slate-950"
          >
            Loại công việc
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => edit()}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm loại
            </button>
            <button
              autoFocus
              type="button"
              aria-label="Đóng quản lý loại công việc"
              disabled={pending}
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>
        <div className="overflow-y-auto px-5 pb-4">
          <div className="mb-1 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Mặc định</span>
            <span className="font-normal normal-case tracking-normal">
              Dùng chung · Chỉ admin đổi màu
            </span>
          </div>
          {categories.filter((c) => c.isDefault).map(row)}
          <div className="mb-1 mt-4 border-t border-slate-100 px-2 pt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Của tôi {custom.length > 0 && `· ${custom.length}`}
          </div>
          {custom.length ? (
            custom.map(row)
          ) : (
            <p className="px-2 py-2 text-xs text-slate-400">
              Chưa có loại riêng. Thêm loại để sắp xếp theo cách của bạn.
            </p>
          )}
          {editing && (
            <form
              className="mt-3 space-y-3 rounded-xl bg-slate-50 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                run(
                  () =>
                    savePersonalWorkCategoryAction({
                      key: editing.key,
                      label: editing.label,
                      color: editing.color,
                    }),
                  editing.key ? "Đã lưu thay đổi" : "Đã thêm loại công việc",
                );
              }}
            >
              <h3 className="text-xs font-semibold text-slate-800">
                {editing.isDefault
                  ? `Đổi màu ${editing.label}`
                  : editing.key
                    ? "Chỉnh sửa loại riêng"
                    : "Thêm loại riêng"}
              </h3>
              {!editing.isDefault && (
                <input
                  autoFocus
                  required
                  maxLength={60}
                  aria-label="Tên loại công việc"
                  placeholder="Tên loại, ví dụ: Học tập"
                  value={editing.label}
                  onChange={(e) =>
                    setEditing({ ...editing, label: e.target.value })
                  }
                  disabled={pending}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              )}
              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Chọn màu"
              >
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    disabled={pending}
                    aria-label={`Chọn màu ${color}`}
                    aria-pressed={editing.color === color}
                    onClick={() => setEditing({ ...editing, color })}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${editing.color === color ? "ring-2 ring-slate-400 ring-offset-2" : ""}`}
                    style={{ backgroundColor: color }}
                  >
                    {editing.color === color && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </button>
                ))}
                <label className="relative flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 text-[10px] text-slate-500">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: editing.color }}
                  />
                  Màu khác
                  <input
                    type="color"
                    aria-label="Màu tùy chọn"
                    value={editing.color}
                    disabled={pending}
                    onChange={(e) =>
                      setEditing({ ...editing, color: e.target.value })
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span
                  className="max-w-[55%] truncate rounded-md px-2 py-1.5 text-xs"
                  style={personalCategoryStyle(editing.color)}
                >
                  {editing.label || "Công việc của bạn"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      setEditing(null);
                      setError("");
                    }}
                    className="px-2 py-1.5 text-xs text-slate-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={pending || !editing.label.trim()}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    {pending ? "Đang lưu…" : "Lưu"}
                  </button>
                </div>
              </div>
              {editing.isDefault && (
                <p className="text-[10px] text-slate-500">
                  Màu này áp dụng cho tất cả người dùng.
                </p>
              )}
            </form>
          )}
          {deleting && (
            <div className="mt-3 space-y-3 rounded-xl bg-rose-50/60 p-3">
              <h3 className="text-xs font-semibold text-slate-800">
                Xóa “{deleting.label}”?
              </h3>
              <p className="text-xs text-slate-500">
                Chuyển các task đang dùng sang loại khác trước khi xóa.
              </p>
              <select
                aria-label="Loại thay thế"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                disabled={pending}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"
              >
                {categories
                  .filter((c) => c.key !== deleting.key)
                  .map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setDeleting(null);
                    setError("");
                  }}
                  className="px-2 py-1.5 text-xs text-slate-500"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    run(
                      () =>
                        deletePersonalWorkCategoryAction({
                          key: deleting.key,
                          replacementKey: replacement,
                        }),
                      "Đã chuyển task và xóa loại",
                    )
                  }
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Xóa và chuyển
                </button>
              </div>
            </div>
          )}
          {error && (
            <p role="alert" className="mt-3 text-xs text-rose-600">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="mt-3 text-xs text-emerald-700">
              {notice}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
