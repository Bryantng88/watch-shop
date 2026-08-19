"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, ReceiptText, X } from "lucide-react";

type Option = { id: string; name: string | null; email?: string | null; code?: string; description?: string | null };

export default function StandaloneExpensePaymentModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}) {
  const [kind, setKind] = useState<"SALARY" | "OPERATING_EXPENSE">("SALARY");
  const [users, setUsers] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [payeeUserId, setPayeeUserId] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [financeChannel, setFinanceChannel] = useState("UNISEX");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [markPaidNow, setMarkPaidNow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetch("/api/admin/payments/expenses", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || "Không tải được dữ liệu khoản chi.");
        setUsers(Array.isArray(body.users) ? body.users : []);
        setCategories(Array.isArray(body.categories) ? body.categories : []);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Không tải được dữ liệu."))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  async function submit() {
    setError(null);
    const numericAmount = Number(amount.replaceAll(".", "").replaceAll(",", ""));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError("Vui lòng nhập số tiền hợp lệ.");
    if (kind === "SALARY" && !payeeUserId) return setError("Vui lòng chọn nhân sự nhận lương.");
    if (kind === "OPERATING_EXPENSE" && !expenseCategoryId) return setError("Vui lòng chọn loại chi phí.");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/payments/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, amount: numericAmount, method, financeChannel, payeeUserId, expenseCategoryId, payeeName, reference, note, markPaidNow }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Không thể tạo khoản chi.");
      setAmount(""); setReference(""); setNote(""); setPayeeName(""); setMarkPaidNow(false);
      await onCreated();
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể tạo khoản chi.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-500";
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4">
    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><ReceiptText className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-950">Tạo khoản chi ngoài luồng</h2><p className="mt-1 text-xs text-slate-500">Ghi nhận lương hoặc chi phí vận hành vào Payment.</p></div></div>
        <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><X className="h-5 w-5" /></button>
      </div>
      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          {([['SALARY','Trả lương'],['OPERATING_EXPENSE','Chi phí khác']] as const).map(([value,label]) => <button key={value} type="button" onClick={() => setKind(value)} className={`h-10 rounded-lg text-sm font-semibold ${kind === value ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>{label}</button>)}
        </div>
        {loading ? <div className="flex h-24 items-center justify-center text-sm text-slate-500"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Đang tải...</div> : <>
          {kind === "SALARY" ? <label className="block text-xs font-semibold text-slate-600">Nhân sự nhận lương<select value={payeeUserId} onChange={(e) => setPayeeUserId(e.target.value)} className={`${fieldClass} mt-1.5`}><option value="">Chọn user</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name || user.email} {user.name && user.email ? `· ${user.email}` : ''}</option>)}</select></label>
          : <><label className="block text-xs font-semibold text-slate-600">Loại chi phí<select value={expenseCategoryId} onChange={(e) => setExpenseCategoryId(e.target.value)} className={`${fieldClass} mt-1.5`}><option value="">Chọn loại chi phí</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="block text-xs font-semibold text-slate-600">Người / đơn vị nhận (không bắt buộc)<input value={payeeName} onChange={(e) => setPayeeName(e.target.value)} className={`${fieldClass} mt-1.5`} placeholder="Ví dụ: Chủ nhà, Điện lực..." /></label></>}
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-600">Số tiền<input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" className={`${fieldClass} mt-1.5`} placeholder="0" /></label><label className="block text-xs font-semibold text-slate-600">Phương thức<select value={method} onChange={(e) => setMethod(e.target.value)} className={`${fieldClass} mt-1.5`}><option value="BANK_TRANSFER">Chuyển khoản</option><option value="CASH">Tiền mặt</option><option value="CARD">Thẻ</option></select></label></div>
          <label className="block text-xs font-semibold text-slate-600">Kênh ghi nhận<select value={financeChannel} onChange={(e) => setFinanceChannel(e.target.value)} className={`${fieldClass} mt-1.5`}><option value="MEN">Watch Nam</option><option value="WOMEN">Watch Nữ</option><option value="UNISEX">Dùng chung (chia đều Nam / Nữ)</option></select></label>
          <label className="block text-xs font-semibold text-slate-600">Mã tham chiếu<input value={reference} onChange={(e) => setReference(e.target.value)} className={`${fieldClass} mt-1.5`} placeholder="Mã giao dịch / chứng từ" /></label>
          <label className="block text-xs font-semibold text-slate-600">Ghi chú<textarea value={note} onChange={(e) => setNote(e.target.value)} className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-slate-500" /></label>
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={markPaidNow} onChange={(e) => setMarkPaidNow(e.target.checked)} />Đã chi tiền ngay</label>
        </>}
        {error ? <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div> : null}
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold">Hủy</button><button type="button" disabled={loading || submitting} onClick={() => void submit()} className="h-10 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white disabled:opacity-50">{submitting ? "Đang tạo..." : "Tạo khoản chi"}</button></div>
    </div>
  </div>;
}
