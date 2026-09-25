import assert from "node:assert/strict";
import test from "node:test";
import type { WatchFormValues } from "@/domains/watch/client/form/watch-form.types";
import {
  buildHashTags,
  buildHookText,
  buildPostText,
  buildPostTitle,
} from "./generate-watch-content.helpers";

test("generated hook contains one clickable storefront URL and the fixed contact copy", () => {
  const values = { basic: { slug: "seiko-alba-quartz" } } as WatchFormValues;
  const hook = buildHookText(values);
  const url = "https://vinticwatches.vn/products/seiko-alba-quartz";

  assert.equal(
    hook,
    `Xem chi tiết tại : ${url}\n\nAnh em có thể liên hệ trực tiếp qua instagram hoặc gửi yêu cầu qua link trên.`,
  );
  assert.equal((buildPostText({ title: "Seiko", hookText: hook, productUrl: url }).match(/https:\/\//g) ?? []).length, 1);
});

test("generated title and hashtags use the product brand when spec brand is empty", () => {
  const values = {
    header: { sku: "SEI-25092026-001" },
    basic: {
      title: "1974 Seiko Bellmatic 4006-7010 Automatic",
      brandName: "Seiko",
      yearText: "1974",
      movementType: "AUTOMATIC",
      style: "CLASSIC",
    },
    spec: {
      specBrand: "",
      model: "Bellmatic",
      referenceNumber: "4006-7010",
      nickname: "",
    },
  } as WatchFormValues;

  assert.equal(
    buildPostTitle(values),
    "1974 Seiko Bellmatic 4006-7010 Automatic",
  );
  assert.match(buildHashTags(values), /#Seiko/);
});
