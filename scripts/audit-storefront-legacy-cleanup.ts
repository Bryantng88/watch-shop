import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const candidates = [
  "src/app/(public)/products/page.module.css",
  "src/app/(public)/products/[slug]/detail.module.css",
  "src/data/products.ts",
  "src/components/hooks/useCart.ts",
  "src/components/common/Header/Header.tsx",
  "src/components/common/Header/Header2.tsx",
];

function sourceFiles(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  }).filter((path) => [".ts", ".tsx", ".js", ".jsx", ".css"].includes(extname(path)));
}

const files = sourceFiles("src");
const inventory = candidates.filter(existsSync).map((candidate) => {
  const basename = candidate.replaceAll("\\", "/").split("/").at(-1)!;
  const importers = files.filter((file) => file.replaceAll("\\", "/") !== candidate).filter((file) => {
    const source = readFileSync(file, "utf8");
    return source.includes(candidate.replace(/^src\//, "@/")) || (basename.endsWith(".module.css") && source.includes(basename));
  }).map((file) => relative(".", file).replaceAll("\\", "/"));
  return { candidate, importers };
});

const activePublicLegacyImports = inventory.flatMap((item) => item.importers.filter((path) => path.startsWith("src/app/(public)/") || path.startsWith("src/domains/storefront/")));
assert.deepEqual(activePublicLegacyImports, [], "New storefront must not import legacy candidates");
console.log(JSON.stringify({ ok: true, deletionAuthorized: false, inventory }, null, 2));
