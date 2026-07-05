import { listWorkTypesWithWorkflow } from "@/domains/task/server/work-type.service";
import type {
  WorkTypeCoordinationContext,
  WorkTypeWithWorkflowDefinition,
} from "@/domains/task/server/work-type.types";
import {
  listWorkflowDefinitionsWithValidation,
  validateWorkflowDefinition,
} from "@/domains/workflow-definition/server";
import { listWorkflowDefinitionDrafts } from "@/domains/workflow-definition/server/workflow-definition-draft.service";
import {
  createAppliedWorkflowSnapshot,
  normalizeWorkspaceCapabilities,
} from "@/domains/blueprint/shared/workspace-capabilities";
import {
  eventBindingsForWorkType,
  type WorkspaceEventBinding,
} from "@/domains/blueprint/shared/event-bindings";
import {
  MANUAL_WORKSPACE_PROVISIONING,
  workspaceProvisioningForWorkType,
  type WorkspaceProvisioningPolicy,
} from "@/domains/blueprint/shared/workspace-provisioning";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server/workflow-definition.types";
import type {
  BlueprintCapability,
  BlueprintExperience,
  BlueprintLibraryItem,
  BlueprintSource,
  BlueprintWorkspaceDefinition,
  BlueprintWorkspaceDefinitionCapabilities,
  BlueprintWorkflowCapability,
  WorkspaceInstantiationBlueprintOption,
} from "./blueprint.types";

type ExperienceSeed = {
  purpose: string;
  typicalUsage: string;
  expectedResult: string;
  workspaceType: string;
};

const EXPERIENCE_BY_WORK_TYPE: Record<string, ExperienceSeed> = {
  publish: {
    purpose: "Chuẩn hóa cách đồng hồ đi từ bước chuẩn bị đến trạng thái sẵn sàng đăng bán.",
    typicalUsage: "Dùng khi Operations cần một Workspace chung cho nội dung, hình ảnh, review và trạng thái sẵn sàng đăng.",
    expectedResult: "Một Publish Workspace nơi các Item đạt kết quả rõ ràng: sẵn sàng đăng bán.",
    workspaceType: "Publish Workspace",
  },
  photography: {
    purpose: "Điều phối yêu cầu chụp ảnh cho đến khi có hình ảnh đồng hồ dùng được.",
    typicalUsage: "Dùng khi Operations cần yêu cầu, theo dõi và hoàn tất việc chụp ảnh sản phẩm.",
    expectedResult: "Một Photography Workspace nơi các Item thể hiện việc hình ảnh đã xong hay còn cần xử lý.",
    workspaceType: "Photography Workspace",
  },
  technical: {
    purpose: "Điều phối các việc kỹ thuật hỗ trợ quá trình xử lý đồng hồ.",
    typicalUsage: "Dùng cho các việc kỹ thuật mà Operations cần theo dõi trong một Workspace chung.",
    expectedResult: "Một Technical Workspace nơi các Item phản ánh trạng thái xử lý kỹ thuật hiện tại.",
    workspaceType: "Technical Workspace",
  },
  quotation: {
    purpose: "Chuẩn hóa cách Sales chuẩn bị và theo dõi báo giá.",
    typicalUsage: "Dùng khi Sales cần một nơi chung cho yêu cầu báo giá, review và follow-up khách hàng.",
    expectedResult: "Một Quotation Workspace nơi tiến độ báo giá được thể hiện rõ qua các Item.",
    workspaceType: "Quotation Workspace",
  },
  pricing: {
    purpose: "Điều phối quyết định giá và các việc điều chỉnh giá.",
    typicalUsage: "Dùng khi Sales cần review, điều chỉnh hoặc xác nhận giá trước khi hành động.",
    expectedResult: "Một Pricing Workspace nơi các Item cho thấy quyết định giá nào đang chờ hoặc đã hoàn tất.",
    workspaceType: "Pricing Workspace",
  },
  negotiation: {
    purpose: "Theo dõi quá trình thương lượng từ trao đổi ban đầu đến kết quả kinh doanh rõ ràng.",
    typicalUsage: "Dùng khi Sales cần điều phối các bước thương lượng và quyết định với khách hàng.",
    expectedResult: "Một Negotiation Workspace nơi các Item làm rõ hành động thương mại tiếp theo.",
    workspaceType: "Negotiation Workspace",
  },
  marketing: {
    purpose: "Điều phối các việc marketing hỗ trợ Sales và Operations.",
    typicalUsage: "Dùng khi chiến dịch, listing hoặc promotion cần được theo dõi chung.",
    expectedResult: "Một Marketing Workspace nơi các Item cho thấy mức sẵn sàng và điểm nghẽn marketing.",
    workspaceType: "Marketing Workspace",
  },
  repair: {
    purpose: "Chuẩn hóa cách tiếp nhận, theo dõi và hoàn tất việc sửa chữa.",
    typicalUsage: "Dùng khi Technical cần một Workspace chung cho tiếp nhận sửa chữa, xử lý và theo dõi kết quả.",
    expectedResult: "Một Repair Workspace nơi các Item thể hiện tiến độ sửa chữa và trạng thái hoàn tất.",
    workspaceType: "Repair Workspace",
  },
  inspection: {
    purpose: "Điều phối việc kiểm tra để kết quả kỹ thuật trở nên rõ ràng với business.",
    typicalUsage: "Dùng khi đồng hồ cần kiểm tra trước sửa chữa, bán hàng, bảo hành hoặc quyết định khác.",
    expectedResult: "Một Inspection Workspace nơi các Item ghi nhận tiến độ và kết quả kiểm tra.",
    workspaceType: "Inspection Workspace",
  },
  warranty: {
    purpose: "Theo dõi xử lý bảo hành từ lúc tiếp nhận yêu cầu đến khi có kết quả kỹ thuật hoặc phản hồi khách hàng.",
    typicalUsage: "Dùng khi Technical cần điều phối ca bảo hành và các hành động follow-up.",
    expectedResult: "Một Warranty Workspace nơi các Item thể hiện trạng thái bảo hành và bước tiếp theo.",
    workspaceType: "Warranty Workspace",
  },
  general: {
    purpose: "Cung cấp một không gian vận hành chuẩn cho các việc chưa có Blueprint chuyên biệt.",
    typicalUsage: "Dùng khi business cần điều phối công việc nhưng chưa có flow riêng theo domain.",
    expectedResult: "Một General Workspace nơi các Item vẫn có lịch sử Activity và Discussion rõ ràng.",
    workspaceType: "General Workspace",
  },
};

