import assert from "node:assert/strict";
import test from "node:test";
import {currentMediaEditor, registerMediaEditor, type MediaEditor} from "./media-editor";

test("Ben follows the mounted same-origin media frame and drops it on pagehide", () => {
  const host = new EventTarget() as Window;
  const frame = Object.assign(new EventTarget(), {
    parent: host,
    frameElement: {isConnected: true},
  });
  const editor: MediaEditor = {
    productId: "watch-a",
    title: "Watch A",
    sku: "SKU-A",
    section: "Content",
    inspect: async () => "Mặt số sáng",
    showDraft: () => {},
    draft: async () => { throw new Error("Unused"); },
  };
  Object.defineProperty(globalThis, "window", {value: frame, configurable: true});
  try {
    const unregister = registerMediaEditor(editor);
    assert.equal(currentMediaEditor(host), editor);
    frame.frameElement.isConnected = false;
    assert.equal(currentMediaEditor(host), undefined);
    frame.frameElement.isConnected = true;
    frame.dispatchEvent(new Event("pagehide"));
    assert.equal(currentMediaEditor(host), undefined);
    unregister?.();
  } finally {
    Reflect.deleteProperty(globalThis, "window");
  }
});
