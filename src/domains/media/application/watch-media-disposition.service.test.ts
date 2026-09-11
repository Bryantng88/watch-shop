import assert from "node:assert/strict";
import test from "node:test";

import {
  watchPoolDispositionBlockReason,
  watchPoolPostCandidate,
  watchPoolReturnCandidate,
} from "./watch-media-disposition.service";

test("Watch pool disposition allows only completely unreferenced media", () => {
  assert.equal(watchPoolDispositionBlockReason({
    productReferenceCount: 0,
    otherActiveBindingCount: 0,
    derivativeCount: 0,
  }), null);
});

test("Watch pool disposition blocks every downstream reference type", () => {
  assert.match(watchPoolDispositionBlockReason({
    productReferenceCount: 1,
    otherActiveBindingCount: 0,
    derivativeCount: 0,
  }) ?? "", /sản phẩm/);
  assert.match(watchPoolDispositionBlockReason({
    productReferenceCount: 0,
    otherActiveBindingCount: 1,
    derivativeCount: 0,
  }) ?? "", /vị trí khác/);
  assert.match(watchPoolDispositionBlockReason({
    productReferenceCount: 0,
    otherActiveBindingCount: 0,
    derivativeCount: 1,
  }) ?? "", /bản xử lý/);
});

test("Watch pool return restores the original source path inside the current edit root", () => {
  assert.equal(watchPoolReturnCandidate({
    editRoot: "media/source/MEN/edit",
    originalSourceKey: "media/source/MEN/edit/session/DSCF0001.JPG",
    currentStorageKey: "media/objects/id/original/DSCF0001.JPG",
  }), "media/source/MEN/edit/session/DSCF0001.JPG");
});

test("Watch pool return uses a visible returned folder for legacy or unsafe origins", () => {
  assert.equal(watchPoolReturnCandidate({
    editRoot: "media/source/WOMEN/edit",
    originalSourceKey: "products/edit/active/DSCF0001.JPG",
    currentStorageKey: "media/objects/id/original/DSCF0001.JPG",
  }), "media/source/WOMEN/edit/returned/DSCF0001.JPG");
});

test("Watch pool post transfer targets the isolated Media Post workspace", () => {
  assert.equal(watchPoolPostCandidate({
    mediaPostId: "post-001",
    mediaObjectId: "object-001",
    currentStorageKey: "media/objects/object-001/original/DSCF0001.JPG",
  }), "media/posts/post-001/objects/object-001/original/DSCF0001.JPG");
});