function workflowCapability(
  definition: WorkflowDefinition | null,
  validation: BlueprintWorkflowCapability["validation"],
): BlueprintWorkflowCapability {
  const transitions = definition?.transitions ?? [];

  return {
    workflowKey: definition?.key ?? null,
    definition,
    validation,
    stateCount: definition?.states.length ?? 0,
    transitionCount: transitions.length,
    manualActionCount: transitions.filter((item) => item.triggerType === "MANUAL").length,
    eventTriggerCount: transitions.filter((item) => item.triggerType === "EVENT").length,
    conditionCount: transitions.filter((item) => item.triggerType === "CONDITION").length,
  };
}

function contextLabel(context: WorkTypeCoordinationContext | "DRAFT") {
  if (context === "DRAFT") return "Draft";
  if (context === "OPERATION") return "Vận hành";
  if (context === "TECHNICAL") return "Kỹ thuật";
  if (context === "SALES") return "Bán hàng";
  if (context === "MEDIA") return "Media";
  if (context === "PAYMENT") return "Thanh toán";
  return "Tổng quát";
}

function workflowSummary(workflow: BlueprintWorkflowCapability) {
  if (!workflow.definition) return "Chưa gắn capability Workflow.";

  return [
    `${workflow.stateCount} bước trạng thái`,
    `${workflow.transitionCount} cách chuyển việc`,
    `${workflow.manualActionCount} thao tác thủ công`,
    `${workflow.eventTriggerCount} trigger BusinessEvent`,
    `${workflow.conditionCount} điều kiện`,
  ].join(", ");
}

