import assert from "node:assert/strict";
import test from "node:test";
import { getAuthUserId } from "./auth-user-id";

test("server auth IDs support the existing shapes and reject non-string identities", () => {
  for (const auth of [{ id: "a" }, { userId: "a" }, { user: { id: "a" } }]) assert.equal(getAuthUserId(auth), "a");
  assert.equal(getAuthUserId({ id: "b", user: { id: "a" } }), "a");
  for (const auth of [null, undefined, [], "a", { id: 1 }, { id: " " }, { user: { id: {} } }]) assert.equal(getAuthUserId(auth), null);
});
