"use client";
export function PersonalWorkKindField({
  event,
  onChange,
}: {
  event: boolean;
  onChange: (event: boolean) => void;
}) {
  return (
    <label className="block space-y-1 text-xs text-slate-600">
      <span>Loại mục</span>
      <select
        aria-label="Loại mục"
        value={event ? "EVENT" : "TASK"}
        onChange={(e) => onChange(e.target.value === "EVENT")}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
      >
        <option value="TASK">Công việc · cần hoàn thành</option>
        <option value="EVENT">Sự kiện · diễn ra theo lịch</option>
      </select>
    </label>
  );
}
