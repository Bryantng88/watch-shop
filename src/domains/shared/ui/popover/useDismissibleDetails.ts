"use client";

import { useEffect, type RefObject } from "react";

const POPOVER_SELECTOR = "details[data-dismissible-popover][open]";

function closeDetails(details: HTMLDetailsElement) {
  details.removeAttribute("open");
}

/**
 * Standard outside-click and Escape dismissal for native details popovers.
 * Only explicitly marked popovers are affected; content accordions keep their
 * native behavior.
 */
export function useDismissibleDetails(
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;

      containerRef.current
        ?.querySelectorAll<HTMLDetailsElement>(POPOVER_SELECTOR)
        .forEach((details) => {
          if (!details.contains(target)) closeDetails(details);
        });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      const openDetails = containerRef.current
        ?.querySelectorAll<HTMLDetailsElement>(POPOVER_SELECTOR);
      if (!openDetails?.length) return;

      openDetails.forEach(closeDetails);
      event.stopPropagation();
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [containerRef]);
}
