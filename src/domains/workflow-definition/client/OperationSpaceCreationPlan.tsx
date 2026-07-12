"use client";

import type { OperationalBlueprintContract } from "@/domains/blueprint/shared/operational-blueprint";
import type { BlueprintSource, BlueprintWorkspaceDefinition } from "@/domains/blueprint/server";
import {
  buildOperationSpaceCreationPlan,
  type OperationWorkspaceCreationPlanItem,
} from "@/domains/blueprint/shared/operation-space-plan";

type Props = {
  blueprintKey: string;
  blueprintName: string;
  blueprintSource: BlueprintSource;
  workspaceDefinition: BlueprintWorkspaceDefinition | null;
  operation: OperationalBlueprintContract | null;
};

function validationMessage(code: string) {
  if (code === "missing_object_type") return "Chưa có business object.";
  if (code === "missing_workspace_role") return "Thiếu vai trò Workspace.";
  if (code === "missing_core_flow") return "Chưa có luồng Workspace.";
  if (code === "unknown_object_target") return "Có loại object chưa được khai báo.";
  if (code === "unrepresented_object_target") return "Object chưa được Workspace nào dùng.";
  if (code === "missing_action") return "Workflow đang trỏ tới action chưa tồn tại.";
  return "Cần kiểm tra lại Operation Model.";
}

function dispositionReason(disposition: OperationWorkspaceCreationPlanItem["disposition"]) {
  if (disposition === "CREATE_INITIAL_WORKSPACE") {
    return "Workspace này sẽ được tạo ngay khi tạo Space.";
  }
  if (disposition === "DEFER_UNTIL_BUSINESS_OBJECT") {
    return "Workspace này sẽ được tạo khi business event/object tương ứng xuất hiện.";
  }
  return "Workspace này cần người dùng tạo thủ công theo nhu cầu capacity.";
}

function PlanItemList({
  title,
  subtitle,
  items,
  empty,
}: {
  title: string;
  subtitle: string;
  items: OperationWorkspaceCreationPlanItem[];
  empty: string;
}) {
  return (
    <div className="border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold text-slate-700">{title}</h4>
          <div className="mt-1 text-[11px] text-slate-500">{subtitle}</div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
          {items.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.map((item) => (
            <div key={`${item.disposition}:${item.workspaceRole}`} className="border border-slate-100 p-2">
              <div className="text-sm font-semibold text-slate-950">{item.title}</div>
              <div className="mt-1 text-xs text-slate-500">
                {item.workspaceRole} / {item.label}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                {dispositionReason(item.disposition)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">{empty}</div>
        )}
      </div>
    </div>
  );
}

export function OperationSpaceCreationPlan({
  blueprintKey,
  blueprintName,
  blueprintSource,
  workspaceDefinition,
  operation,
}: Props) {
  if (!workspaceDefinition) {
    return (
      <div className="border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Cần có Workspace Definition trước khi lập kế hoạch tạo Space.
      </div>
    );
  }

  const plan = buildOperationSpaceCreationPlan({
    blueprintKey,
    blueprintName,
    blueprintSource,
    workspaceDefinition,
    operation,
  });

  return (
    <div className="border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Kết quả nếu bấm Tạo Space runtime
          </h3>
          <div className="mt-1 text-xs text-slate-500">
            Sẽ tạo hoặc tìm 1 Space runtime dạng Task: {plan.spaceTitle}
          </div>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            plan.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {plan.ok ? "Trạng thái: có thể tạo" : "Trạng thái: đang bị chặn"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="border border-slate-200 bg-slate-50 p-3 text-sm">
          <div className="font-semibold text-slate-900">1 Space runtime</div>
          <div className="mt-1 text-xs text-slate-600">
            Tạo dưới dạng Task container.
          </div>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-3 text-sm">
          <div className="font-semibold text-slate-900">
            {plan.initialWorkspaces.length} Workspace ban đầu
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Tạo dưới dạng TaskItem ngay trong Space.
          </div>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-3 text-sm">
          <div className="font-semibold text-slate-900">
            {plan.deferredWorkspaces.length} Workspace chờ event
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Chưa tạo ngay; runtime tạo khi business event xuất hiện.
          </div>
        </div>
      </div>

      {!operation ? (
        <div className="mt-3 border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          Hãy chọn hoặc dựng Operation Model trước khi xem kế hoạch tạo Space.
        </div>
      ) : null}

      {plan.validation.issueCount ? (
        <div className="mt-3 space-y-1 text-xs">
          {[...plan.validation.errors, ...plan.validation.warnings].map((issue) => (
            <div
              key={`${issue.code}:${issue.path}:${issue.message}`}
              className={issue.severity === "error" ? "text-rose-700" : "text-amber-700"}
            >
              {validationMessage(issue.code)}
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <PlanItemList
          items={plan.initialWorkspaces}
          title="Sẽ tạo ngay"
          subtitle="Tạo TaskItem khi bấm nút phía trên"
          empty="Chưa có Workspace nào sẽ được tạo ngay."
        />
        <PlanItemList
          title="Sẽ tạo khi có event"
          subtitle="Không tạo ngay ở lần bấm này"
          items={plan.deferredWorkspaces}
          empty="Chưa có Workspace nào chờ business event."
        />
        <PlanItemList
          title="Cần tạo thủ công"
          subtitle="Không tạo tự động"
          items={plan.manualWorkspaces}
          empty="Chưa có vai trò cần tạo thủ công."
        />
      </div>
    </div>
  );
}
