import assert from "node:assert/strict";
import test from "node:test";
import { PersonalTaskShareAccess } from "@prisma/client";
import { personalWorkEditAccessWhere, isPersonalWorkOwner } from "./personal-work-access";

test("calendar write access includes editors but never viewers", () => {
  const where = personalWorkEditAccessWhere("user-1");
  const serialized = JSON.stringify(where);

  assert.match(serialized, new RegExp(PersonalTaskShareAccess.EDITOR));
  assert.doesNotMatch(serialized, new RegExp(PersonalTaskShareAccess.VIEWER));
  assert.match(serialized, /personalOwnerUserId/);
  assert.match(serialized, /PERSONAL/);
  assert.equal(isPersonalWorkOwner({ personalOwnerUserId: "user-1", task: null }, "user-1"), true);
  assert.equal(isPersonalWorkOwner({ personalOwnerUserId: null, task: { kind: "PERSONAL", createdByUserId: "user-2", assignedToUserId: "user-1" } }, "user-1"), true);
  assert.equal(isPersonalWorkOwner({ personalOwnerUserId: "user-2", task: null }, "user-1"), false);
});

