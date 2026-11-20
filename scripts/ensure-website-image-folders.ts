/** Staging-only folder initialization; production folders appear on first authorized upload. */
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../src/server/s3";
import { WEBSITE_IMAGE_FOLDERS } from "../src/domains/storefront/media/website-media";
async function main() {
  if (process.env.APP_URL !== "https://admin-staging.vinticwatches.vn" || !/staging|test/i.test(S3_BUCKET || "")) throw new Error("Staging storage guard failed.");
  const apply = process.argv.includes("--apply");
  for (const folder of WEBSITE_IMAGE_FOLDERS) {
    let exists = true;
    try { await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: folder.prefix })); }
    catch (error) {
      const detail = error as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (detail.$metadata?.httpStatusCode === 404 || ["NotFound", "NoSuchKey"].includes(detail.name || "")) exists = false;
      else throw new Error("Cannot verify website storage folder.");
    }
    if (!exists && apply) await s3.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: folder.prefix, Body: new Uint8Array(), ContentType: "application/x-directory" }));
    console.log(JSON.stringify({ folder: folder.id, state: exists ? "exists" : apply ? "created" : "missing" }));
  }
}
main().catch(() => { console.error("Website folder initialization failed; no credentials printed."); process.exitCode = 1; });
