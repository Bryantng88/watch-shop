# Sprint 89 - Operation Authoring Guided Repair

Status: closed.

## Goal

Make the Operation Model authoring UI usable when a blank draft produces schema
errors that are technically correct but not actionable for an admin.

## Problem

The blank Operation template exposed low-level validation errors such as missing
workspace roles or unknown object targets. The UI showed the errors, but it did
not tell the user what to do next or provide a safe one-click path to a working
model. After localization, the screen was still too technical because map,
dry-run, adapter, publish, schema, and JSON panels were all shown at the same
level.

## Implemented

- Added a guided repair card to `OperationModelAuthoringPanel`.
- Added a wizard-first Operation tab that shows the linear path:
  - choose or build the model;
  - check the Workspace plan;
  - save a version;
  - create a runtime Space.
- Moved schema/map/dry-run/adapter details behind `Chi tiết nâng cao` so the
  first viewport focuses on the next action instead of implementation internals.
- Renamed and reshaped the advanced area into `Xem bản thiết kế mà nút này sẽ
  dùng`, making it clear that the section explains/checks the main
  `Tạo Space runtime` action rather than being a separate runtime step.
- Split the advanced area into focused tabs:
  - Workspace sẽ tạo;
  - Action/adapter;
  - Version;
  - Model;
  - JSON.
- Added an explicit interaction guide that separates:
  - the button that creates runtime data;
  - the button that opens runtime data;
  - tabs that only switch the inspection view.
- The Workspace plan tab now explains that `Tạo Space runtime` creates one
  Task-backed Space and initial TaskItem-backed Workspaces, while deferred
  Workspaces wait for future business events.
- Status badges such as `Tạo sẵn` and `Có thể tạo` were rewritten as
  non-action state labels so they do not look like clickable commands.
- Removed the duplicate create-space action from the Version inspect tab so the
  primary runtime action lives only in the wizard.
- Added a `Start here` flow that explains:
  - model;
  - dry-run;
  - publish;
  - create runtime Space.
- When the Operation Model is invalid, the UI now shows a primary action:
  `Dựng/sửa model tự động`.
- When the Operation Model is empty, the panel now shows
  `Dựng operation đầu tiên`.
- The starter model synchronizes:
  - one object type;
  - one workspace role;
  - one event route;
  - one core flow;
  - one action;
  - one workflow.
- Extracted starter model repair into a shared authoring helper so the wizard
  and detailed editor use the same valid bootstrap contract.
- The generated starter model is structurally valid and can proceed to dry-run,
  publish readiness, and later refinement.
- The UI now distinguishes validation blocking errors from adapter pending
  warnings.
- Empty operations are no longer considered publish-ready by the Operational
  Blueprint validator.
- Operation Model tab copy was localized to Vietnamese for the main authoring,
  preview, dry-run, adapter, publish, and summary panels.
- Readability was improved by changing technical status labels into action
  language such as `Dựng operation đầu tiên`, `Kế hoạch tạo Space`, `Lưu
  version`, and `Tạo Space runtime`.
- The wizard now explains that creating a runtime Space means creating one
  Task-backed Space container and its initial TaskItem-backed Workspaces from
  the latest published version.
- Space creation success/failure feedback is displayed inside the wizard near
  the button, so users do not need to look at the terminal or scroll to a global
  message area.
- After creation or duplicate detection, the wizard shows `Mở Space runtime`
  and links to `/admin/tasks/{taskId}` so the next step is explicit.
- Replaced the heavy step-by-step guide with a minimal wizard:
  - compact progress strip;
  - one current-step panel;
  - only the next valid primary action is visible.
- Promoted the Blueprint configuration area into `1. Cấu hình
  Space/Workspace runtime` so authors see it as the primary design step, not as
  optional advanced detail.
- Moved the save/create runtime wizard below configuration as `2. Lưu version
  và tạo Space runtime`.
- Moved the registry Blueprint list and draft selector out of the work surface
  into a collapsed `Mở thư viện Blueprint / Draft` section.
- Differentiated read/config blocks from runtime action blocks visually:
  - configuration remains white/read-focused;
  - runtime save/create/open block uses a dark action surface.