function capabilitiesForWorkflow(
  workflow: BlueprintWorkflowCapability,
): BlueprintCapability[] {
  return [
    {
      key: "workflow",
      label: "Workflow",
      status: "ACTIVE",
      description: "Định nghĩa các bước trạng thái và cách Item di chuyển sau khi Workspace được tạo.",
      summary: workflowSummary(workflow),
    },
    {
      key: "permissions",
      label: "Permissions",
      status: "FUTURE",
      description: "Sau này dùng để định nghĩa ai được xem, tham gia và thao tác trong Workspace.",
      summary: null,
    },
    {
      key: "notifications",
      label: "Notifications",
      status: "FUTURE",
      description: "Sau này dùng để thông báo khi Workspace có thay đổi quan trọng.",
      summary: null,
    },
    {
      key: "automation",
      label: "Automation",
      status: "FUTURE",
      description: "Sau này dùng để định nghĩa phản ứng tự động khi platform có automation engine.",
      summary: null,
    },
    {
      key: "layout",
      label: "Layout",
      status: "FUTURE",
      description: "Sau này dùng để định nghĩa cách operator nhìn và tổ chức thông tin trong Workspace.",
      summary: null,
    },
    {
      key: "metrics",
      label: "Metrics",
      status: "FUTURE",
      description: "Sau này dùng để định nghĩa các chỉ số admin cần đo cho loại Workspace này.",
      summary: null,
    },
  ];
}

function workspaceCapabilities(
  workflow: BlueprintWorkflowCapability,
): BlueprintWorkspaceDefinitionCapabilities {
  return {
    workflow: Boolean(workflow.definition),
    items: true,
    activity: true,
    discussion: true,
    attachments: false,
    checklist: false,
    dueDate: false,
    assignee: false,
    priority: true,
  };
}

function buildWorkspaceDefinition(input: {
  name: string;
  description: string | null;
  experience: BlueprintExperience;
  workflow: BlueprintWorkflowCapability;
  provisioning?: WorkspaceProvisioningPolicy;
  eventBindings?: WorkspaceEventBinding[];
}): BlueprintWorkspaceDefinition {
  return {
    defaultName: input.experience.workspaceType,
    defaultDescription:
      input.description ??
      `Workspace được tạo từ Blueprint ${input.name}.`,
    workspaceType: input.experience.workspaceType,
    itemLabel: input.experience.workspacePreview.itemLabel,
    defaultView: "items",
    enabledCapabilities: normalizeWorkspaceCapabilities(
      workspaceCapabilities(input.workflow),
    ),
    provisioning: input.provisioning ?? MANUAL_WORKSPACE_PROVISIONING,
    eventBindings: input.eventBindings ?? [],
    instantiationNotes:
      "Ở V1, Workspace lưu ý định định nghĩa này dưới dạng snapshot note.",
  };
}

function buildExperience(input: {
  key: string;
  name: string;
  description: string | null;
  context: WorkTypeCoordinationContext | "DRAFT";
  ownerLabel: string | null;
  workflow: BlueprintWorkflowCapability;
}): BlueprintExperience {
  const seed = EXPERIENCE_BY_WORK_TYPE[input.key] ?? {
    purpose:
      input.description ??
      `Định nghĩa cách ${input.name} Workspace vận hành cho ${contextLabel(
        input.context,
      )}.`,
    typicalUsage: `Dùng khi ${contextLabel(
      input.context,
    )} cần một Workspace chuẩn cho nhóm việc ${input.name}.`,
    expectedResult: `Một ${input.name} Workspace có Item, Activity và Discussion được tổ chức theo cùng một operating model.`,
    workspaceType: `${input.name} Workspace`,
  };

  return {
    purpose: seed.purpose,
    ownerLabel: input.ownerLabel,
    typicalUsage: seed.typicalUsage,
    expectedResult: seed.expectedResult,
    workspaceType: seed.workspaceType,
    workspacePreview: {
      workspaceType: seed.workspaceType,
      itemLabel: `${input.name} Items`,
      activityLabel: "Lịch sử Activity",
      discussionLabel: "Discussion",
      steps: [
        "Admin chọn Blueprint này khi tạo Workspace bên trong Space.",
        "Workspace lưu snapshot của lựa chọn Blueprint.",
        "Operator thêm hoặc nhận Item trong Workspace.",
        "Item chạy capability Workflow và tạo Activity, Discussion.",
      ],
    },
    capabilities: capabilitiesForWorkflow(input.workflow),
  };
}

function buildDraftExperience(
  draft: {
    key: string;
    name: string;
    description: string | null;
    blueprintJson?: {
      purpose: string;
      typicalUsage: string;
      expectedResult: string;
      ownerLabel: string | null;
    } | null;
  },
  workflow: BlueprintWorkflowCapability,
): BlueprintExperience {
  if (draft.blueprintJson) {
    const fallback = buildExperience({
      key: draft.key,
      name: draft.name,
      description: draft.description,
      context: "DRAFT",
      ownerLabel: draft.blueprintJson.ownerLabel,
      workflow,
    });

    return {
      ...fallback,
      purpose: draft.blueprintJson.purpose,
      typicalUsage: draft.blueprintJson.typicalUsage,
      expectedResult: draft.blueprintJson.expectedResult,
      ownerLabel: draft.blueprintJson.ownerLabel,
    };
  }

  return buildExperience({
    key: draft.key,
    name: draft.name,
    description:
      draft.description ??
      "Draft một cách vận hành chuẩn cho Workspace trong tương lai.",
    context: "DRAFT",
    ownerLabel: "System Admin",
    workflow,
  });
}

