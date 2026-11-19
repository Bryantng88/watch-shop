"use server";
import { randomUUID } from "node:crypto";
import { unstable_rethrow } from "next/navigation";
import { submitOperationalBlueprintActionAction } from "./task.actions";
import { operationalActionFailure, type OperationalActionFailure } from "../shared/operational-action-response";
export async function submitOperationalActionResponse(input: Parameters<typeof submitOperationalBlueprintActionAction>[0]): Promise<
  {ok: true; value: Awaited<ReturnType<typeof submitOperationalBlueprintActionAction>>} | OperationalActionFailure
> {
  try {
    const result = await submitOperationalBlueprintActionAction(input);
    const value = JSON.parse(JSON.stringify(result, (_key, item) => typeof item === "bigint" ? item.toString() : item));
    return {ok: true, value};
  } catch (error) {
    unstable_rethrow(error);
    const reference = randomUUID();
    const failure = operationalActionFailure(error, reference);
    if (failure.outcome === "UNKNOWN") {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      console.error("[operational-action] Outcome requires reconciliation", {
        reference, code: /^[A-Z0-9_]{1,40}$/.test(code) ? code : "UNCLASSIFIED",
        actionKey: String(input.actionKey).slice(0, 80), targetType: String(input.targetType ?? "").slice(0, 40),
        targetId: String(input.targetId ?? "").slice(0, 80),
      });
    }
    return failure;
  }
}
