import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const primitive = "src/domains/shared/ui/admin-design-contract/AdminButton.tsx";
const seen = new Set(), failures = [];
let controls = 0;
function resolveImport(specifier, from) {
  const candidate = specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : specifier.startsWith(".") ? path.resolve(path.dirname(from), specifier) : null;
  if (!candidate) return;
  return [candidate, `${candidate}.tsx`, `${candidate}.ts`, `${candidate}/index.tsx`, `${candidate}/index.ts`].find(file => fs.existsSync(file) && fs.statSync(file).isFile());
}
function visitFile(file) {
  if (seen.has(file) || file.includes("/__generated__/")) return;
  seen.add(file);
  if (!/\.[jt]sx?$/.test(file)) return;
  const relative = path.relative(root, file).split(path.sep).join("/");
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const client = sf.statements.find(s => ts.isExpressionStatement(s) && ts.isStringLiteral(s.expression) && s.expression.text === "use client");
  if (client && sf.statements[0] !== client) failures.push(`${relative}: use client must precede imports`);
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const resolved = resolveImport(node.moduleSpecifier.text, file); if (resolved) visitFile(resolved);
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) {
      const resolved = resolveImport(node.arguments[0].text, file); if (resolved) visitFile(resolved);
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sf);
      const attributes = node.attributes.properties;
      const className = attributes.find(a => ts.isJsxAttribute(a) && a.name.getText(sf) === "className")?.initializer?.getText(sf) || "";
      if (["a", "Link"].includes(tag) && /action|button|btn|control/i.test(className)) failures.push(`${relative}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}: action links must use AdminLinkAction/AdminAnchorAction`);
      if (tag === "input" && attributes.some(a => ts.isJsxAttribute(a) && a.name.getText(sf) === "type" && /["'](?:submit|reset|button)["']/.test(a.initializer?.getText(sf) || ""))) failures.push(`${relative}: use AdminButton for input actions`);
      if (["button", "summary"].includes(tag) && relative !== primitive) failures.push(`${relative}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}: use AdminButton/AdminDisclosureSummary`);
      if (["AdminButton", "AdminAnchorAction", "AdminLinkAction", "AsyncActionButton"].includes(tag)) controls++;
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}
function visitDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) visitDirectory(file); else if (/\.tsx?$/.test(file)) visitFile(file);
  }
}
visitDirectory(path.join(root, "src/app/(admin)"));
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log(`Admin buttons: ${controls} shared controls, ${seen.size} reachable files; no native button/disclosure drift.`);
