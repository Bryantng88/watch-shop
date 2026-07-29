import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const consumers = [
  "src/domains/coordination/ui/FlowItemListView.tsx",
  "src/domains/coordination/ui/OperationCoordinationWorkspace.tsx",
  "src/domains/task/ui/task-work/QueueWorkQueue.tsx",
];
const failures = [];

for (const file of consumers) {
  const source = read(file);
  if (!source.includes("manualTransitionOutcomeMovesOutOfCurrentStage")) {
    failures.push(`${file}: reconciliation must use final transition outcome`);
  }
  if (source.includes("manualTransitionMovesOutOfCurrentStage(")) {
    failures.push(`${file}: reconciliation still infers movement from requested transition`);
  }
}

const actionSource = read("src/domains/task/actions/task.actions.ts");
if (!actionSource.includes("toState: result.result.toState ?? null")) {
  failures.push("bulk manual-transition result must expose final toState");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Manual transition outcome contract is valid.");
