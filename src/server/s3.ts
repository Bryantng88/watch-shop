import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT!,          // https://<myqnapcloud>:8010
    region: process.env.S3_REGION || "us-east-1",
    forcePathStyle: true,
    // QNAP's S3-compatible endpoint rejects the optional flexible checksum
    // that recent AWS SDK versions add to PutObject requests by default.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,   // nhớ giữ prefix storage-space
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },

});


export const S3_BUCKET = process.env.S3_BUCKET!;
export const PUBLIC_BASE = `${process.env.S3_ENDPOINT}/${S3_BUCKET}`;
