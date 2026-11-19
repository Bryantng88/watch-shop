import assert from "node:assert/strict";
import test from "node:test";

import { resolveSharpBatchSelection } from "./sharp-batch-selection";

test("Sharp batch is ready only when every selected image is done", () => {
  const result = resolveSharpBatchSelection(new Set(["a", "b"]), {
    a: { status: "done" },
    b: { status: "error" },
    c: { status: "done" },
  });
  assert.deepEqual(result.readyKeys, ["a"]);
  assert.deepEqual(result.incompleteKeys, ["b"]);
  assert.equal(result.allSelectedReady, false);
});

test("Sharp batch ignores completed images that are no longer selected", () => {
  const result = resolveSharpBatchSelection(new Set(["a"]), {
    a: { status: "done" },
    b: { status: "done" },
  });
  assert.deepEqual(result.readyKeys, ["a"]);
  assert.equal(result.allSelectedReady, true);
});
