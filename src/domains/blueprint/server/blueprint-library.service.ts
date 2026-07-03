import {
  listAllWorkTypes,
  listWorkTypes,
  listWorkTypesWithWorkflow,
} from "@/domains/task/server/work-type.service";
import type {
  WorkTypeCoordinationContext,
  WorkTypeWithWorkflowDefinition,
} from "@/domains/task/server/work-type.types";
import {
  listWorkflowDefinitionsWithValidation,
  validateWorkflowDefinition,
} from "@/domains/workflow-definition/server";
import { listWorkflowDefinitionDrafts } from "@/domains/workflow-definition/server/workflow-definition-draft.service";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server/workflow-definition.types";
import type {
  BlueprintCapability,
  BlueprintExperience,
  BlueprintLibraryItem,
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
    purpose: "Standardize how watches move from preparation to publishing readiness.",
    typicalUsage: "Use when Operations needs one shared Workspace for content, images, review, and publish readiness.",
    expectedResult: "A Publish Workspace where Items reach a clear ready-to-publish outcome.",
    workspaceType: "Publish Workspace",
  },
  photography: {
    purpose: "Coordinate photography requests until usable watch images are available.",
    typicalUsage: "Use when Operations needs to request, track, and complete product photography.",
    expectedResult: "A Photography Workspace with Items showing whether image work is complete or needs follow-up.",
    workspaceType: "Photography Workspace",
  },
  technical: {
    purpose: "Coordinate operational technical work that supports watch handling.",
    typicalUsage: "Use for technical tasks that Operations needs to track across a shared workspace.",
    expectedResult: "A Technical Workspace where Items reflect current technical handling status.",
    workspaceType: "Technical Workspace",
  },
  quotation: {
    purpose: "Standardize how Sales prepares and follows up quotations.",
    typicalUsage: "Use when Sales needs a shared place for quote requests, review, and customer follow-up.",
    expectedResult: "A Quotation Workspace where Items make quotation progress visible.",
    workspaceType: "Quotation Workspace",
  },
  pricing: {
    purpose: "Coordinate pricing decisions and price adjustment work.",
    typicalUsage: "Use when Sales needs to review, adjust, or confirm pricing before business action.",
    expectedResult: "A Pricing Workspace where Items show which pricing decisions are pending or complete.",
    workspaceType: "Pricing Workspace",
  },
  negotiation: {
    purpose: "Track negotiation work from initial discussion to a clear commercial outcome.",
    typicalUsage: "Use when Sales needs to coordinate customer negotiation steps and decisions.",
    expectedResult: "A Negotiation Workspace where Items make next commercial actions visible.",
    workspaceType: "Negotiation Workspace",
  },
  marketing: {
    purpose: "Coordinate marketing work that supports sales and operations.",
    typicalUsage: "Use when campaign, listing, or promotion work needs shared follow-up.",
    expectedResult: "A Marketing Workspace where Items show marketing readiness and blockers.",
    workspaceType: "Marketing Workspace",
  },
  repair: {
    purpose: "Standardize how repair work is received, tracked, and completed.",
    typicalUsage: "Use when Technical needs a shared Workspace for repair intake, handling, and result tracking.",
    expectedResult: "A Repair Workspace where Items show repair progress and completion state.",
    workspaceType: "Repair Workspace",
  },
  inspection: {
    purpose: "Coordinate inspection work so technical findings become visible to the business.",
    typicalUsage: "Use when watches require inspection before repair, sale, warranty, or another decision.",
    expectedResult: "An Inspection Workspace where Items capture inspection progress and outcome.",
    workspaceType: "Inspection Workspace",
  },
  warranty: {
    purpose: "Track warranty handling from claim intake to technical or customer resolution.",
    typicalUsage: "Use when Technical needs to coordinate warranty cases and follow-up actions.",
    expectedResult: "A Warranty Workspace where Items show warranty status and next action.",
    workspaceType: "Warranty Workspace",
  },
  general: {
    purpose: "Provide a standard operating space for work that does not fit a specialized Blueprint yet.",
    typicalUsage: "Use when the business needs coordination without a dedicated domain-specific flow.",
    expectedResult: "A General Workspace where Items still have clear activity and discussion history.",
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
  if (context === "OPERATION") return "Operations";
  if (context === "TECHNICAL") return "Technical";
  if (context === "SALES") return "Sales";
  return "General";
}

