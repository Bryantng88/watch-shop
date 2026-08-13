import { enabledCarrierCode } from "./carrier.config";
import { MockCarrierAdapter } from "./mock-carrier.adapter";
import { ViettelPostCarrierAdapter } from "./viettel-post.adapter";
import type { CarrierAdapter, CarrierCode } from "./carrier.types";

export function getCarrierAdapter(code: CarrierCode = enabledCarrierCode()): CarrierAdapter {
  if (code === "MOCK") return new MockCarrierAdapter();
  if (code === "VIETTEL_POST") return new ViettelPostCarrierAdapter();
  throw new Error(`CARRIER_ADAPTER_NOT_CONFIGURED:${code}`);
}
