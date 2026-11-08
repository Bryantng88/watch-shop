export type MediaDraft = {
  title: string;
  body: string;
  sources: {title: string; url: string}[];
  notes: string[];
  apply: () => boolean;
};

export type MediaEditor = {
  productId: string;
  title: string;
  sku: string;
  section: string;
  draft: () => Promise<MediaDraft>;
};

type Entry = {source: Window; editor: MediaEditor};
type MediaHost = Window & {benMediaEditors?: Entry[]};
const changed = "ben-media-editor-changed";

export function registerMediaEditor(editor: MediaEditor) {
  const host = window.parent as MediaHost;
  if (host !== window && !window.frameElement) {
    return;
  }
  const entry = {source: window, editor};
  const entries = host.benMediaEditors ??= [];
  entries.push(entry);
  host.dispatchEvent(new Event(changed));
  const unregister = () => {
    window.removeEventListener("pagehide", unregister);
    const index = entries.indexOf(entry);
    if (index === -1) return;
    entries.splice(index, 1);
    host.dispatchEvent(new Event(changed));
  };
  window.addEventListener("pagehide", unregister);
  return unregister;
}

export function currentMediaEditor(host: Window = window) {
  return (host as MediaHost).benMediaEditors?.findLast(({source}) =>
    source === host || source.frameElement?.isConnected
  )?.editor;
}

export function subscribeMediaEditor(listener: () => void) {
  window.addEventListener(changed, listener);
  return () => window.removeEventListener(changed, listener);
}
