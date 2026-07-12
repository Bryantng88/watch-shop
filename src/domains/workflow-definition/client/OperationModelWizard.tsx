"use client";

import type {
  OperationalBlueprintContract,
  OperationalBlueprintTemplate,
} from "@/domains/blueprint/shared/operational-blueprint";
import { validateOperationalBlueprintContract } from "@/domains/blueprint/shared/operational-blueprint";
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
  templates: OperationalBlueprintTemplate[];
  publishedVersions: BlueprintPublishedVersion[];
  canPublish: boolean;
  isPublishing: boolean;
  creatingSpaceVersionId: string;
  spaceCreationNotice?: string;
  spaceRuntimeTaskId?: string;
  onTemplateSelect: (template: OperationalBlueprintTemplate) => void;
  onBuildStarter: () => void;
  onPublish?: () => void;
  onCreateSpace?: (versionId: string) => void;
};

function stepTone(done: boolean, active: boolean) {
  if (done) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (active) return "border-slate-900 bg-slate-950 text-white";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function templateDescription(template: OperationalBlueprintTemplate) {
  if (template.key === "service-operation") {
    return "Luồng Service Request, Inspect, Processing, Done.";
  }
  if (template.key === "payment-collection") {
    return "Luồng theo dõi, xử lý và hoàn tất thanh toán.";
  }
  if (template.key === "blank-operation") {
    return "Bắt đầu trống, sau đó dùng nút dựng operation đầu tiên.";
  }
  return template.description;
}

export function OperationModelWizard({
  blueprintKey,
  blueprintName,
  blueprintSource,
  workspaceDefinition,
  operation,
  templates,
  publishedVersions,
  canPublish,
  isPublishing,
  creatingSpaceVersionId,
  spaceCreationNotice,
  spaceRuntimeTaskId,
  onTemplateSelect,
  onBuildStarter,
  onPublish,
  onCreateSpace,
}: Props) {
  const validation = validateOperationalBlueprintContract(operation);
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
    latestPublishedVersion: publishedVersions[0]?.version ?? null,
  });
  const hasStructure = Boolean(
    operation &&
      operation.objectTypes.length &&
      operation.workspaceRoles.length &&
      operation.coreFlows.length,
  );
  const published = publishedVersions.length > 0;
  const latestVersion = publishedVersions[0] ?? null;
  const spaceReady = Boolean(spaceRuntimeTaskId);
  const spaceCreationNoticeTone = spaceCreationNotice?.startsWith("Không thể")
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <section className="border border-slate-900 bg-slate-950 p-4 text-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase text-slate-300">
            Block thao tác runtime
          </div>
          <h3 className="text-base font-semibold text-white">
            2. Lưu version và tạo Space runtime
          </h3>
          <p className="mt-1 max-w-3xl text-sm text-slate-300">
            Sau khi cấu hình ở bước 1 hợp lệ, lưu version rồi tạo Space runtime
            từ version đó.
          </p>
        </div>
        <div className="text-xs text-slate-300">
          {operation?.key ?? "chưa có operation"} / {blueprintSource}
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {[
          ["1", "Model", validation.ok, Boolean(operation) && !validation.ok],
          ["2", "Version", published, validation.ok && !published],
          ["3", "Space", spaceReady, published && !spaceReady],
          ["4", "Workspace", false, spaceReady],
        ].map(([number, label, done, active]) => (
          <div
            key={`${number}:${label}`}
            className={`border px-3 py-2 text-sm font-medium ${stepTone(Boolean(done), Boolean(active))}`}
          >
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center border border-current text-xs">
              {number}
            </span>
            {label}
          </div>
        ))}
      </div>

      {!operation ? (
        <div className="mt-5">
          <div className="text-sm font-semibold text-slate-900">
            Chọn một điểm bắt đầu
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.key}
                type="button"
                onClick={() => onTemplateSelect(template)}
                className="border border-slate-200 bg-white p-3 text-left hover:border-slate-400 hover:bg-slate-50"
              >
                <div className="text-sm font-semibold text-slate-950">
                  {template.label}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {template.contract.workspaceRoles.length} Workspace /{" "}
                  {template.contract.actions.length} action
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {templateDescription(template)}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {operation ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="border border-slate-700 bg-white p-3 text-slate-900">
            <div className="text-sm font-semibold text-slate-950">
              {spaceRuntimeTaskId ? "Space runtime đã sẵn sàng" : "Việc tiếp theo"}
            </div>
            {!hasStructure ? (
              <p className="mt-2 text-sm text-slate-600">
                Model hiện chưa có đủ object, Workspace và luồng chính. Hãy dựng
                khung đầu tiên để hệ thống biết sẽ tạo gì.
              </p>
            ) : !validation.ok ? (
              <p className="mt-2 text-sm text-slate-600">
                Model đã có dữ liệu nhưng còn phần chưa khớp. Dùng nút sửa nhanh
                hoặc mở phần chỉnh chi tiết bên dưới.
              </p>
            ) : !published ? (
              <p className="mt-2 text-sm text-slate-600">
                Model đã hợp lệ. Kiểm tra kế hoạch tạo Workspace rồi lưu version
                để runtime có snapshot cố định.
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                Đã có version. Bước này tạo một Space runtime từ snapshot đã lưu:
                một Task làm container và các TaskItem làm Workspace ban đầu.
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {!validation.ok ? (
                <button
                  type="button"
                  onClick={onBuildStarter}
                  className="bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Dựng/sửa model tự động
                </button>
              ) : null}
              {validation.ok && !published ? (
                <button
                  type="button"
                  onClick={onPublish}
                  disabled={!canPublish || !publishPlan.ok || isPublishing}
                  className="border border-slate-900 bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPublishing ? "Đang lưu..." : "Lưu version"}
                </button>
              ) : null}
              {validation.ok && published && latestVersion && !spaceReady ? (
                <button
                  type="button"
                  onClick={() => onCreateSpace?.(latestVersion.id)}
                  disabled={
                    !onCreateSpace || creatingSpaceVersionId === latestVersion.id
                  }
                  className="border border-slate-900 bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingSpaceVersionId === latestVersion.id
                    ? "Đang tạo..."
                    : "Tạo Space runtime"}
                </button>
              ) : null}
              {spaceReady && spaceRuntimeTaskId ? (
                <a
                  href={`/admin/tasks/${spaceRuntimeTaskId}`}
                  className="inline-flex border border-slate-900 bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Mở Space runtime
                </a>
              ) : null}
            </div>
            {spaceCreationNotice ? (
              <div className={`mt-3 border p-3 text-sm ${spaceCreationNoticeTone}`}>
                {spaceCreationNotice}
              </div>
            ) : null}
            {spaceRuntimeTaskId ? (
              <div className="mt-3 text-xs text-slate-500">
                Sau khi mở Space runtime, bấm Chi tiết ở dòng Workspace để vào
                màn xử lý giống flow media hiện tại.
              </div>
            ) : null}
          </div>

          <div className="grid gap-2 text-sm">
            <div className="border border-slate-700 bg-slate-900 p-3">
              <div className="text-xs font-medium text-slate-300">Workspace tạo ngay</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {creationPlan?.initialWorkspaces.length ?? 0}
              </div>
            </div>
            <div className="border border-slate-700 bg-slate-900 p-3">
              <div className="text-xs font-medium text-slate-300">Workspace theo event</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {creationPlan?.deferredWorkspaces.length ?? 0}
              </div>
            </div>
            <div className="border border-slate-700 bg-slate-900 p-3">
              <div className="text-xs font-medium text-slate-300">Version đã lưu</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {latestVersion?.version ?? "-"}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
