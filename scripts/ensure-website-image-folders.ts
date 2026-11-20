/** Staging-only folder initialization; production folders appear on first authorized upload. */
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../src/server/s3";
import { websiteStorageConfiguration } from "../src/domains/storefront/media/website-media.storage";
import { WEBSITE_IMAGE_FOLDERS } from "../src/domains/storefront/media/website-media";
async function main() {
  if (process.env.APP_URL !== "https://admin-staging.vinticwatches.vn") throw new Error("Staging application guard failed.");
  const configuration = websiteStorageConfiguration(process.env);
  if (configuration && !process.argv.includes("--shared-website")) throw new Error("Shared website storage requires explicit mode.");
  if (!configuration && !/staging|test/i.test(S3_BUCKET || "")) throw new Error("Staging storage guard failed.");
  const bucket = configuration?.bucket || S3_BUCKET;
  const client = configuration ? new S3Client({ endpoint: configuration.endpoint, region: configuration.region, forcePathStyle: true, requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED", credentials: { accessKeyId: configuration.accessKeyId, secretAccessKey: configuration.secretAccessKey } }) : s3;
  const apply = process.argv.includes("--apply");
  for (const folder of WEBSITE_IMAGE_FOLDERS) {
    let exists = true;
    try { await client.send(new HeadObjectCommand({ Bucket: bucket, Key: folder.prefix })); }
    catch (error) {
      const detail = error as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (detail.$metadata?.httpStatusCode === 404 || ["NotFound", "NoSuchKey"].includes(detail.name || "")) exists = false;
      else throw new Error("Cannot verify website storage folder.");
    }
    if (!exists && apply) await client.send(new PutObjectCommand({ Bucket: bucket, Key: folder.prefix, Body: new Uint8Array(), ContentType: "application/x-directory" }));
    console.log(JSON.stringify({ folder: folder.id, state: exists ? "exists" : apply ? "created" : "missing" }));
  }
}
main().catch(() => { console.error("Website folder initialization failed; no credentials printed."); process.exitCode = 1; });
