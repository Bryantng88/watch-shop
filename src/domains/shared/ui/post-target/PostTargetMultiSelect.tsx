"use client";

import { PostTargetChip } from "./PostTargetChip";

export type PostTargetOption = {
  id: string;
  name: string;
  platform?: string | null;
};

function groups(options: PostTargetOption[]) {
  const byName = new Map<string, { key: string; name: string; ids: string[] }>();
  for (const option of options) {
    const name = String(option.name ?? "").trim();
    const id = String(option.id ?? "").trim();
    if (!name || !id) continue;
    const key = name.toLowerCase();
    const current = byName.get(key);
    if (current) {
      if (!current.ids.includes(id)) current.ids.push(id);
    } else {
      byName.set(key, { key, name, ids: [id] });
    }
  }
  return Array.from(byName.values());
}

export function PostTargetMultiSelect({
  value,
  options,
  onChange,
}: {
  value: string[];
  options: PostTargetOption[];
  onChange: (next: string[]) => void;
}) {
  const selected = value.map((id) => String(id ?? "").trim()).filter(Boolean);
  const targetGroups = groups(options);
  const selectedSet = new Set(selected);
  const groupById = new Map<string, (typeof targetGroups)[number]>();
  for (const group of targetGroups) {
    for (const id of group.ids) groupById.set(id, group);
  }
  const selectedGroups = selected.reduce<(typeof targetGroups)[number][]>((result, id) => {
    const group = groupById.get(id);
    if (group && !result.some((item) => item.key === group.key)) result.push(group);
    return result;
  }, []);

  const toggle = (key: string) => {
    const group = targetGroups.find((item) => item.key === key);
    if (!group) return;
    const groupIds = new Set(group.ids);
    if (group.ids.some((id) => selectedSet.has(id))) {
      onChange(selected.filter((id) => !groupIds.has(id)));
    } else {
      onChange(Array.from(new Set([...selected, ...group.ids])));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedGroups.length ? selectedGroups.map((group) => (
          <button key={group.key} type="button" onClick={() => toggle(group.key)} className="rounded-full" title="Bỏ chọn">
            <PostTargetChip trailing={<span className="text-slate-300">x</span>}>{group.name}</PostTargetChip>
          </button>
        )) : <div className="text-sm text-slate-400">Chưa chọn page/kênh đăng</div>}
      </div>
      <select
        value=""
        onChange={(event) => {
          toggle(event.target.value);
          event.currentTarget.value = "";
        }}
        className="block h-[40px] w-full border-0 border-b border-slate-200 bg-transparent px-0 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-0"
      >
        <option value="">Thêm page/kênh đăng</option>
        {targetGroups.map((group) => (
          <option key={group.key} value={group.key}>
            {group.ids.some((id) => selectedSet.has(id)) ? "- " : ""}{group.name}
          </option>
        ))}
      </select>
    </div>
  );
}
