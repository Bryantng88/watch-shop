"use client";

import type { PersonalWorkPageData } from "../shared/personal-work.types";

export function parsePersonalWorkTags(value: string) {
  return [...new Set(value.split(",").map(tag => tag.trim()).filter(Boolean))];
}

export default function PersonalWorkTagsField({ value, onChange, disabled = false, allowCodex = true, configuration }: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  allowCodex?:boolean;
  configuration: PersonalWorkPageData["codex"];
}) {
  const tags = parsePersonalWorkTags(value);
  const codex = tags.some(tag => tag.toLowerCase() === "codex");
  return <div className="space-y-2">
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-600">Tag công việc</span>
      <input value={value} onChange={event => onChange(event.target.value)} disabled={disabled}
        placeholder={allowCodex?"Ví dụ: báo cáo, codex (ngăn cách bằng dấu phẩy)":"Ví dụ: họp, gia đình (ngăn cách bằng dấu phẩy)"}
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm disabled:bg-slate-50" />
    </label>
    {allowCodex&&<><label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={codex} disabled={disabled} onChange={event => onChange(
        (event.target.checked ? [...tags, "codex"] : tags.filter(tag => tag.toLowerCase() !== "codex")).join(", "),
      )} />
      Gắn tag codex
    </label>
    <p className="text-xs text-slate-500">
      {configuration?.ready
        ? configuration.canDispatch
          ? "Khi lưu, việc mới được gắn tag codex có thể tự gửi thực hiện. Chỉ chủ sở hữu ADMIN được gửi việc."
          : "Chỉ chủ sở hữu có quyền ADMIN được gửi việc cho Codex."
        : configuration?.reason || "Chưa cấu hình worker Codex"}
    </p></>}
  </div>;
}
