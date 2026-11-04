"use client";
import { Sparkles } from "lucide-react";
export default function AssistantEntry() {
  return <div className="mx-4 mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-white p-4"><div><h2 className="font-semibold">Trợ lý AI ngay trong công việc</h2><p className="mt-1 text-sm text-slate-500">Trao đổi, làm rõ nhu cầu và duyệt phương án phối hợp trong panel chung. Phiên bản local sử dụng dữ liệu mẫu.</p></div><button onClick={() => window.dispatchEvent(new Event("open-local-ai-assistant"))} className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white"><Sparkles size={17}/>Mở trợ lý AI</button></div>;
}
