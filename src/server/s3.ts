import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT!,          // https://<myqnapcloud>:8010
    region: process.env.S3_REGION || "us-east-1",
    forcePathStyle: true,
    // Some S3-compatible providers (including the production NAS) reject the
    // CRC32 header that AWS SDK v3 adds to uploads by default. S3 PutObject
    // does not require that checksum, so only send one when an operation does.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,   // nhớ giữ prefix storage-space
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },

});


export const S3_BUCKET = process.env.S3_BUCKET!;
export const PUBLIC_BASE = `${process.env.S3_ENDPOINT}/${S3_BUCKET}`;
