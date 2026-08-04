import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

import { PERMISSIONS } from "../src/constants/permissions";
import {
  getAdminApiPolicy,
  getAdminPagePolicy,
  isAdminAccessAllowed,
} from "../src/server/auth/admin-api-policy";

const root = process.cwd();

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function routePath(file: string, base: string) {
  const relative = path.relative(base, path.dirname(file)).split(path.sep);
  const segments = relative
    .filter((segment) => !segment.startsWith("("))
    .map((segment) => segment.replace(/^\[.+\]$/, "sample"));
  return `/${segments.join("/")}`.replace(/\/$/, "");
}

function allowed(policy: ReturnType<typeof getAdminApiPolicy>, ...permissions: string[]) {
  return isAdminAccessAllowed(policy, new Set(permissions));
}

const failures: string[] = [];
const apiBase = path.join(root, "src", "app", "api");
const adminApiBase = path.join(apiBase, "admin");
const apiRoutes = walk(adminApiBase).filter((file) => path.basename(file) === "route.ts");
let apiMethodCount = 0;

for (const file of apiRoutes) {
  const source = fs.readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const handlers = sourceFile.statements.filter((statement): statement is ts.FunctionDeclaration =>
    ts.isFunctionDeclaration(statement) &&
    Boolean(statement.name && statement.body) &&
    ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(statement.name!.text) &&
    Boolean(statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)),
  );
  const pathname = `/api${routePath(file, apiBase)}`;
  for (const handler of handlers) {
    const method = handler.name!.text;
    apiMethodCount += 1;
    const policy = getAdminApiPolicy(pathname, method);
    if (!policy) {
      failures.push(`API_POLICY_MISSING ${method} ${pathname}`);
      continue;
    }
    const body = handler.body!.getText(sourceFile);
    const innerPermissions = [...body.matchAll(/require(?:Any)?Permission(?:Api)?\s*\(\s*PERMISSIONS\.([A-Z0-9_]+)/g)]
      .map((match) => PERMISSIONS[match[1] as keyof typeof PERMISSIONS])
      .filter(Boolean);
    for (const permission of innerPermissions) {
      if (!allowed(policy, permission)) {
        failures.push(`API_INNER_POLICY_MISMATCH ${method} ${pathname} ${permission}`);
      }
    }
  }
}

const adminPageBase = path.join(root, "src", "app", "(admin)", "admin");
const adminPages = walk(adminPageBase).filter((file) => path.basename(file) === "page.tsx");
for (const file of adminPages) {
  const pathname = `/admin${routePath(file, adminPageBase)}`.replace(/\/index$/, "");
  const policy = getAdminPagePolicy(pathname);
  if (!policy) {
    failures.push(`PAGE_POLICY_MISSING ${pathname}`);
    continue;
  }
  const source = fs.readFileSync(file, "utf8");
  const innerPermissions = [...source.matchAll(/require(?:Any)?Permission\s*\(\s*PERMISSIONS\.([A-Z0-9_]+)/g)]
    .map((match) => PERMISSIONS[match[1] as keyof typeof PERMISSIONS])
    .filter(Boolean);
  for (const permission of innerPermissions) {
    if (!allowed(policy, permission)) failures.push(`PAGE_INNER_POLICY_MISMATCH ${pathname} ${permission}`);
  }
}

const serverActionFiles = walk(path.join(root, "src")).filter((file) => {
  if (!file.endsWith(".ts") && !file.endsWith(".tsx")) return false;
  return fs.readFileSync(file, "utf8").startsWith('"use server"');
});
let serverActionCount = 0;

for (const file of serverActionFiles) {
  const source = fs.readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const functions = new Map<string, ts.FunctionDeclaration>();
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name && statement.body) {
      functions.set(statement.name.text, statement);
    }
  }

  const secured = new Set<string>();
  for (const [name, declaration] of functions) {
    const body = declaration.body?.getText(sourceFile) ?? "";
    if (/require(?:Any)?Permission(?:Api)?\s*\(/.test(body)) secured.add(name);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, declaration] of functions) {
      if (secured.has(name)) continue;
      const body = declaration.body?.getText(sourceFile) ?? "";
      if ([...secured].some((helper) => new RegExp(`\\b${helper}\\s*\\(`).test(body))) {
        secured.add(name);
        changed = true;
      }
    }
  }

  const publicLoginService = /[\\/]admin[\\/](?:users[\\/])?_server[\\/]auth\.service\.ts$/.test(file);
  for (const [name, declaration] of functions) {
    const exported = declaration.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;
    serverActionCount += 1;
    if (!secured.has(name) && !(publicLoginService && name === "loginService")) {
      failures.push(`SERVER_ACTION_AUTH_MISSING ${path.relative(root, file)}#${name}`);
    }
  }
}

