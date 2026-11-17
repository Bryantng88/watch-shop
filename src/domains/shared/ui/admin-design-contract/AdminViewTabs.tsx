"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import clsx from "clsx";
import { ADMIN_VIEW_TABS as styles } from "./admin-ui.tokens";

export type AdminViewTab<Value extends string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

/** Controlled view filters, not ARIA tab panels. Domain code owns the selection. */
export function AdminViewTabs<Value extends string>({
  label, items, value, onValueChange, disabled = false, className,
}: {
  label: string;
  items: readonly AdminViewTab<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  disabled?: boolean;
  className?: string;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const container = strip.current;
    const selected = buttons.current[items.findIndex(item => item.value === value)];
    if (!container || !selected || container.clientWidth === 0) return;
    const left = selected.offsetLeft;
    const right = left + selected.offsetWidth;
    if (left < container.scrollLeft) container.scrollTo({ left });
    else if (right > container.scrollLeft + container.clientWidth) {
      container.scrollTo({ left: right - container.clientWidth });
    }
  }, [items, value]);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
    if (!enabled.length) return;
    const focused = enabled.findIndex(({ index }) => buttons.current[index] === event.target);
    if (focused < 0) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1
      : (focused + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) % enabled.length;
    buttons.current[enabled[next].index]?.focus();
    onValueChange(enabled[next].item.value);
  }

  return <div className={clsx(styles.root, className)} data-collapse={items.length > 4 || undefined}>
    <div ref={strip} role="group" aria-label={label} className={styles.strip} onKeyDown={navigate}>
      {items.map((item, index) => <button
        ref={element => { buttons.current[index] = element; }}
        key={item.value}
        type="button"
        disabled={disabled || item.disabled}
        aria-pressed={item.value === value}
        className={styles.item}
        onClick={() => onValueChange(item.value)}
      >{item.label}</button>)}
    </div>
    {items.length > 4 && <select
      aria-label={label}
      value={value}
      disabled={disabled}
      className={styles.select}
      onChange={event => {
        const item = items.find(option => option.value === event.target.value);
        if (item && !item.disabled) onValueChange(item.value);
      }}
    >{items.map(item => <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>)}</select>}
  </div>;
}
