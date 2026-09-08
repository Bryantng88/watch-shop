import assert from "node:assert/strict";
import test from "node:test";

import { MediaBindingLifecycle, MediaRole } from "@prisma/client";

import { watchMediaPoolBindingWhere } from "./media-command.service";

test("Watch media pool keeps every active Gallery lifecycle after reopening", () => {
  const where = watchMediaPoolBindingWhere({ watchId: "watch-1" });

  assert.equal(where.role, MediaRole.GALLERY);
  assert.deepEqual(where.lifecycle, { not: MediaBindingLifecycle.REMOVED });
});

test("Watch media pool limits active recovery to the requested role", () => {
  const where = watchMediaPoolBindingWhere({
    watchId: "watch-1",
    role: MediaRole.COVER,
  });

  assert.equal(where.role, MediaRole.COVER);
  assert.deepEqual(where.lifecycle, { not: MediaBindingLifecycle.REMOVED });
});