const cases: Array<[string, boolean]> = [
  ["order create accepts ORDER_CREATE", allowed(getAdminApiPolicy("/api/admin/orders", "POST"), PERMISSIONS.ORDER_CREATE)],
  ["order create rejects ORDER_UPDATE", !allowed(getAdminApiPolicy("/api/admin/orders", "POST"), PERMISSIONS.ORDER_UPDATE)],
  ["order cancel accepts ORDER_DELETE", allowed(getAdminApiPolicy("/api/admin/orders/sample/cancel", "POST"), PERMISSIONS.ORDER_DELETE)],
  ["order cancel rejects ORDER_UPDATE", !allowed(getAdminApiPolicy("/api/admin/orders/sample/cancel", "POST"), PERMISSIONS.ORDER_UPDATE)],
  ["watch review accepts PRODUCT_APPROVE", allowed(getAdminApiPolicy("/api/admin/watches/sample/image-review", "POST"), PERMISSIONS.PRODUCT_APPROVE)],
  ["watch review rejects PRODUCT_UPDATE", !allowed(getAdminApiPolicy("/api/admin/watches/sample/image-review", "POST"), PERMISSIONS.PRODUCT_UPDATE)],
  ["acquisition post accepts ACQUISITION_APPROVE", allowed(getAdminApiPolicy("/api/admin/acquisitions/sample/post", "POST"), PERMISSIONS.ACQUISITION_APPROVE)],
  ["acquisition cancel accepts ACQUISITION_DELETE", allowed(getAdminApiPolicy("/api/admin/acquisitions/sample/cancel", "POST"), PERMISSIONS.ACQUISITION_DELETE)],
  ["shipment create accepts SHIPMENT_CREATE", allowed(getAdminApiPolicy("/api/admin/shipments", "POST"), PERMISSIONS.SHIPMENT_CREATE)],
  ["service create accepts SERVICE_CREATE", allowed(getAdminApiPolicy("/api/admin/service-requests", "POST"), PERMISSIONS.SERVICE_CREATE)],
  ["technical issue delete accepts SERVICE_DELETE", allowed(getAdminApiPolicy("/api/admin/technical-issues/sample", "DELETE"), PERMISSIONS.SERVICE_DELETE)],
  ["payment transition reaches coarse gate", allowed(getAdminApiPolicy("/api/admin/task-items/manual-transition", "POST"), PERMISSIONS.PAYMENT_UPDATE)],
  ["accessory acquisition page accepts strap view", allowed(getAdminPagePolicy("/admin/acquisitions"), PERMISSIONS.STRAP_ACQUISITION_VIEW)],
  ["reports page accepts REPORT_VIEW", allowed(getAdminPagePolicy("/admin/reports"), PERMISSIONS.REPORT_VIEW)],
];

for (const [label, passed] of cases) {
  if (!passed) failures.push(`POLICY_ASSERTION_FAILED ${label}`);
}

const result = {
  ok: failures.length === 0,
  apiRouteCount: apiRoutes.length,
  apiMethodCount,
  adminPageCount: adminPages.length,
  serverActionFileCount: serverActionFiles.length,
  serverActionCount,
  assertionCount: cases.length,
  failures,
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
