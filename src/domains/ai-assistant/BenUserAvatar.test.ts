import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import assert from "node:assert/strict";
import test from "node:test";
import { BenUserAvatar } from "./BenUserAvatar";
test("chat user avatar comes from the supplied signed-in profile and retains initials fallback", () => {
  const html = renderToStaticMarkup(
    React.createElement(BenUserAvatar, {
      profile: { name: "Long Trần", avatarUrl: "/profile/long.jpg" },
    }),
  );
  assert.ok(html.includes('aria-label="Long Trần"'));
  assert.ok(html.includes('src="/profile/long.jpg"'));
  assert.ok(html.includes("LT"));
  assert.ok(html.includes('referrerPolicy="no-referrer"'));
  const fallback = renderToStaticMarkup(React.createElement(BenUserAvatar, {}));
  assert.ok(fallback.includes('aria-label="Bạn"'));
  assert.ok(!fallback.includes("<img"));
});
