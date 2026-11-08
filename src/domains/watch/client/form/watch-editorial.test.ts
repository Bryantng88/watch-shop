import assert from "node:assert/strict";
import test from "node:test";
import { editorialBriefSchema, editorialCopySchema } from "./watch-editorial";

test("editorial briefs require a sourced basis for each fact", () => {
  const fact = { claim: "Mặt số sáng, cọc vạch thẳng.", basis: "VISIBLE" };
  assert.ok(editorialBriefSchema.safeParse({ angle: "DIAL", facts: [fact] }).success);
  assert.equal(editorialBriefSchema.safeParse({ angle: "DIAL", facts: [{ ...fact, basis: "GUESSED" }] }).success, false);
  assert.equal(editorialBriefSchema.safeParse({ angle: "DIAL", facts: [] }).success, false);
});

test("public copy strips citations and rejects a body containing only a citation", () => {
  assert.deepEqual(
    editorialCopySchema.parse({ contentTitle: "Seiko SQ", contentBody: "Mặt số sáng. [Nguồn](https://example.com/watch)" }),
    { contentTitle: "Seiko SQ", contentBody: "Mặt số sáng." },
  );
  assert.equal(editorialCopySchema.safeParse({ contentTitle: "Seiko SQ", contentBody: "https://example.com/watch" }).success, false);
});
