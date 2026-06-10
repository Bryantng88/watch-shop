"use client";

import { useEffect, useState, useTransition } from "react";
import { WorkCaseScope, type WorkCaseCategory } from "@prisma/client";
import { createWorkCaseCategoryAction, updateWorkCaseCategoryAction } from "../actions/work-case.actions";
import { WORK_CASE_SCOPE_LABEL } from "../utils/work-case-labels";

function emptyForm() {
  return { code: "", name: "", description: "", scope: WorkCaseScope.BUSINESS, isActive: true, sortOrder: 0 };
}

export default function WorkCaseSettingsClient({ categories }: { categories: WorkCaseCategory[] }) {
  const [items, setItems] = useState(categories);
  const [editing, setEditing] = useState<WorkCaseCategory | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setItems(categories), [categories]);

  function edit(item: WorkCaseCategory) {
    setEditing(item);
    setError(null);
    setForm({
      code: item.code,
      name: item.name,
      description: item.description || "",
      scope: item.scope,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
  }

  function reset() {
    setEditing(null);
    setError(null);
    setForm(emptyForm());
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const payload = { ...form, sortOrder: Number(form.sortOrder || 0) };
        const res = editing
          ? await updateWorkCaseCategoryAction(editing.id, payload)
          : await createWorkCaseCategoryAction(payload);

        if (editing) {
          setItems((prev) => prev.map((x) => x.id === editing.id ? res.item : x));
        } else {
          setItems((prev) => [...prev, res.item]);
        }
        reset();
      } catch (err: any) {
        setError(err?.message || "Không thể lưu nhóm phiếu xử lý.");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-5 px-4 py-6 lg:px-5 xl:px-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Cấu hình phiếu xử lý</h1>
        <p className="mt-1 text-sm text-slate-500">Quản lý nhóm phiếu xử lý theo scope lớn: Business, Service, Payment, Logistic.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="cursor-pointer hover:bg-slate-50" onClick={() => edit(item)}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.code}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    {item.description ? <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">{item.description}</div> : null}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{WORK_CASE_SCOPE_LABEL[item.scope]}</td>
                  <td className="px-4 py-3 text-slate-600">{item.isActive ? "Active" : "Off"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950">{editing ? "Sửa nhóm" : "Thêm nhóm"}</h2>
            {editing ? <button type="button" onClick={reset} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Tạo mới</button> : null}
          </div>

          <div className="mt-4 space-y-3">
            {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
            <label className="block"><span className="text-sm font-medium text-slate-700">Code</span><input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm" /></label>
            <label className="block"><span className="text-sm font-medium text-slate-700">Tên</span><input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm" /></label>
            <label className="block"><span className="text-sm font-medium text-slate-700">Mô tả</span><textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" /></label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block"><span className="text-sm font-medium text-slate-700">Scope</span><select value={form.scope} onChange={(e) => setForm((p) => ({ ...p, scope: e.target.value as WorkCaseScope }))} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">{Object.values(WorkCaseScope).map((item) => <option key={item} value={item}>{WORK_CASE_SCOPE_LABEL[item]}</option>)}</select></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">Sort</span><input type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm" /></label>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active</label>
            <button type="button" disabled={pending} onClick={submit} className="w-full rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Đang lưu..." : "Lưu cấu hình"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
