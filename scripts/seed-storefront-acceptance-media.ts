import { CreateBucketCommand, HeadBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

const endpoint = process.env.S3_ENDPOINT?.trim();
const bucket = process.env.S3_BUCKET?.trim();
if (!endpoint || !bucket) throw new Error("S3_ENDPOINT and S3_BUCKET are required");

const parsed = new URL(endpoint);
if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname) || !bucket.includes("test")) {
  throw new Error("Acceptance media requires loopback S3 and a test bucket");
}

const client = new S3Client({
  endpoint,
  region: process.env.S3_REGION ?? "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
});

const fixtures = [
  ["omega-seamaster", "OMEGA", "SEAMASTER", "#19384f", "#d7e6ed"],
  ["rolex-datejust", "ROLEX", "DATEJUST 36", "#214436", "#dce6dc"],
  ["seiko-king", "KING SEIKO", "HI-BEAT", "#5a4939", "#eee3d5"],
  ["omega-constellation", "OMEGA", "CONSTELLATION", "#643f48", "#eedde0"],
  ["rolex-oyster", "ROLEX", "OYSTER PERPETUAL", "#334b54", "#dce7e9"],
  ["seiko-presage", "SEIKO", "PRESAGE ENAMEL", "#403d3a", "#ebe7df"],
] as const;

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[char] ?? char);
}

async function main() {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: bucket }));
  }

  for (const [slug, brand, model, ink, background] of fixtures) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <rect width="600" height="800" fill="${background}"/>
      <rect x="247" y="36" width="106" height="220" rx="45" fill="${ink}" opacity=".9"/>
      <rect x="247" y="544" width="106" height="220" rx="45" fill="${ink}" opacity=".9"/>
      <circle cx="300" cy="400" r="184" fill="#f9f7f2" stroke="${ink}" stroke-width="20"/>
      <circle cx="300" cy="400" r="145" fill="none" stroke="${ink}" stroke-width="3" opacity=".32"/>
      <line x1="300" y1="400" x2="300" y2="305" stroke="${ink}" stroke-width="10" stroke-linecap="round"/>
      <line x1="300" y1="400" x2="380" y2="430" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="300" cy="400" r="12" fill="${ink}"/>
      <text x="300" y="455" text-anchor="middle" fill="${ink}" font-family="Arial, sans-serif" font-size="24" letter-spacing="5">${escapeXml(brand)}</text>
      <text x="300" y="492" text-anchor="middle" fill="${ink}" font-family="Arial, sans-serif" font-size="15" letter-spacing="3">${escapeXml(model)}</text>
    </svg>`;
    const body = await sharp(Buffer.from(svg)).png().toBuffer();
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: `storefront-acceptance/${slug}.png`,
      Body: body,
      ContentType: "image/png",
      CacheControl: "no-store",
    }));
  }

  console.log(JSON.stringify({ ok: true, endpoint, bucket, images: fixtures.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
