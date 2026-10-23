import assert from "node:assert/strict";
import test from "node:test";
import { PersonalTaskShareAccess } from "@prisma/client";
import { personalWorkEditAccessWhere } from "./personal-work-access";

test("calendar write access includes editors but never viewers", () => {
  const where = personalWorkEditAccessWhere("user-1");
  const serialized = JSON.stringify(where);

  assert.match(serialized, new RegExp(PersonalTaskShareAccess.EDITOR));
  assert.doesNotMatch(serialized, new RegExp(PersonalTaskShareAccess.VIEWER));
  assert.equal(where.OR?.length, 3);
});

