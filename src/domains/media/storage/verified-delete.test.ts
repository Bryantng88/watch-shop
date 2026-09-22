import assert from "node:assert/strict";
import test from "node:test";

import { deleteStoredObjectWithVerification } from "./verified-delete";

test("verified delete retries until the source disappears", async () => {
  let deleteAttempts = 0;

  await deleteStoredObjectWithVerification({
    key: "media/men/edit/watch.jpg",
    deleteOnce: async () => {
      deleteAttempts += 1;
    },
    sourceExists: async () => deleteAttempts < 3,
    retryDelaysMs: [0, 0],
  });

  assert.equal(deleteAttempts, 3);
});

test("verified delete fails instead of silently leaving the source behind", async () => {
  await assert.rejects(
    deleteStoredObjectWithVerification({
      key: "media/men/edit/watch.jpg",
      deleteOnce: async () => undefined,
      sourceExists: async () => true,
      retryDelaysMs: [0, 0],
    }),
    /Media delete could not be verified/,
  );
});
