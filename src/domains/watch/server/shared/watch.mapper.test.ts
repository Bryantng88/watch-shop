import assert from "node:assert/strict";
import test from "node:test";
import { mapWatchDetail } from "./watch.mapper";
import { mapWatchDetailToFormValues } from "../../client/form/watch-form.mapper";
import { mediaContentValues } from "../../shared/media-part-values";

test("persisted hashtags survive detail → form → save comparisons when only Cover changes", () => {
  const content = {
    titleOverride: "Seiko LM",
    hookText: "Đồng hồ Seiko",
    body: "Nội dung đã hoàn tất",
    bulletSpecs: ["Automatic"],
    hashTags: "#Seiko #LordMatic",
  };
  const detail = mapWatchDetail({
    id: "watch-fixture",
    product: { id: "product-fixture", title: "Seiko LM", status: "DRAFT", productImage: [], postTargets: [] },
    watchContent: content,
    reviewStates: [],
  });
  const form = mapWatchDetailToFormValues(detail);
  assert.equal(form.content.hashTags, content.hashTags);
  assert.deepEqual(mediaContentValues(form.content), mediaContentValues(content));
  form.media.coverImage = { key: "different-cover.jpg" };
  assert.deepEqual(mediaContentValues(form.content), mediaContentValues(content));
  form.content.hashTags = "#Changed";
  assert.notDeepEqual(mediaContentValues(form.content), mediaContentValues(content));
});
