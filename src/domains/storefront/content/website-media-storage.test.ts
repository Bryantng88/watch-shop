import assert from "node:assert/strict";
import test from "node:test";
import { S3Client } from "@aws-sdk/client-s3";
import type { MediaStorage } from "@/domains/media/storage/media-storage.port";
import { S3MediaStorage } from "@/domains/media/storage/s3-media-storage.adapter";
import { websiteStorageBoundary, websiteStorageConfiguration } from "../media/website-media.storage";

test("website override is optional, complete and independent of general media configuration", () => {
  assert.equal(websiteStorageConfiguration({ S3_BUCKET: "isolated-watch-store" }), null);
  assert.throws(() => websiteStorageConfiguration({ WEBSITE_S3_BUCKET: "shared-website" }), /incomplete/);
  const env = { WEBSITE_S3_ENDPOINT: "https://nas.example.invalid", WEBSITE_S3_BUCKET: "shared-website", WEBSITE_S3_ACCESS_KEY: "fixture-access", WEBSITE_S3_SECRET_KEY: "fixture-secret", S3_BUCKET: "isolated-watch-store" };
  assert.equal(websiteStorageConfiguration(env)?.bucket, "shared-website");
  assert.equal(env.S3_BUCKET, "isolated-watch-store");
  assert.throws(() => websiteStorageConfiguration({ ...env, WEBSITE_S3_ENDPOINT: "https://user:pass@nas.example.invalid" }), /invalid/);
});
test("shared website storage rejects watch/private keys and unrestricted listings before I/O", async () => {
  const calls: string[] = [];
  const backend = Object.fromEntries(["stat", "exists", "read", "write", "copy", "move", "delete", "sign", "list"].map(method => [method, async () => { calls.push(method); return null; }])) as unknown as MediaStorage;
  const storage = websiteStorageBoundary(backend);
  for (const key of ["media/objects/private.webp", "storefront/about/../private.webp", "storefront/hero/a.svg", "storefront/unknown/a.webp"]) {
    for (const action of [() => storage.read(key), () => storage.stat(key), () => storage.delete(key), () => storage.sign(key), () => storage.write({ key, bytes: new Uint8Array() })]) assert.throws(action, /website/);
  }
  assert.throws(() => storage.list({}), /website/);
  assert.throws(() => storage.list({ prefix: "media/" }), /website/);
  assert.throws(() => storage.copy("storefront/about/a.webp", "media/objects/a.webp"), /website/);
  assert.throws(() => storage.move({ sourceKey: "media/objects/a.webp", destinationKey: "storefront/about/a.webp" }), /website/);
  assert.deepEqual(calls, []);
  await storage.read("storefront/about/a.webp");
  await storage.list({ prefix: "storefront/hero/", cursor: "existing-cursor" });
  assert.deepEqual(calls, ["read", "list"]);
});
test("injected S3 backend uses its own bucket for reads, writes, list and copy source", async () => {
  const inputs: Array<Record<string, unknown>> = [];
  const client = { send: async (command: { input: Record<string, unknown> }) => { inputs.push(command.input); return { ContentLength: 3, Contents: [], Body: { transformToByteArray: async () => new Uint8Array([1, 2, 3]) } }; } } as unknown as S3Client;
  const storage = new S3MediaStorage(client, "website-shared-fixture");
  await storage.write({ key: "storefront/about/a.webp", bytes: new Uint8Array([1, 2, 3]) });
  await storage.read("storefront/about/a.webp");
  await storage.list({ prefix: "storefront/about/" });
  await storage.copy("storefront/about/a.webp", "storefront/about/b.webp");
  assert.ok(inputs.every(input => input.Bucket === "website-shared-fixture"));
  assert.equal(inputs.find(input => input.CopySource)?.CopySource, "website-shared-fixture/storefront/about/a.webp");
});
