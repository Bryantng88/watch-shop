"use client";

export function PersonalWorkKindField({ event, onChange }: {
  event: boolean;
  onChange: (event: boolean) => void;
}) {
  return (
    <div role="group" aria-label="Loại mục" className="inline-flex shrink-0 gap-0.5 rounded-lg bg-slate-100 p-1">
      {[{ event: false, label: "Việc" }, { event: true, label: "Sự kiện" }].map((item) => (
        <button key={item.label} type="button" aria-pressed={event === item.event}
          onClick={() => onChange(item.event)}
          className={`h-7 whitespace-nowrap rounded-md px-2.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${event === item.event ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
