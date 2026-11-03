"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { intakePlanSchema } from "../intake-schema";

type Person = { id: string; name: string | null };
type ResultTask = { id: string; title: string; department: string; assignedToUserId: string; reused: boolean };
type Intake = { id: string; requestText: string; status: string; errorCode: string | null; planJson: unknown; resultJson: { tasks?: ResultTask[]; lookups?: { tool: string; at: string }[] } | null; createdAt: string };
const departmentLabels = { SALES: "Sale theo dõi", TECHNICAL: "Kỹ thuật xác minh", OPERATION: "Phụ kiện / vận hành" };
const pendingStatus = (status: string) => ["QUEUED", "RUNNING"].includes(status);

export default function SalesIntakePanel() {
  const [text, setText] = useState("");
  const [routing, setRouting] = useState({ SALES: "", TECHNICAL: "", OPERATION: "" });
  const [people, setPeople] = useState<Person[]>([]);
  const [requests, setRequests] = useState<Intake[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const key = useRef<string | null>(null);
  const pending = useRef(false);
  const load = useCallback(async (signal?: AbortSignal) => {
    const response = await fetch("/api/admin/sales-intake", { cache: "no-store", signal });
    const data = await response.json();
    if (!response.ok) throw Error(data.error || "Không tải được yêu cầu.");
    setPeople(data.people);
    setRouting(current => current.SALES ? current : { ...current, SALES: data.userId });
    setRequests(data.requests);
    pending.current = data.requests.some((row: Intake) => pendingStatus(row.status));
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const update = () => load(controller.signal).catch(error => { if (!controller.signal.aborted) setError(error.message); });
    void update();
    const timer = setInterval(() => { if (pending.current) void update(); }, 5000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [load]);
  async function submit() {
    setBusy(true); setError("");
    if (!key.current) key.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/admin/sales-intake", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ requestKey: key.current, text, routing: { SALES: routing.SALES, TECHNICAL: routing.TECHNICAL || null, OPERATION: routing.OPERATION || null } }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Không gửi được yêu cầu.");
      key.current = null; setText(""); pending.current = true;
      await load();
    } catch (error) { setError(error instanceof Error ? error.message : "Không gửi được yêu cầu."); }
    finally { setBusy(false); }
  }
  async function cancel(id: string) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/sales-intake", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Không hủy được yêu cầu.");
      await load();
    } catch (error) { setError(error instanceof Error ? error.message : "Không hủy được yêu cầu."); }
    finally { setBusy(false); }
  }
  return <section className="mx-4 mb-5 space-y-4 rounded-xl border border-indigo-200 bg-white p-5" aria-label="Tiếp nhận tư vấn bằng AI">
    <div><h2 className="text-lg font-semibold text-slate-950">Tiếp nhận tư vấn bằng AI</h2><p className="mt-1 text-sm text-slate-600">Nhập tối đa 3 yêu cầu. AI tra cứu dữ liệu rồi tự tạo việc theo dõi và thông báo trong web khi đủ thông tin.</p></div>
    <textarea aria-label="Các yêu cầu tư vấn của khách" value={text} disabled={busy} onChange={event => { setText(event.target.value); key.current = null; }} maxLength={6000} rows={4} className="w-full rounded-lg border p-3 text-sm" placeholder="Khách Nguyễn A (mã khách hoặc số điện thoại chính xác) quan tâm watch SKU XXX; có thể mua nếu có hai mắt dây phù hợp. Nhờ kiểm tra và theo dõi phản hồi." />
    <div className="grid gap-3 md:grid-cols-3">{(Object.keys(departmentLabels) as (keyof typeof departmentLabels)[]).map(department => <label key={department} className="space-y-1 text-xs font-medium text-slate-600">{departmentLabels[department]}<select aria-label={departmentLabels[department]} value={routing[department]} disabled={busy} onChange={event => { setRouting(current => ({ ...current, [department]: event.target.value })); key.current = null; }} className="block w-full rounded border bg-white p-2 text-sm"><option value="">Chọn người nhận</option>{people.map(person => <option key={person.id} value={person.id}>{person.name || "Nhân viên"} · {person.id.slice(0, 8)}</option>)}</select></label>)}</div>
    <p className="text-xs text-slate-500">Chọn người nhận cho các bộ phận có thể cần xử lý. Thiếu người nhận, khách/watch không rõ hoặc có việc thủ công cần đối chiếu thì AI sẽ hỏi lại. Chỉ gửi dữ liệu cần thiết; nội dung nhập và kết quả tra cứu được chuyển tới Codex.</p>
    <button type="button" disabled={busy || text.trim().length < 10 || !routing.SALES} onClick={submit} className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Đang gửi…" : "Tra cứu và tự tạo việc nội bộ"}</button>
    <p className="text-xs text-slate-500">Không tạo đơn, giữ hàng, đặt mua, cam kết giá hoặc gửi tin khách. Hạn xử lý chưa tự suy ra từ câu chữ; người phụ trách đặt hạn trong công việc.</p>
    {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
    <div className="space-y-3">{requests.map(row => {
      const parsed = intakePlanSchema.safeParse(row.planJson);
      const tasks = row.resultJson?.tasks ?? [];
      return <article key={row.id} className="space-y-2 rounded-lg border p-3 text-sm">
        <div className="flex flex-wrap justify-between gap-2"><strong>{row.status === "APPLIED" ? "Đã xử lý yêu cầu" : row.status === "NEEDS_INFO" ? "Cần bổ sung thông tin" : row.status === "CANCELLED" ? "Đã hủy yêu cầu" : row.status === "FAILED" ? "Chưa hoàn tất" : row.status === "RUNNING" ? "AI đang tra cứu…" : "Đang chờ worker…"}</strong><span className="text-xs text-slate-500">{new Date(row.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Bangkok" })}</span></div>
        <p className="whitespace-pre-wrap text-slate-600">{row.requestText}</p>
        {pendingStatus(row.status) && <button type="button" disabled={busy} onClick={() => cancel(row.id)} className="text-xs font-semibold text-rose-700 underline">Hủy yêu cầu đang chờ/xử lý</button>}
        {parsed.success && <p>{parsed.data.summary}</p>}
        {row.status === "NEEDS_INFO" && parsed.success && <div className="rounded bg-amber-50 p-3"><ul className="list-disc space-y-1 pl-4">{parsed.data.questions.map((question, index) => <li key={index}>{question}</li>)}</ul><p className="mt-2">Chưa tạo việc cho yêu cầu này.</p><button type="button" disabled={busy} onClick={() => { setText(row.requestText + "\nBổ sung: "); key.current = null; }} className="mt-2 font-semibold underline">Bổ sung và gửi lại</button></div>}
        {row.status === "FAILED" && <p role="alert" className="text-amber-700">Worker chưa hoàn tất ({row.errorCode || "UNKNOWN"}). Kiểm tra cấu hình/worker rồi gửi lại; lỗi không tự chạy lại yêu cầu.</p>}
        {row.status === "APPLIED" && <><p>{tasks.filter(task => !task.reused).length} việc mới · {tasks.filter(task => task.reused).length} việc đang mở được dùng lại.</p><ul className="space-y-1">{tasks.map(task => <li key={task.id}><span className="font-medium">{task.title}</span> · {departmentLabels[task.department as keyof typeof departmentLabels] || task.department} · {people.find(person => person.id === task.assignedToUserId)?.name || "Người phụ trách"} {task.reused ? "(dùng lại, đã bổ sung thông tin; không thông báo lại)" : "(đã tạo và thông báo nội bộ)"}</li>)}</ul><a href="/admin/coordination/operation?view=ad-hoc-work" className="inline-block font-semibold text-indigo-700 underline">Mở hàng đợi Việc phát sinh</a></>}
        {row.resultJson?.lookups?.length ? <details className="text-xs text-slate-500"><summary>Đã tra cứu {row.resultJson.lookups.length} lượt</summary><ul>{row.resultJson.lookups.map((entry, index) => <li key={index}>{entry.tool} · {new Date(entry.at).toLocaleTimeString("vi-VN", { timeZone: "Asia/Bangkok" })}</li>)}</ul></details> : null}
      </article>;
    })}</div>
  </section>;
}
