import assert from "node:assert/strict";
import test from "node:test";

import { MediaBindingLifecycle, MediaRole } from "@prisma/client";

import { watchMediaPoolBindingWhere } from "./media-command.service";

test("Watch media pool restores Gallery drafts after reopening", () => {
  const where = watchMediaPoolBindingWhere({ watchId: "watch-1" });

  assert.deepEqual(where.OR, [
    { lifecycle: MediaBindingLifecycle.SELECTED },
    {
      lifecycle: MediaBindingLifecycle.DRAFT,
      role: MediaRole.GALLERY,
    },
  ]);
});

test("Watch media pool limits draft recovery to the requested role", () => {
  const where = watchMediaPoolBindingWhere({
    watchId: "watch-1",
    role: MediaRole.COVER,
  });

  assert.equal(where.role, MediaRole.COVER);
  assert.deepEqual(where.OR[1], {
    lifecycle: MediaBindingLifecycle.DRAFT,
    role: MediaRole.COVER,
  });
});
