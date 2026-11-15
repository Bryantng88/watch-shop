"use client";
export const MEDIA_DAILY_CHANGED = "watch-media-daily-changed";
export function mediaDailyChanged(productId: string) {
  const send = (target: Window) =>
    target.dispatchEvent(
      new CustomEvent(MEDIA_DAILY_CHANGED, { detail: { productId } }),
    );
  send(window);
  if (window.parent !== window) {
    try {
      send(window.parent);
    } catch {
      /* Cross-origin hosts do not receive application events. */
    }
  }
}
