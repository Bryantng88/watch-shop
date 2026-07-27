import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Check = {
  key: string;
  ok: boolean;
  detail: string;
};

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function contains(path: string, value: string) {
  return source(path).includes(value);
}

const clientPath =
  "src/domains/coordination/ui/OperationCoordinationWorkspace.tsx";
const dashboardRoute =
  "src/app/api/admin/coordination/operation/dashboard/route.ts";
const projectionRead =
  "src/domains/projection/server/projection-read.service.ts";
const flowRoute =
  "src/app/api/admin/coordination/operation/flows/[flowKey]/route.ts";
const boardRoute =
  "src/app/api/admin/coordination/operation/boards/[boardKey]/route.ts";
const viewConfig =
  "src/domains/space-management/server/space-view.config.ts";

const checks: Check[] = [
  {
    key: "flow-gateway-route",
    ok: contains(flowRoute, "getCoordinationFlowPage"),
    detail: "Flow route delegates to the canonical Flow Query Gateway.",
  },
  {
    key: "board-gateway-route",
    ok: contains(boardRoute, "getCoordinationBoard"),
    detail: "Board route delegates to the canonical Board Query Gateway.",
  },
  {
    key: "legacy-flow-adapter",
    ok:
      contains(dashboardRoute, "if (flowItemsOnly && modeKey)") &&
      contains(dashboardRoute, "getCoordinationFlowPage"),
    detail: "Legacy dashboard flow requests delegate to the Flow Gateway.",
  },
  {
    key: "client-canonical-flow-route",
    ok:
      contains(clientPath, "/operation/flows/") &&
      !contains(clientPath, "includeFlowItems=1"),
    detail: "Client uses /flows/:flowKey and not dashboard feature flags.",
  },
  {
    key: "client-inflight-dedupe",
    ok:
      contains(clientPath, "inFlightFlowRequestKey") &&
      contains(clientPath, "flowItemsRequestId"),
    detail: "Client deduplicates identical requests and rejects stale results.",
  },
  {
    key: "mode-switch-does-not-rerender-page",
    ok: (() => {
      const client = source(clientPath);
      const start = client.indexOf("function changeActiveViewMode");
      const end = client.indexOf("const selectedBlueprint", start);
      const modeSwitch = client.slice(start, end);
      return (
        modeSwitch.includes("window.history.pushState") &&
        !modeSwitch.includes("router.replace") &&
        !modeSwitch.includes("router.refresh")
      );
    })(),
    detail: "Changing an Operation mode updates URL/client state without rerunning Page Bootstrap.",
  },
  {
    key: "no-populated-read-rebuild",
    ok:
      contains(projectionRead, "if (count > 0)") &&
      contains(
        projectionRead,
        "A projection read must never delete/rebuild a populated read model",
      ),
    detail: "Populated projections are served; repair stays off the GET path.",
  },
  {
    key: "projection-flow-bypasses-page-bootstrap",
    ok:
      contains(
        "src/domains/coordination/server/coordination-dashboard.service.ts",
        "projectionFlowNeedsNoWorkspaceShell",
      ) &&
      contains(
        "src/domains/coordination/server/coordination-dashboard.service.ts",
        "cycleTaskId: taskId",
      ) &&
      contains(clientPath, 'params.set("taskId", data.cycle.id)'),
    detail: "Projection-native flows use the validated page cycle and skip ensureCycle/workspace shell hydration.",
  },
  {
    key: "technical-ready-stage",
    ok:
      contains(viewConfig, 'key: "ready"') &&
      contains(viewConfig, 'workspaceKey: "service-processing"'),
    detail: "Technical READY items have an explicit visible flow stage.",
  },
  {
    key: "architecture-decision",
    ok: contains(
      "docs/architecture/decisions/ADR-003-operation-read-model-query-gateways.md",
      "Operation Read Models And Query Gateways",
    ),
    detail: "The read architecture is documented as an accepted ADR.",
  },
];

const failed = checks.filter((check) => !check.ok);
console.log(JSON.stringify({
  ok: failed.length === 0,
  checks,
}, null, 2));
if (failed.length) process.exitCode = 1;
