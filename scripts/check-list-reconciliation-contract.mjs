import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const guardedFiles = [
  "src/domains/coordination/ui/FlowItemListView.tsx",
  "src/domains/watch/client/WatchListClient.tsx",
];
const violations = [];

for (const relativePath of guardedFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  if (/\brouter\.refresh\s*\(\s*\)/.test(source)) {
    violations.push(relativePath);
  }
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
