import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const guardedFiles = [
  "src/domains/coordination/ui/FlowItemListView.tsx",
  "src/domains/watch/client/WatchListClient.tsx",
];
const requiredContracts = [
  {
    file: "src/domains/coordination/ui/FlowItemListView.tsx",
    tokens: ["waitForOperationProjectionDeliveries", "await onReloadRequested?.()"],
  },
  {
    file: "src/domains/task/ui/task-work/QueueWorkQueue.tsx",
    tokens: ["waitForOperationProjectionDeliveries", "reloadTaskItemQueueAction", "await reloadQueue()"],
  },
  {
    file: "src/domains/watch/client/WatchListClient.tsx",
    tokens: ["waitForBulkProjectionDeliveries"],
  },
];
const violations = [];

for (const relativePath of guardedFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  if (/\brouter\.refresh\s*\(\s*\)/.test(source)) {
    violations.push(relativePath);
  }
}

for (const contract of requiredContracts) {
  const source = fs.readFileSync(path.join(root, contract.file), "utf8");
  const missing = contract.tokens.filter((token) => !source.includes(token));
  if (missing.length) violations.push(`${contract.file} (missing ${missing.join(", ")})`);
}

if (violations.length) {
  console.error(
    [
      "Committed list reconciliation contract violated.",
      "Use a committed outcome plus scoped reload; do not refresh the whole page:",
      ...violations.map((file) => `- ${file}`),
    ].join("\n"),
  );
  process.exit(1);
}

console.log("Committed list reconciliation contract passed.");
