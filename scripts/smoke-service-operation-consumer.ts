import { PrismaClient } from "@prisma/client";
import {
  diagnoseBusinessEventForCoordination,
} from "@/domains/coordination/server";
import { resolveCurrentCoordinationCycle } from "@/domains/coordination/server/coordination-cycle.service";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";

const prisma = new PrismaClient();

const EVENTS = [
  "technical_issue.created",
  "technical_issue.confirmed",
  "technical_issue.started",
  "technical_issue.completed",
] as const;

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  if (index < 0) return null;
  return process.argv[index + 1] ?? null;
}

function hasFlag(name: string) {
  return process.argv.includes(name);
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function consumerStatus(value: unknown) {
  const result = asRecord(value);
  if (!Object.keys(result).length) return "missing";
  if (result.status) return String(result.status);
  if (result.skipped === true) return `skipped:${String(result.reason ?? "UNKNOWN")}`;
  return "unknown";
}

function normalized(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function eventBindingRecords(note: string | null | undefined) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  const bindings =
    snapshot?.eventBindings ??
    snapshot?.workspaceDefinition?.eventBindings ??
    [];

  return Array.isArray(bindings) ? bindings : [];
}

function serviceOperationTechnicalBindings(note: string | null | undefined) {
  return eventBindingRecords(note).filter((binding) => {
    const record = asRecord(binding);
    return (
      normalized(record.workTypeKey) === "service-operation" &&
      normalized(record.eventKey).startsWith("technical_issue")
    );
  });
}

function isBlueprintReceiver(note: string | null | undefined) {
  return /^blueprintAutoBindingReceiver:\s*true\s*$/im.test(String(note ?? ""));
}

function withoutBlueprintReceiver(note: string | null | undefined) {
  return String(note ?? "")
    .split(/\r?\n/)
    .filter((line) => !/^blueprintAutoBindingReceiver:\s*true\s*$/i.test(line.trim()))
    .join("\n")
    .trim();
}

function withBlueprintReceiver(note: string | null | undefined) {
  const base = withoutBlueprintReceiver(note);
  return base ? `blueprintAutoBindingReceiver: true\n${base}` : "blueprintAutoBindingReceiver: true";
}

async function printReceiverDiagnostics() {
  const cycle = await resolveCurrentCoordinationCycle(prisma, {
    context: "TECHNICAL",
    createIfMissing: false,
  });

  console.log("[service-operation-smoke] technical cycle task:", cycle?.task.id ?? "missing");
  if (!cycle?.task.id) return;

  const task = await prisma.task.findUnique({
    where: { id: cycle.task.id },
    select: {
      taskItems: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          note: true,
          status: true,
        },
      },
    },
  });

  for (const item of task?.taskItems ?? []) {
    const bindings = serviceOperationTechnicalBindings(item.note);
    const receiver = isBlueprintReceiver(item.note);
    const mentionsServiceOperation = normalized(item.note).includes("service-operation");
    if (!bindings.length && !receiver && !mentionsServiceOperation) continue;

    console.log(JSON.stringify({
      id: item.id,
      title: item.title,
      status: item.status,
      receiver,
      bindings: bindings.map((binding) => {
        const record = asRecord(binding);
        return {
          eventKey: record.eventKey,
          targetType: record.targetType,
          status: record.status,
          mode: record.mode,
        };
      }),
    }, null, 2));
  }
}

async function selectReceiver(taskItemId: string) {
  const cycle = await resolveCurrentCoordinationCycle(prisma, {
    context: "TECHNICAL",
    createIfMissing: false,
  });

  if (!cycle?.task.id) throw new Error("Current TECHNICAL coordination cycle was not found.");

  const task = await prisma.task.findUnique({
    where: { id: cycle.task.id },
    select: {
      taskItems: {
        select: {
          id: true,
          title: true,
          note: true,
        },
      },
    },
  });
  const candidates = (task?.taskItems ?? []).filter((item) =>
    serviceOperationTechnicalBindings(item.note).length > 0 ||
    normalized(item.note).includes("service-operation")
  );
  const selected = candidates.find((item) => item.id === taskItemId);

  if (!selected) {
    throw new Error(`TaskItem "${taskItemId}" is not a Service Operation receiver candidate.`);
  }

  for (const item of candidates) {
    const note = item.id === taskItemId
      ? withBlueprintReceiver(item.note)
      : withoutBlueprintReceiver(item.note);

    if (note !== String(item.note ?? "").trim()) {
      await prisma.taskItem.update({
        where: { id: item.id },
        data: { note },
      });
    }
  }

  console.log("[service-operation-smoke] selected receiver:", taskItemId);
}

async function resolveIssueId() {
  const explicit = argValue("--issue") ?? argValue("--issue-id");
  if (explicit) return explicit;

  const issue = await prisma.technicalIssue.findFirst({
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });

  return issue?.id ?? null;
}

async function main() {
  const apply = hasFlag("--apply");
  const receivers = hasFlag("--receivers");
  const receiverSelection = argValue("--select-receiver");

  if (receiverSelection) {
    await selectReceiver(receiverSelection);
    await printReceiverDiagnostics();
    return;
  }

  if (receivers) {
    await printReceiverDiagnostics();
    if (!hasFlag("--issue") && !hasFlag("--issue-id")) return;
  }

  const issueId = await resolveIssueId();

  if (!issueId) {
    throw new Error("No TechnicalIssue found. Pass --issue <id> or seed service data first.");
  }

  console.log("[service-operation-smoke] issue:", issueId);
  console.log("[service-operation-smoke] mode:", apply ? "apply" : "dry-run");

  for (const eventKey of EVENTS) {
    const diagnostic = await diagnoseBusinessEventForCoordination(prisma, {
      eventKey,
      targetType: "TECHNICAL_ISSUE",
      targetId: issueId,
      businessEventLogId: `smoke:${eventKey}:${issueId}`,
      metadataJson: {
        source: "service-operation-smoke",
      },
    });

    if (diagnostic.skipped) {
      console.log(eventKey, "diagnostic", `skipped:${diagnostic.reason}`);
      continue;
    }

    console.log(
      eventKey,
      "diagnostic",
      [
        `route=${diagnostic.route.workTypeKey}`,
        `mode=${diagnostic.bindingMode}`,
        `binding=${diagnostic.bindingExists ? diagnostic.bindingId : "missing"}`,
        `receiver=${diagnostic.taskItemId}`,
      ].join(" "),
    );

    if (!apply) continue;

    const event = await recordBusinessEvent(prisma, {
      eventKey,
      targetType: "TECHNICAL_ISSUE",
      targetId: issueId,
      payload: {
        source: "service-operation-smoke",
      },
    });

    console.log(
      eventKey,
      "apply",
      [
        `eventLog=${event.eventLog.id}`,
        `coordination=${consumerStatus(event.consumers.coordination)}`,
        `timeline=${consumerStatus(event.consumers.timeline)}`,
      ].join(" "),
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
