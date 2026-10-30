import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const violations = [];
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
      const source = readFileSync(file, "utf8");
      if (/from\s+["']@\/domains\/task\/server\/core\//.test(source)) violations.push(file);
    }
  }
}
visit("src/domains/personal-work");
if (violations.length) {
  console.error("Personal work must not depend on parent-task creation/query services:", violations);
  process.exitCode = 1;
} else console.log("Personal-work boundary: OK (independent work, no parent-task service dependency)");
