import type { CarrierCode, CarrierEnvironment } from "./carrier.types";

const productionHosts = new Set([
  "online-gateway.ghn.vn", "services.giaohangtietkiem.vn", "partner.viettelpost.vn", "partner-api.ahamove.com",
]);

export function carrierEnvironment(): CarrierEnvironment {
  const value = String(process.env.CARRIER_ENVIRONMENT ?? "mock").trim().toLowerCase();
  if (value === "staging" || value === "production") return value;
  return "mock";
}

export function assertSafeCarrierBaseUrl(baseUrl: string, environment = carrierEnvironment()) {
  const parsed = new URL(baseUrl);
  if (environment !== "production" && productionHosts.has(parsed.hostname)) {
    throw new Error(`CARRIER_PRODUCTION_ENDPOINT_FORBIDDEN:${parsed.hostname}`);
  }
  if (environment === "mock" && !["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error(`CARRIER_EXTERNAL_ENDPOINT_FORBIDDEN_IN_MOCK:${parsed.hostname}`);
  }
  return parsed.toString().replace(/\/$/, "");
}

export function enabledCarrierCode(): CarrierCode {
  const value = String(process.env.CARRIER_PROVIDER ?? "MOCK").trim().toUpperCase();
  if (["GHN", "GHTK", "VIETTEL_POST", "AHAMOVE"].includes(value)) return value as CarrierCode;
  return "MOCK";
}
