"use client";

import { useState, useTransition } from "react";
import { X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  savePersonalWorkCategoryAction,
  deletePersonalWorkCategoryAction,
} from "../actions/personal-work.actions";
import {
  personalCategoryStyle,
  type PersonalWorkCategory,
} from "../shared/personal-work.types";

function CategoryEditor({
  category,
  onSave,
  onDelete,
  pending,
}: {
  category: PersonalWorkCategory;
  onSave: (input: { key: string; label: string; color: string }) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const [label, setLabel] = useState(category.label);
  const [color, setColor] = useState(category.color);
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 py-3">
      <input
        aria-label={`Màu ${category.label}`}
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        disabled={pending}
        className="h-9 w-10 cursor-pointer rounded border border-slate-200 bg-white p-1"
      />
      <input
        aria-label={`Tên ${category.label}`}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        disabled={category.isDefault || pending}
        maxLength={60}
        className="h-9 min-w-0 flex-1 rounded border border-slate-200 px-2 text-sm disabled:bg-slate-50"
      />
      {category.isDefault && (
        <span className="text-[10px] text-slate-500">Mặc định</span>
      )}
      <button
        type="button"
        disabled={
          pending || (label === category.label && color === category.color)
        }
        onClick={() => onSave({ key: category.key, label, color })}
        className="rounded px-3 py-2 text-xs font-semibold text-blue-700 disabled:opacity-40"
      >
        Lưu
      </button>
      {!category.isDefault && (
        <button
          type="button"
          aria-label={`Xóa ${category.label}`}
          disabled={pending}
          onClick={onDelete}
          className="rounded p-2 text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <div
        className="w-full rounded px-2 py-1.5 text-xs"
        style={personalCategoryStyle(color)}
      >
        {label || "Tên loại công việc"} · Công việc mẫu
      </div>
    </div>
  );
}

export function PersonalWorkCategoryManager({
  categories,
  onClose,
}: {
  categories: PersonalWorkCategory[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#64748b");
  const [deleting, setDeleting] = useState<PersonalWorkCategory | null>(null);
  const [replacement, setReplacement] = useState("GENERAL");
  function run(
    action: () => Promise<unknown>,
    message: string,
    done?: () => void,
  ) {
    setError("");
    setNotice("");
    startTransition(async () => {
      try {
        await action();
        setNotice(message);
        done?.();
        router.refresh();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Không thể lưu loại công việc",
        );
      }
    });
  }
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-sm"
      onKeyDown={(e) => {
        if (e.key === "Escape" && !pending) onClose();
        if (e.key === "Tab") {
          const controls = Array.from(
            e.currentTarget.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input:not(:disabled), select:not(:disabled)",
            ),
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
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
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="category-manager-title" className="text-lg font-bold">
              Quản lý loại công việc
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Danh mục của bạn. Loại mặc định được đổi màu; loại tự tạo được sửa
              tên và xóa.
            </p>
          </div>
          <button
            autoFocus
            type="button"
            aria-label="Đóng quản lý loại công việc"
            disabled={pending}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-3 rounded bg-rose-50 p-2 text-sm text-rose-700"
          >
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-3 text-sm text-emerald-700">
            {notice}
          </p>
        )}
        {deleting ? (
          <div className="mt-4 space-y-3 rounded-lg border border-rose-200 p-4">
            <h3 className="font-semibold">Xóa “{deleting.label}”?</h3>
            <p className="text-sm text-slate-600">
              Các công việc đang dùng loại này sẽ được chuyển sang loại bạn chọn
              bên dưới, kể cả công việc đã chia sẻ.
            </p>
            <label className="block text-xs font-semibold">
              Chuyển công việc sang
              <select
                aria-label="Loại thay thế"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                className="mt-1 h-10 w-full rounded border px-2"
              >
                {categories
                  .filter((c) => c.key !== deleting.key)
                  .map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
              </select>
            </label>
            <div className="flex gap-2">
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
                    "Đã xóa loại và chuyển công việc",
                    () => setDeleting(null),
                  )
                }
                className="rounded bg-rose-600 px-3 py-2 text-sm text-white"
              >
                Xóa và chuyển
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => setDeleting(null)}
                className="rounded border px-3 py-2 text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-3">
              {categories.map((category) => (
                <CategoryEditor
                  key={`${category.key}:${category.label}:${category.color}`}
                  category={category}
                  pending={pending}
                  onSave={(input) =>
                    run(
                      () => savePersonalWorkCategoryAction(input),
                      "Đã lưu loại công việc",
                    )
                  }
                  onDelete={() => {
                    setDeleting(category);
                    setReplacement("GENERAL");
                    setError("");
                    setNotice("");
                  }}
                />
              ))}
            </div>
            <form
              className="mt-5 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(
                  () => savePersonalWorkCategoryAction({ label, color }),
                  "Đã thêm loại công việc",
                  () => setLabel(""),
                );
              }}
            >
              <h3 className="text-sm font-semibold">Thêm loại mới</h3>
              <div className="flex gap-2">
                <input
                  type="color"
                  aria-label="Màu loại mới"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  disabled={pending}
                  className="h-10 w-11 rounded border bg-white p-1"
                />
                <input
                  required
                  maxLength={60}
                  aria-label="Tên loại mới"
                  placeholder="Ví dụ: Học tập, Gia đình…"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  disabled={pending}
                  className="h-10 min-w-0 flex-1 rounded border px-3 text-sm"
                />
                <button
                  type="submit"
                  disabled={pending || !label.trim()}
                  className="rounded bg-slate-950 px-3 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Thêm
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
