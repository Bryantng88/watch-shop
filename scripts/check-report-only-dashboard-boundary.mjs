import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const sourceRoot = join(root, "src");
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const excludedPrefixes = [
  "src\\app\\(admin)\\admin\\dashboard\\",
  "src\\app\\(admin)\\admin\\reports\\",
  "src\\domains\\dashboard\\",
  "src\\domains\\report\\",
  "src\\app\\api\\admin\\watches\\dashboard\\",
  "src\\app\\api\\admin\\coordination\\operation\\dashboard\\",
  "src\\app\\api\\media\\assets\\dashboard\\",
];
const forbidden = [
  /\b(?:Async)?BusinessListDashboard\b/,
  /\bDashboardCustomizeButton\b/,
  /admin-dashboard:/,
  /\bdashboard\s*=\s*\{/,
  /fetch\(\s*["'`]\/api\/(?:admin\/watches|media\/assets|admin\/coordination\/operation)\/dashboard/,
];

function filesUnder(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

const violations = [];
for (const path of filesUnder(sourceRoot)) {
  if (!sourceExtensions.has(extname(path))) continue;
  const repoPath = relative(root, path);
  if (excludedPrefixes.some((prefix) => repoPath.startsWith(prefix))) continue;
  const source = readFileSync(path, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(source)) violations.push(`${repoPath}: ${pattern}`);
  }
}

if (violations.length) {
  console.error("Report-only dashboard boundary violations:\n" + violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Report-only dashboard boundary: OK");
}
