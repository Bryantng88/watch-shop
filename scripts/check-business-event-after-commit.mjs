import fs from "node:fs";
import path from "node:path";

const roots = ["src/domains", "src/app"];
const managedMarker = "runBusinessEventTransaction";
const eventPattern = /(?:recordBusinessEvent|emit[A-Za-z0-9]+Event)\(tx\b/;
const transactionPattern = /(?:prisma|client|db)\.\$transaction\s*\(/;

// Reviewed legacy producers already forward deferConsumers or explicitly drain
// delivery keys. Keep this list shrinking as they move to the managed wrapper.
const reviewedLegacy = new Set([
  "src/domains/service/application/assign-service-vendor.application.ts",
  "src/domains/service/application/complete-service-request.application.ts",
  "src/domains/service/application/post-service-requests.application.ts",
  "src/domains/service/server/issue-board/service-issue-board.service.ts",
  "src/domains/service/server/technical/technical-assessment.service.ts",
  "src/domains/service/server/watch-quick/watch-active-service.service.ts",
  "src/domains/payment/server/payment-operation-action-adapter.ts",
  "src/domains/payment/server/payment.core.ts",
  "src/domains/watch/application/submit-watch-form/submit-watch-form.application.ts",
]);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target);
    return entry.isFile() && /\.(ts|tsx)$/.test(entry.name) ? [target] : [];
  });
}

const violations = [];
for (const file of roots.flatMap(walk)) {
  const normalized = file.replaceAll("\\", "/");
  if (normalized.endsWith("business-event.service.ts")) continue;
  const source = fs.readFileSync(file, "utf8");
  if (!eventPattern.test(source) || !transactionPattern.test(source)) continue;
  if (source.includes(managedMarker)) continue;
  if (reviewedLegacy.has(normalized)) continue;
  violations.push(normalized);
}

if (violations.length) {
  console.error("Business-event transaction(s) have no managed after-commit runner:");
  for (const file of violations) console.error(`- ${file}`);
  console.error("Use runBusinessEventTransaction() and delivery.track(event).");
  process.exit(1);
}

console.log("Business-event after-commit contract passed.");