function registryBlueprint(
  workType: WorkTypeWithWorkflowDefinition,
): BlueprintLibraryItem {
  const validation = workType.workflowDefinition
    ? validateWorkflowDefinition(workType.workflowDefinition)
    : null;
  const workflow = workflowCapability(workType.workflowDefinition, validation);
  const description = workType.metadata?.description
    ? String(workType.metadata.description)
    : null;
  const experience = buildExperience({
    key: workType.key,
    name: workType.title,
    description,
    context: workType.coordinationContext,
    ownerLabel: workType.defaultOwnerRole,
    workflow,
  });
  const eventBindings = eventBindingsForWorkType({
    workTypeKey: workType.key,
    coordinationContext: workType.coordinationContext,
  });
  const provisioning = workspaceProvisioningForWorkType({
    workTypeKey: workType.key,
    coordinationContext: workType.coordinationContext,
    enabled: workType.enabled,
  });

  return {
    key: workType.key,
    name: workType.title,
    description,
    icon: workType.icon,
    category: "Workspace Blueprint",
    businessContext: workType.coordinationContext,
    source: "REGISTRY",
    registrySource: workType.key,
    experience,
    workspaceDefinition: buildWorkspaceDefinition({
      name: workType.title,
      description,
      experience,
      workflow,
      provisioning,
      eventBindings,
    }),
    workflow,
    metadata: {
      defaultOwnerRole: workType.defaultOwnerRole,
      defaultParticipants: workType.defaultParticipants,
      routingKeys: workType.routingKeys,
      sortOrder: workType.sortOrder,
    },
  };
}

export function listRegistryBlueprints(
  context?: WorkTypeCoordinationContext,
): BlueprintLibraryItem[] {
  return listWorkTypesWithWorkflow(context).map(registryBlueprint);
}

export async function listBlueprintLibraryItems(): Promise<BlueprintLibraryItem[]> {
  const registryBlueprints = listRegistryBlueprints();
  const workflowValidations = new Map(
    listWorkflowDefinitionsWithValidation().map((item) => [
      item.definition.key,
      item.validation,
    ]),
  );
  const drafts = await listWorkflowDefinitionDrafts();
  const draftBlueprints: BlueprintLibraryItem[] = drafts.map((draft) => {
    const workflow = workflowCapability(
      draft.definitionJson,
      draft.validationJson ?? workflowValidations.get(draft.definitionJson.key) ?? null,
    );
    const experience = buildDraftExperience(draft, workflow);

    return {
      key: draft.key,
      name: draft.name,
      description: draft.description,
      icon: null,
      category: "Draft Blueprint",
      businessContext: "DRAFT",
      source: "DRAFT",
      registrySource: draft.sourceRegistryKey,
      experience,
      workspaceDefinition:
        draft.blueprintJson?.workspaceDefinition ??
        buildWorkspaceDefinition({
          name: draft.name,
          description: draft.description,
          experience,
          workflow,
          provisioning: MANUAL_WORKSPACE_PROVISIONING,
          eventBindings: [],
        }),
      workflow,
      metadata: {
        draftId: draft.id,
        draftStatus: draft.status,
        sourceRegistryKey: draft.sourceRegistryKey,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
      },
    };
  });

  return [...registryBlueprints, ...draftBlueprints];
}

