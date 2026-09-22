type VerifiedDeleteInput = {
  key: string;
  deleteOnce: () => Promise<void>;
  sourceExists: () => Promise<boolean>;
  retryDelaysMs?: readonly number[];
};

const DEFAULT_RETRY_DELAYS_MS = [100, 300, 700, 1_500] as const;

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * S3-compatible appliances may acknowledge DeleteObject before the object is
 * actually gone. A delete is successful only after a follow-up HEAD confirms
 * that the source key no longer exists.
 */
export async function deleteStoredObjectWithVerification(
  input: VerifiedDeleteInput,
) {
  const delays = input.retryDelaysMs ?? DEFAULT_RETRY_DELAYS_MS;

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    await input.deleteOnce();
    if (!(await input.sourceExists())) return;
    if (attempt < delays.length) await wait(delays[attempt]);
  }

  throw new Error(`Media delete could not be verified: ${input.key}`);
}
