import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

export const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT!,          // https://<myqnapcloud>:8010
    region: process.env.S3_REGION || "us-east-1",
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,   // nhớ giữ prefix storage-space
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },

});


export const S3_BUCKET = process.env.S3_BUCKET!;
export const PUBLIC_BASE = `${process.env.S3_ENDPOINT}/${S3_BUCKET}`;