function snapshotNoteForBlueprint(input: {
  blueprintKey: string;
  blueprintName: string;
  blueprintSource: BlueprintSource;
  workTypeKey: string;
  workflowKey: string | null;
  workflowDefinition: WorkflowDefinition | null;
  workspaceDefinition: BlueprintWorkspaceDefinition;
}) {
  const appliedWorkflowSnapshot = createAppliedWorkflowSnapshot(
    input.workflowDefinition,
  );
  const workspaceDefinition = {
    ...input.workspaceDefinition,
    provisioning:
      input.workspaceDefinition.provisioning ?? MANUAL_WORKSPACE_PROVISIONING,
    eventBindings: input.workspaceDefinition.eventBindings ?? [],
    enabledCapabilities: normalizeWorkspaceCapabilities(
      input.workspaceDefinition.enabledCapabilities,
    ),
  };
  const snapshot = {
    blueprintKey: input.blueprintKey,
    blueprintName: input.blueprintName,
    blueprintSource: input.blueprintSource,
    workTypeKey: input.workTypeKey,
    workflowKey: input.workflowKey,
    appliedWorkflowSnapshot,
    workspaceDefinition,
    provisioning: workspaceDefinition.provisioning,
    eventBindings: workspaceDefinition.eventBindings,
    enabledCapabilities: workspaceDefinition.enabledCapabilities,
    itemLabel: workspaceDefinition.itemLabel,
    defaultView: workspaceDefinition.defaultView,
    workspaceType: workspaceDefinition.workspaceType,
    instantiationNotes: workspaceDefinition.instantiationNotes,
    snapshotAt: new Date().toISOString(),
  };

  return [
    `blueprintKey: ${input.blueprintKey}`,
    `blueprintSource: ${input.blueprintSource}`,
    `workTypeKey: ${input.workTypeKey}`,
    input.workflowKey ? `workflowKey: ${input.workflowKey}` : null,
    `workspaceType: ${input.workspaceDefinition.workspaceType}`,
    `itemLabel: ${input.workspaceDefinition.itemLabel}`,
    `defaultView: ${input.workspaceDefinition.defaultView}`,
    input.workspaceDefinition.instantiationNotes
      ? `instantiationNotes: ${input.workspaceDefinition.instantiationNotes}`
      : null,
    `blueprintSnapshot: ${JSON.stringify(snapshot)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function listWorkspaceInstantiationBlueprintOptions(
  context: WorkTypeCoordinationContext,
): Promise<WorkspaceInstantiationBlueprintOption[]> {
  const registryOptions = listRegistryBlueprints(context).map((blueprint) => ({
    selectionKey: `REGISTRY:${blueprint.key}`,
    key: blueprint.key,
    name: blueprint.name,
    description: blueprint.description,
    workflowKey: blueprint.workflow.workflowKey,
    businessContext:
      blueprint.businessContext === "DRAFT" ? context : blueprint.businessContext,
    source: blueprint.source,
    status: null,
    workspaceDefinition: blueprint.workspaceDefinition,
    snapshotNote: snapshotNoteForBlueprint({
      blueprintKey: blueprint.key,
      blueprintName: blueprint.name,
      blueprintSource: blueprint.source,
      workTypeKey: blueprint.key,
      workflowKey: blueprint.workflow.workflowKey,
      workflowDefinition: blueprint.workflow.definition,
      workspaceDefinition: blueprint.workspaceDefinition,
    }),
  }));

  const draftOptions = (await listBlueprintLibraryItems())
    .filter((blueprint) => blueprint.source === "DRAFT")
    .filter((blueprint) => blueprint.metadata?.draftStatus !== "ARCHIVED")
    .map((blueprint) => {
      const draftId =
        typeof blueprint.metadata?.draftId === "string"
          ? blueprint.metadata.draftId
          : blueprint.key;
      const sourceRegistryKey =
        typeof blueprint.metadata?.sourceRegistryKey === "string"
          ? blueprint.metadata.sourceRegistryKey
          : blueprint.registrySource ?? blueprint.key;
      const status =
        typeof blueprint.metadata?.draftStatus === "string"
          ? blueprint.metadata.draftStatus
          : null;

      return {
        selectionKey: `DRAFT:${draftId}`,
        key: blueprint.key,
        name: blueprint.name,
        description: blueprint.description,
        workflowKey: blueprint.workflow.workflowKey,
        businessContext: blueprint.businessContext,
        source: blueprint.source,
        status,
        workspaceDefinition: blueprint.workspaceDefinition,
        snapshotNote: snapshotNoteForBlueprint({
          blueprintKey: blueprint.key,
          blueprintName: blueprint.name,
          blueprintSource: blueprint.source,
          workTypeKey: sourceRegistryKey,
          workflowKey: blueprint.workflow.workflowKey,
          workflowDefinition: blueprint.workflow.definition,
          workspaceDefinition: blueprint.workspaceDefinition,
        }),
      };
    });

  return [...registryOptions, ...draftOptions];
}
