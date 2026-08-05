import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const MAX_SKEW_SECONDS = 300;
const tokenPattern = /^[A-Za-z0-9._:-]+$/;

export type ZaloIngressHeaders = {
  keyId: string;
  timestamp: string;
  nonce: string;
  signature: string;
};

function ingressKeys(): Record<string, string> {
  const configured = process.env.ZALO_INGRESS_KEYS?.trim();
  if (configured) {
    try {
      const parsed = JSON.parse(configured) as Record<string, unknown>;
      return Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length >= 32));
    } catch { return {}; }
  }
  const secret = process.env.ZALO_INGRESS_SECRET?.trim();
  return secret && secret.length >= 32 ? { default: secret } : {};
}

export function bodySha256(body: string) {
  return createHash("sha256").update(body, "utf8").digest("hex");
}

export function verifyZaloIngress(input: {
  method: string;
  pathAndQuery: string;
  body: string;
  headers: ZaloIngressHeaders;
  now?: Date;
}) {
  const { keyId, timestamp, nonce, signature } = input.headers;
  if (!tokenPattern.test(keyId) || keyId.length > 64 || !tokenPattern.test(nonce) || nonce.length < 16 || nonce.length > 128) {
    throw new Error("ZALO_AUTH_INVALID");
  }
  if (!/^[a-f0-9]{64}$/i.test(signature)) throw new Error("ZALO_AUTH_INVALID");
  const timestampNumber = Number(timestamp);
  const nowSeconds = Math.floor((input.now ?? new Date()).getTime() / 1_000);
  if (!Number.isInteger(timestampNumber) || Math.abs(nowSeconds - timestampNumber) > MAX_SKEW_SECONDS) {
    throw new Error("ZALO_AUTH_EXPIRED");
  }
  const secret = ingressKeys()[keyId];
  if (!secret) throw new Error("ZALO_AUTH_INVALID");
  const canonical = ["v1", timestamp, nonce, input.method.toUpperCase(), input.pathAndQuery, bodySha256(input.body)].join("\n");
  const expected = Buffer.from(createHmac("sha256", secret).update(canonical).digest("hex"), "hex");
  const actual = Buffer.from(signature, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error("ZALO_AUTH_INVALID");
  return { keyId, nonce, requestHash: bodySha256(input.body) };
}
