import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HomeView from "./HomeView";
import { defaultHome, emptyImage } from "./contract";
test("legacy missing about and collection images render compact content instead of public placeholder panels", () => {
  const content = defaultHome();
  content.sections = content.sections.map((s) =>
    s.id === "hero" ? { ...s, enabled: false } : s,
  );
  const html = renderToStaticMarkup(
    React.createElement(HomeView, {
      content,
      images: {},
      watches: [],
      journal: null,
    }),
  );
  assert.ok(!html.includes("vg-image-empty"));
  assert.ok(!html.includes("vg-about-image"));
  assert.ok(!html.includes("vg-collection-image"));
  assert.ok(html.includes("Một chiếc đồng hồ."));
  assert.ok(html.includes("Thanh lịch"));
  assert.ok(html.includes("/products?style=DRESS"));
});
test("charcoal is explicit and configured collection photos render while legacy theme remains light", () => {
  const content = defaultHome();
  content.hero.theme = "charcoal";
  const images = {
    hero: { ...emptyImage(), url: "/hero.webp" },
    "collection-0": { ...emptyImage(), url: "/collection.webp" },
  };
  const html = renderToStaticMarkup(
    React.createElement(HomeView, {
      content,
      images,
      watches: [],
      journal: null,
    }),
  );
  assert.ok(html.includes("vg-hero--charcoal"));
  assert.ok(html.includes("/collection.webp"));
  content.hero.theme = "light";
  assert.ok(
    !renderToStaticMarkup(
      React.createElement(HomeView, {
        content,
        images,
        watches: [],
        journal: null,
      }),
    ).includes("vg-hero--charcoal"),
  );
});
