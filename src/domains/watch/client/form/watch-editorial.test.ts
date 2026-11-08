import assert from "node:assert/strict";
import test from "node:test";
import { editorialBriefSchema, editorialCopySchema, researchPublisher, eligibleEditorialFacts } from "./watch-editorial";

test("editorial briefs require a sourced basis for each fact", () => {
  const fact = { claim: "Mặt số sáng, cọc vạch thẳng.", basis: "VISIBLE", sourceUrls: [] };
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

test("regional subdomains of the same publisher count as one source", () => {
  assert.equal(researchPublisher("https://uk.bulova.com/watch"), researchPublisher("https://www.bulova.com/watch"));
  assert.equal(researchPublisher("https://www.example.co.uk/watch"), "example.co.uk");
});

test("research cannot supply exact model specs without an inventory reference", () => {
  const visible = { claim: "Vòng phút sát mép", basis: "VISIBLE" as const, sourceUrls: [] };
  const candidate = { claim: "A-11 Jimmy, 37 mm", basis: "EXACT_REFERENCE" as const, sourceUrls: [
    "https://manufacturer.example/watch", "https://archive.example/watch",
  ] };
  const sources = new Set(candidate.sourceUrls);
  assert.deepEqual(eligibleEditorialFacts([visible, candidate], false, sources), [visible]);
  assert.deepEqual(eligibleEditorialFacts([visible, candidate], true, sources), [visible, candidate]);
});
