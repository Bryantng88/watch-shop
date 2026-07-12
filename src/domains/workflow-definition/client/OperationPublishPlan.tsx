"use client";

import type { OperationalBlueprintContract } from "@/domains/blueprint/shared/operational-blueprint";
import type {
  BlueprintPublishedVersion,
  BlueprintSource,
  BlueprintWorkspaceDefinition,
} from "@/domains/blueprint/server";
import { buildOperationPublishPlan } from "@/domains/blueprint/shared/operation-publish-plan";
import { buildOperationSpaceCreationPlan } from "@/domains/blueprint/shared/operation-space-plan";

type Props = {
  blueprintKey: string;
  blueprintName: string;
  blueprintSource: BlueprintSource;
  workspaceDefinition: BlueprintWorkspaceDefinition | null;
  operation: OperationalBlueprintContract | null;
  publishedVersions?: BlueprintPublishedVersion[];
  canPublish?: boolean;
  isPublishing?: boolean;
  onPublish?: () => void;
  creatingSpaceVersionId?: string;
  onCreateSpace?: (versionId: string) => void;
};

function readinessMessage(code: string) {
  if (code === "missing_operation") return "Chưa có Operation Model.";
  if (code === "operation_validation_failed") {
    return "Operation Model còn lỗi cấu trúc. Hãy sửa ở panel bên phải trước.";
  }
  if (code === "declared_only_adapters") {
    return "Một số action chưa có adapter. Có thể publish để thử model, nhưng action đó chưa chạy thật.";
  }
  if (code === "creation_plan_blocked") {
    return "Kế hoạch tạo Space đang bị chặn. Hãy xem phần Kế hoạch tạo Space.";
  }
  return "Cần kiểm tra lại trước khi publish.";
}

export function OperationPublishPlan({
  blueprintKey,
  blueprintName,
  blueprintSource,
  workspaceDefinition,
  operation,
  publishedVersions = [],
  canPublish = false,
  isPublishing = false,
  onPublish,
  creatingSpaceVersionId = "",
  onCreateSpace,
}: Props) {
  const latestPublishedVersion = publishedVersions[0] ?? null;
  const creationPlan = workspaceDefinition
    ? buildOperationSpaceCreationPlan({
        blueprintKey,
        blueprintName,
        blueprintSource,
        workspaceDefinition,
        operation,
      })
    : null;
  const publishPlan = buildOperationPublishPlan({
    operation,
    creationPlan,
    latestPublishedVersion: latestPublishedVersion?.version ?? null,
  });
  const publishDisabled = !canPublish || !publishPlan.ok || isPublishing || !onPublish;

  return (
    <div className="border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Publish và tạo Space
          </h3>
          <div className="mt-1 text-xs text-slate-500">
            {publishPlan.operationKey ?? "chưa có operation"} / chế độ snapshot:{" "}
            {publishPlan.snapshotMode}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
              publishPlan.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {publishPlan.ok ? "Sẵn sàng publish" : "Đang bị chặn"}
          </span>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishDisabled}
            className="bg-slate-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPublishing ? "Đang lưu version..." : "Lưu version"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-medium text-slate-500">Version mới nhất</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">
            {latestPublishedVersion?.version ?? "-"}
          </div>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-medium text-slate-500">Version tiếp theo</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">
            {publishPlan.proposedVersion ?? "-"}
          </div>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-medium text-slate-500">Lỗi cấu trúc</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">
            {publishPlan.validationIssueCount}
          </div>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-medium text-slate-500">Adapter chưa nối</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">
            {publishPlan.adapterSummary.declaredOnly}
          </div>
        </div>
      </div>

      <div className="mt-4 border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        Lưu version sẽ tạo một bản Blueprint bất biến. Space/Workspace tạo sau
        này sẽ dùng snapshot của version đó. Workspace đã tồn tại sẽ không bị
        đổi tự động.
      </div>

      <div className="mt-4 border border-slate-200 p-3">
        <div className="text-xs font-semibold uppercase text-slate-500">
          Các version đã lưu
        </div>
        {publishedVersions.length ? (
          <div className="mt-3 space-y-2">
            {publishedVersions.slice(0, 5).map((version) => (
              <div
                key={version.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-slate-100 bg-white px-3 py-2 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900">
                    v{version.version}
                  </span>{" "}
                  <span className="text-slate-500">
                    {version.operationKey} / {version.snapshotMode}
                  </span>
                </div>
                <div className="text-slate-500">
                  {new Date(version.publishedAt).toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => onCreateSpace?.(version.id)}
                  disabled={!onCreateSpace || creatingSpaceVersionId === version.id}
                  className="border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingSpaceVersionId === version.id
                    ? "Đang tạo..."
                    : "Tạo Space runtime"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-xs text-slate-500">
            Chưa có version nào được publish.
          </div>
        )}
      </div>

      {publishPlan.issues.length ? (
        <div className="mt-3 space-y-1 text-xs">
          {publishPlan.issues.map((issue) => (
            <div
              key={`${issue.code}:${issue.message}`}
              className={issue.severity === "error" ? "text-rose-700" : "text-amber-700"}
            >
              {readinessMessage(issue.code)}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 text-xs text-emerald-700">
          Không còn lỗi chặn publish.
        </div>
      )}
    </div>
  );
}
