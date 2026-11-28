import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HomeView from "./HomeView";
import { defaultHome, emptyImage } from "./contract";
import { homeSchema } from "./contract";
import { EditorialPhoto } from "./EditorialPhoto";

test("Hero zoom validates range, retains legacy defaults and keeps explicit mobile independent", () => {
  const home=defaultHome();
  assert.ok(homeSchema.safeParse(home).success);
  for(const zoom of [0.5,1,3]) {home.hero.image.zoom=zoom;assert.ok(homeSchema.safeParse(home).success);}
  for(const zoom of [0.49,3.01,Infinity,NaN]) {home.hero.image.zoom=zoom;assert.equal(homeSchema.safeParse(home).success,false);}
  const image={...emptyImage(),url:"/desktop.webp",zoom:2};
  const fallback=renderToStaticMarkup(React.createElement(EditorialPhoto,{image}));
  assert.ok(fallback.includes("--photo-zoom:2"));assert.ok(fallback.includes("--mobile-photo-zoom:2"));
  const independent=renderToStaticMarkup(React.createElement(EditorialPhoto,{image,mobile:{...emptyImage(),url:"/mobile.webp"}}));
  assert.ok(independent.includes("--mobile-photo-zoom:1"));
});
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
