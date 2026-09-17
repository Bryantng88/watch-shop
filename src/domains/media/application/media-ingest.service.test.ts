import assert from "node:assert/strict";
import test from "node:test";

import { canonicalMediaObjectIdFromKey } from "./media-ingest.service";
import { shouldReplaySucceededMove } from "./media-operation.service";

test("stale canonical keys expose the MediaObject id for relocation recovery", () => {
  assert.equal(
    canonicalMediaObjectIdFromKey(
      "media/objects/64cc7e83-234e-4f89-b69f-8166a331a8b5/original/DSCF0799(edited).JPG",
    ),
    "64cc7e83-234e-4f89-b69f-8166a331a8b5",
  );
  assert.equal(canonicalMediaObjectIdFromKey("media/men/edit/DSCF0799.JPG"), null);
});

test("a succeeded move is replayed only after its destination was returned", () => {
  assert.equal(shouldReplaySucceededMove({ sourceExists: true, destinationExists: false }), true);
  assert.equal(shouldReplaySucceededMove({ sourceExists: false, destinationExists: true }), false);
  assert.equal(shouldReplaySucceededMove({ sourceExists: true, destinationExists: true }), false);
});
