import type { Message } from "./simulation";
export default function RepositorySources({ sources }: { sources: NonNullable<Message["repositorySources"]> }) {
  if(!sources.length)return null;
  return <section aria-label="Nguồn mã đã đọc" className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-slate-600"><p className="font-semibold text-slate-700">Watch Shop · Chỉ đọc · {sources[0].commitSha.slice(0,8)}</p><ul className="mt-2 space-y-1">{sources.map((source,i)=><li key={i}>{source.url?<a href={source.url} target="_blank" rel="noopener noreferrer" className="break-all text-blue-700 underline">{source.path}:{source.startLine}–{source.endLine}</a>:<span>{source.path||"Thông tin repository"}</span>}</li>)}</ul><p className="mt-2">Phân tích đề xuất · Chưa sửa code hoặc chạy kiểm thử</p></section>;
}
