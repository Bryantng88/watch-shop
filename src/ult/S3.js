const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const s3 = new S3Client({
    // PHẢI có giao thức:
    endpoint: "https://longnd.myqnapcloud.com:8010",
    // QuObjects không cần region thật -> đặt đại:
    region: () => Promise.resolve("us-east-1"), // dùng provider để chắc chắn SDK nhận
    forcePathStyle: true,

    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});

(async () => {
    try {
        const out = await s3.send(new ListBucketsCommand({}));
        console.log(out.Buckets);
    } catch (e) {
        console.error(e);
    }
})();