- The default configuration tab is now `Cấu hình model`; result preview,
  action/adapter, version, and JSON are supporting tabs.
- The main wizard no longer shows multiple competing action buttons once a
  version or Space already exists.
- The advanced inspect section was reduced to one short explanation plus tabs,
  instead of three explanatory cards.
- `Object domain` in the authoring panel is now a dropdown backed by a real
  Operation target-type registry (`WATCH`, `ORDER`, `SHIPMENT`, `PAYMENT`,
  `SERVICE_REQUEST`, `TECHNICAL_ISSUE`, `TASK_ITEM`) instead of a free-text
  technical placeholder.
- Starter/repair model generation now treats `BUSINESS_OBJECT`, `OBJECT`, and
  `OBJECT_*` as placeholders and replaces them with the default real target
  `WATCH`, including matching event/action/command defaults.
- Changing an object domain now retargets related workspace roles, event
  routes, actions, workflow transitions, and projection subscriptions together
  so the model does not silently drift into an invalid state.

## Files Touched

- `src/domains/workflow-definition/client/OperationModelAuthoringPanel.tsx`
- `src/domains/workflow-definition/client/OperationModelWizard.tsx`
- `src/domains/workflow-definition/client/OperationWorkspaceMap.tsx`
- `src/domains/workflow-definition/client/OperationSpaceCreationPlan.tsx`
- `src/domains/workflow-definition/client/OperationAdapterBindings.tsx`
- `src/domains/workflow-definition/client/OperationPublishPlan.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `src/app/api/admin/system/blueprints/published-versions/[id]/create-space/route.ts`
- `src/domains/blueprint/shared/operation-authoring.ts`
- `src/domains/blueprint/shared/operation-target-types.ts`
- `src/domains/blueprint/shared/operational-blueprint.ts`
- `scripts/verify-sprint-76-operational-blueprint-validation.ts`
- `docs/sprints/CURRENT.md`

## Validation

- `cmd /c npx eslint src/domains/blueprint/shared/operation-authoring.ts src/domains/workflow-definition/client/OperationModelAuthoringPanel.tsx src/domains/workflow-definition/client/OperationModelWizard.tsx src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationPublishPlan.tsx src/domains/workflow-definition/client/OperationSpaceCreationPlan.tsx src/domains/workflow-definition/client/OperationWorkspaceMap.tsx src/domains/workflow-definition/client/OperationAdapterBindings.tsx --quiet` passed.
- `cmd /c npx eslint src/app/api/admin/system/blueprints/published-versions/[id]/create-space/route.ts src/domains/workflow-definition/client/OperationModelWizard.tsx src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationPublishPlan.tsx --quiet` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/OperationModelWizard.tsx src/domains/workflow-definition/client/WorkflowAdminClient.tsx --quiet` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationModelWizard.tsx --quiet` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx --quiet` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationWorkspaceMap.tsx src/domains/workflow-definition/client/OperationSpaceCreationPlan.tsx --quiet` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/OperationModelWizard.tsx --quiet` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/OperationModelWizard.tsx src/domains/workflow-definition/client/WorkflowAdminClient.tsx --quiet` passed.
- `cmd /c npx eslint src/domains/blueprint/shared/operation-target-types.ts src/domains/blueprint/shared/operation-authoring.ts src/domains/workflow-definition/client/OperationModelAuthoringPanel.tsx --quiet` passed.
- `cmd /c npx tsx scripts/verify-sprint-76-operational-blueprint-validation.ts` passed.
- `cmd /c npx tsx scripts/verify-sprint-80-structured-operation-authoring.ts` passed.
- `cmd /c npx tsx scripts/verify-sprint-84-publish-version-snapshot-ux.ts` passed.
- `cmd /c npx tsx scripts/verify-sprint-87-create-space-from-published-blueprint.ts` passed.

## Result

Admins no longer need to understand the full Operation schema just to escape a
blank draft or decide where to begin. The Operation tab now leads with the
workflow of authoring itself, while detailed schema controls remain available
for refinement.
