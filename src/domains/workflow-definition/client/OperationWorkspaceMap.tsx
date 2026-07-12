"use client";

import type { OperationalBlueprintContract } from "@/domains/blueprint/shared/operational-blueprint";
import { generateOperationPreviewMap } from "@/domains/blueprint/shared/operation-preview";

type Props = {
  operation: OperationalBlueprintContract | null;
};

function pillTone(kind: "entry" | "terminal" | "default") {
  if (kind === "entry") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (kind === "terminal") return "border-slate-300 bg-slate-100 text-slate-700";
  return "border-slate-200 bg-white text-slate-700";
}

function cardinalityLabel(value: string) {
  if (value === "SINGLE_PER_ACTIVE_CYCLE") return "Tạo sẵn";
  if (value === "ONE_PER_BUSINESS_OBJECT") return "Tạo theo object";
  if (value === "MANY_PER_ACTIVE_CYCLE") return "Tạo thủ công";
  return value;
}

function effectLabel(value: string) {
  if (value === "CREATE_WORKSPACE") return "tạo Workspace";
  if (value === "BIND_ITEM") return "đưa item vào";
  if (value === "MOVE_ITEM") return "chuyển item";
  if (value === "WRITE_ACTIVITY") return "ghi hoạt động";
  return value;
}

export function OperationWorkspaceMap({ operation }: Props) {
  const preview = generateOperationPreviewMap(operation);

  if (!preview) {
    return (
      <div className="border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Chọn hoặc dựng một Operation Model để xem trước các Workspace sẽ được
        tạo.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-slate-200 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Bản xem trước Workspace
            </h3>
            <div className="mt-1 text-xs text-slate-500">
              Chỉ để xem Blueprint sẽ sinh cấu trúc nào. Bấm ở đây không tạo
              dữ liệu runtime.
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {preview.operationKey} / {preview.context}
            </div>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
            {preview.workspaceNodes.length} Workspace
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {preview.flows.length ? (
            preview.flows.map((flow) => (
              <div key={flow.key} className="border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-700">
                  {flow.label}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {flow.steps.map((step, index) => {
                    const tone = step.isEntry
                      ? "entry"
                      : step.isTerminal
                        ? "terminal"
                        : "default";

                    return (
                      <div
                        key={`${flow.key}:${step.workspaceRole}:${index}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`border px-2.5 py-1 text-xs font-medium ${pillTone(tone)}`}
                        >
                          {step.label || step.workspaceRole}
                        </span>
                        {index < flow.steps.length - 1 ? (
                          <span className="text-xs text-slate-400">-&gt;</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              Chưa có luồng vận hành. Hãy bấm “Dựng operation đầu tiên” ở panel
              bên phải để tạo khung ban đầu.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {preview.workspaceNodes.map((node) => (
          <div key={node.roleKey} className="border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  {node.label}
                </div>
                <div className="mt-1 text-xs text-slate-500">{node.roleKey}</div>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                Trạng thái: {cardinalityLabel(node.cardinality)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1 text-[11px]">
              {node.identityTargetType ? (
                <span className="border border-blue-100 bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                  định danh {node.identityTargetType}
                </span>
              ) : null}
              {node.itemTargetTypes.map((targetType) => (
                <span
                  key={`${node.roleKey}:${targetType}`}
                  className="border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-700"
                >
                  item {targetType}
                </span>
              ))}
            </div>

            <div className="mt-4 grid gap-3 text-xs">
              <div>
                <div className="font-semibold text-slate-700">Event đi vào</div>
                <div className="mt-1 space-y-1 text-slate-600">
                  {node.incomingRoutes.length ? (
                    node.incomingRoutes.map((route) => (
                      <div key={`${node.roleKey}:${route.eventKey}:${route.targetType}`}>
                        {route.eventKey} / {effectLabel(route.effect)}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400">chưa có</div>
                  )}
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Thao tác</div>
                <div className="mt-1 space-y-1 text-slate-600">
                  {node.actions.length ? (
                    node.actions.map((action) => (
                      <div key={`${node.roleKey}:${action.key}`}>
                        {action.label} / {action.command}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400">chưa có</div>
                  )}
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">
                  Workflow thuộc Workspace này
                </div>
                <div className="mt-1 space-y-1 text-slate-600">
                  {node.workflows.length ? (
                    node.workflows.map((workflow) => (
                      <div key={`${node.roleKey}:${workflow.key}`}>
                        {workflow.key}: {workflow.states.join(", ")}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400">chưa có</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {preview.projectionSubscriptions.length ? (
        <div className="border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Ảnh hưởng tới projection
          </h3>
          <div className="mt-3 space-y-2">
            {preview.projectionSubscriptions.map((subscription) => (
              <div
                key={subscription.projectionKey}
                className="border border-slate-200 p-3 text-sm"
              >
                <div className="font-semibold text-slate-950">
                  {subscription.projectionKey}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  làm mới dữ liệu đọc cho {subscription.resolvesToTargetType}
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  {subscription.eventKeys.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {preview.unplacedRoutes.length || preview.unplacedActions.length ? (
        <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Có event route hoặc action đang trỏ tới vai trò Workspace chưa tồn
          tại. Hãy dùng nút dựng/sửa model ở panel bên phải trước khi tạo Space
          thật.
        </div>
      ) : null}
    </div>
  );
}
