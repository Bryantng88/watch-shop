"use client";

import { useCallback, useRef, useState } from "react";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

export type UiMutationPhase = "idle" | "pending" | "success" | "error";

type RunUiMutationOptions<TResult, TSnapshot> = {
  key: string;
  action: () => Promise<TResult>;
  optimistic?: () => TSnapshot;
  rollback?: (snapshot: TSnapshot, error: unknown) => void;
  onSuccess?: (result: TResult) => void | Promise<void>;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string | ((error: unknown) => string);
};

function defaultErrorMessage(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : "Không thể xử lý yêu cầu. Vui lòng thử lại.";
}

export function useUiMutation() {
  const notify = useNotify();
  const pendingKeysRef = useRef(new Set<string>());
  const [phases, setPhases] = useState<Record<string, UiMutationPhase>>({});

  const phase = useCallback((key: string) => phases[key] || "idle", [phases]);
  const isPending = useCallback((key: string) => phases[key] === "pending", [phases]);
  const hasPending = Object.values(phases).some((value) => value === "pending");

  const run = useCallback(
    async <TResult, TSnapshot = undefined>({
      key,
      action,
      optimistic,
      rollback,
      onSuccess,
      onError,
      successMessage,
      errorMessage,
    }: RunUiMutationOptions<TResult, TSnapshot>): Promise<TResult | undefined> => {
      if (pendingKeysRef.current.has(key)) return undefined;

      let snapshot: TSnapshot | undefined;
      let committed = false;
      pendingKeysRef.current.add(key);
      setPhases((current) => ({ ...current, [key]: "pending" }));

      try {
        snapshot = optimistic?.();
        const result = await action();
        committed = true;
        await onSuccess?.(result);
        setPhases((current) => ({ ...current, [key]: "success" }));
        if (successMessage) notify.success(successMessage);
        return result;
      } catch (error) {
        if (!committed && optimistic && rollback) rollback(snapshot as TSnapshot, error);
        onError?.(error);
        setPhases((current) => ({ ...current, [key]: "error" }));
        notify.error(typeof errorMessage === "function" ? errorMessage(error) : errorMessage || defaultErrorMessage(error));
        return undefined;
      } finally {
        pendingKeysRef.current.delete(key);
      }
    },
    [notify],
  );

  return { run, phase, isPending, hasPending };
}
