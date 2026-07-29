import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const domainsRoot = path.join(root, "src", "domains");
const allowedRelativePaths = new Set([
  path.normalize("order/server/order-watch-sync.service.ts"),
  // These are Prisma where-clause builders, not state writers.
  path.normalize("watch/server/list/watch-list.query.ts"),
]);
const forbiddenAssignments = [
  /(?:status|productStatus)\s*:\s*ProductStatus\.HOLD/g,
  /saleStage\s*:\s*WatchSaleStage\.HOLD/g,
];

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(absolutePath);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [absolutePath] : [];
  });
}

const violations = [];

for (const absolutePath of listFiles(domainsRoot)) {
  const relativePath = path.normalize(path.relative(domainsRoot, absolutePath));
  if (allowedRelativePaths.has(relativePath)) continue;

  const source = fs.readFileSync(absolutePath, "utf8");
  for (const pattern of forbiddenAssignments) {
    pattern.lastIndex = 0;
    if (pattern.test(source)) {
      violations.push(relativePath);
      break;
    }
  }
}

if (violations.length) {
  console.error(
    [
      "HOLD ownership violation.",
      "Only Order inventory sync may write Watch/Product HOLD:",
      ...violations.map((file) => `- ${file}`),
    ].join("\n"),
  );
  process.exit(1);
}

console.log("Watch HOLD ownership check passed.");
