import { execFileSync } from "node:child_process";

const rules = [
  {
    label: "AWS SDK imports outside the media storage adapter",
    pattern: "@aws-sdk/client-s3",
    paths: ["src"],
    allowed: [
      "src/domains/media/storage/s3-media-storage.adapter.ts",
      "src/server/s3.ts",
    ],
  },
  {
    label: "Business domains importing the legacy media server",
    pattern: "@/domains/media/server",
    paths: ["src/domains/watch", "src/domains/acquisition"],
    allowed: [],
  },
  {
    label: "Business domains calling legacy MediaAsset write helpers",
    pattern: "upsertMediaAssetRepo",
    paths: ["src/domains/watch", "src/domains/acquisition"],
    allowed: [],
  },
  {
    label: "New canonical path literals outside MediaPathPolicy",
    pattern: "media/objects/",
    paths: ["src"],
    allowed: ["src/domains/media/core/media-path.policy.ts"],
  },
  {
    label: "Segment source path literals outside media source policy",
    pattern: "media/${segment.toLowerCase()}/${purpose}",
    paths: ["src"],
    allowed: ["src/domains/media/core/media-source-path.ts"],
  },
];

let failed = false;
for (const rule of rules) {
  let output = "";
  try {
    output = execFileSync(
      "rg",
      ["-l", "--fixed-strings", rule.pattern, ...rule.paths],
      { encoding: "utf8" },
    );
  } catch (error) {
    if (error?.status !== 1) throw error;
  }

  const violations = output
    .split(/\r?\n/)
    .filter(Boolean)
    .map((file) => file.replaceAll("\\", "/"))
    .filter((file) => !rule.allowed.includes(file));

  if (violations.length) {
    failed = true;
    console.error(`\n${rule.label}:`);
    violations.forEach((file) => console.error(`- ${file}`));
  }
}

if (failed) process.exit(1);
console.log("Media architecture boundaries are valid.");
