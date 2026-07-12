"use client";

import type { OperationalBlueprintContract } from "@/domains/blueprint/shared/operational-blueprint";
import {
  listOperationAdapterBindings,
  summarizeOperationAdapterBindings,
  type OperationAdapterBindingStatus,
} from "@/domains/blueprint/shared/operation-adapter-bindings";

type Props = {
  operation: OperationalBlueprintContract | null;
};

function statusTone(status: OperationAdapterBindingStatus) {
  if (status === "EXECUTABLE") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (status === "EXTERNAL_ENTRYPOINT") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function statusLabel(status: OperationAdapterBindingStatus) {
  if (status === "EXECUTABLE") return "Chạy được";
  if (status === "EXTERNAL_ENTRYPOINT") return "Điểm vào bên ngoài";
  return "Chưa có adapter";
}

export function OperationAdapterBindings({ operation }: Props) {
  const bindings = listOperationAdapterBindings(operation);
  const summary = summarizeOperationAdapterBindings(operation);

  if (!operation) {
    return (
      <div className="border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Chọn hoặc dựng Operation Model để xem action nào đã nối được với domain
        adapter.
      </div>
    );
  }

  return (
    <div className="border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Kết nối action với domain
          </h3>
          <div className="mt-1 text-xs text-slate-500">
            {summary.executable} chạy được, {summary.externalEntrypoints} điểm vào ngoài,
            {" "}
            {summary.declaredOnly} chưa nối
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
          {summary.total} action
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {bindings.length ? (
          bindings.map((binding) => (
            <div key={binding.actionKey} className="border border-slate-200 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    {binding.label}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {binding.workspaceRole} / {binding.targetType}
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusTone(binding.status)}`}
                >
                  {statusLabel(binding.status)}
                </span>
              </div>
              <div className="mt-3 grid gap-1 text-xs text-slate-600">
                <div>
                  Lệnh domain:{" "}
                  <span className="font-medium text-slate-800">
                    {binding.command}
                  </span>
                </div>
                <div>
                  Adapter:{" "}
                  <span className="font-medium text-slate-800">
                    {binding.adapterKey ?? "chưa có"}
                  </span>
                </div>
                <div>{binding.note}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Chưa có action nào trong Operation Model này.
          </div>
        )}
      </div>
    </div>
  );
}
