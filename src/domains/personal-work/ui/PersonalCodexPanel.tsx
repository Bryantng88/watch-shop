"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PersonalWorkItem, PersonalWorkPageData } from "../shared/personal-work.types";
import { cancelPersonalCodexRunAction, requestPersonalCodexRunAction } from "../actions/personal-work.actions";
const LABELS = { QUEUED: "Đang chờ Codex", RUNNING: "Codex đang thực hiện", SUCCEEDED: "Có kết quả để review", FAILED: "Chạy không thành công", CANCELLED: "Đã hủy", TIMED_OUT: "Đã hết thời gian" };
export default function PersonalCodexPanel({ item, configuration }: { item: PersonalWorkItem; configuration: PersonalWorkPageData["codex"] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tagged = item.tags.some(tag => tag.trim().toLowerCase() === "codex");
  const active = item.codexRun && ["QUEUED", "RUNNING"].includes(item.codexRun.status);
  useEffect(() => { if (!active) return; const timer = setInterval(() => router.refresh(), 5000); return () => clearInterval(timer); }, [active, router]);
  if (!tagged && !item.codexRun) return null;
  const canRequest = item.access === "OWNER" && configuration?.canDispatch && configuration.ready && tagged && ["TODO", "IN_PROGRESS"].includes(item.status);
  async function run(cancel: boolean) {
    setPending(true); setError(null);
    try {
      if (cancel && item.codexRun) await cancelPersonalCodexRunAction(item.codexRun.id);
      else await requestPersonalCodexRunAction({ taskItemId: item.id, retry: Boolean(item.codexRun) });
      router.refresh();
    } catch { setError("Không thể cập nhật lượt chạy Codex. Kiểm tra cấu hình hoặc thử lại."); }
    finally { setPending(false); }
  }
  return <section className="mt-4 space-y-2 rounded-xl border border-violet-200 bg-violet-50/50 p-4">
    <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold">Codex</h3><span className="text-xs">{item.codexRun ? LABELS[item.codexRun.status] : "Chưa gửi thực hiện"}</span></div>
    {!configuration?.ready && <p className="text-xs text-slate-600">{configuration?.reason || "Chưa cấu hình worker Codex"}</p>}
    {item.codexRun?.summary && <p className="whitespace-pre-wrap text-sm text-slate-700">{item.codexRun.summary}</p>}
    {item.codexRun?.resultUrl && <a href={item.codexRun.resultUrl} target="_blank" rel="noreferrer" className="block text-sm font-semibold text-violet-700 underline">Mở draft PR / kết quả</a>}
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    {item.access === "OWNER" && active ? <button type="button" disabled={pending} onClick={() => void run(true)} className="rounded-lg border px-3 py-2 text-xs">Hủy lượt chạy</button> : canRequest && <button type="button" disabled={pending} onClick={() => void run(false)} className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white">{pending ? "Đang gửi…" : item.codexRun ? "Chạy lại Codex" : "Gửi Codex thực hiện"}</button>}
    {(item.codexRuns?.length ?? 0) > 1 && <details className="text-xs text-slate-600"><summary>Lịch sử các lượt chạy</summary><ul className="mt-2 space-y-1">{item.codexRuns?.map(run => <li key={run.id}>{new Date(run.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Bangkok" })} · {LABELS[run.status]} {run.resultUrl && <a href={run.resultUrl} target="_blank" rel="noreferrer" className="text-violet-700 underline">PR</a>}</li>)}</ul></details>}
    <p className="text-[11px] text-slate-500">Kết quả cần được review. Codex không tự merge hoặc triển khai production.</p>
  </section>;
}