function workflowSummary(workflow: BlueprintWorkflowCapability) {
  if (!workflow.definition) return "No Workflow capability is attached yet.";

  return [
    `${workflow.stateCount} stages`,
    `${workflow.transitionCount} ways work moves forward`,
    `${workflow.manualActionCount} manual actions`,
    `${workflow.eventTriggerCount} BusinessEvent triggers`,
    `${workflow.conditionCount} conditions`,
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
      description: "Defines the stages and movements Items use after a Workspace is created.",
      summary: workflowSummary(workflow),
    },
    {
      key: "permissions",
      label: "Permissions",
      status: "FUTURE",
      description: "Will define who can see, join, and operate the Workspace.",
      summary: null,
    },
    {
      key: "notifications",
      label: "Notifications",
      status: "FUTURE",
      description: "Will define when people are informed about important workspace changes.",
      summary: null,
    },
    {
      key: "automation",
      label: "Automation",
      status: "FUTURE",
      description: "Will define automated reactions after the platform has an automation engine.",
      summary: null,
    },
    {
      key: "layout",
      label: "Layout",
      status: "FUTURE",
      description: "Will define how operators see and organize Workspace information.",
      summary: null,
    },
    {
      key: "metrics",
      label: "Metrics",
      status: "FUTURE",
      description: "Will define what administrators measure for this Workspace type.",
      summary: null,
    },
  ];
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
      `Define how a ${input.name} Workspace should operate for ${contextLabel(
        input.context,
      )}.`,
    typicalUsage: `Use when ${contextLabel(
      input.context,
    )} needs a standard Workspace for ${input.name} work.`,
    expectedResult: `A ${input.name} Workspace with Items, Activity, and Discussion organized around one operating model.`,
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
      activityLabel: "Activity history",
      discussionLabel: "Discussion",
      steps: [
        "Administrator selects this Blueprint when creating a Workspace inside a Space.",
        "Workspace stores a snapshot of the Blueprint selection.",
        "Operators add or receive Items inside the Workspace.",
        "Items execute the Workflow capability and generate Activity and Discussion.",
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
  },
  workflow: BlueprintWorkflowCapability,
): BlueprintExperience {
  return buildExperience({
    key: draft.key,
    name: draft.name,
    description:
      draft.description ??
      "Draft a standardized way for a future Workspace to operate.",
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

  return {
    key: workType.key,
    name: workType.title,
    description: workType.metadata?.description
      ? String(workType.metadata.description)
      : null,
    icon: workType.icon,
    category: "Workspace Blueprint",
    businessContext: workType.coordinationContext,
    source: "REGISTRY",
    registrySource: workType.key,
    experience: buildExperience({
      key: workType.key,
      name: workType.title,
      description: workType.metadata?.description
        ? String(workType.metadata.description)
        : null,
      context: workType.coordinationContext,
      ownerLabel: workType.defaultOwnerRole,
      workflow,
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

    return {
      key: draft.key,
      name: draft.name,
      description: draft.description,
      icon: null,
      category: "Draft Blueprint",
      businessContext: "DRAFT",
      source: "DRAFT",
      registrySource: draft.sourceRegistryKey,
      experience: buildDraftExperience(draft, workflow),
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

function snapshotNoteForBlueprint(workTypeKey: string) {
  const workType = listAllWorkTypes().find((item) => item.key === workTypeKey);
  const workflowKey = workType?.workflowKey ?? null;
  const snapshot = {
    blueprintKey: workTypeKey,
    blueprintName: workType?.title ?? workTypeKey,
    workflowKey,
    snapshotAt: new Date().toISOString(),
    source: "REGISTRY",
  };

  return [
    `blueprintKey: ${workTypeKey}`,
    `workTypeKey: ${workTypeKey}`,
    workflowKey ? `workflowKey: ${workflowKey}` : null,
    `blueprintSnapshot: ${JSON.stringify(snapshot)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function listWorkspaceInstantiationBlueprintOptions(
  context: WorkTypeCoordinationContext,
): WorkspaceInstantiationBlueprintOption[] {
  return listWorkTypes(context).map((workType) => ({
    key: workType.key,
    name: workType.title,
    description: workType.metadata?.description
      ? String(workType.metadata.description)
      : null,
    workflowKey: workType.workflowKey,
    businessContext: workType.coordinationContext,
    snapshotNote: snapshotNoteForBlueprint(workType.key),
  }));
}
