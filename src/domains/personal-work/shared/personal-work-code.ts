import { isPersonalEvent } from "./personal-event";

export function personalWorkCode(id: string, number?: number | null, workType?: string | null) {
  return (isPersonalEvent(workType) ? "EV-" : "CV-") + (number ?? id.slice(0, 13).toUpperCase());
}
