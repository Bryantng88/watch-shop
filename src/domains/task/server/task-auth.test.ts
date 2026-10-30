import assert from "node:assert/strict";
import test from "node:test";
import { authCanViewAllTasks } from "./task-auth";

test("task list and detail use one explicit global-visibility policy", () => {
  for (const auth of [{ role: "ADMIN" }, { role: { name: "ADMIN" } }, { user: { role: "ADMIN" } }, { roles: ["ADMIN"] }, { permissions: ["TASK_VIEW_ALL"] }]) assert.equal(authCanViewAllTasks(auth), true);
  for (const auth of [null, {}, { role: "USER" }, { permissions: ["TASK_VIEW"] }, { roles: "ADMIN" }]) assert.equal(authCanViewAllTasks(auth), false);
});
