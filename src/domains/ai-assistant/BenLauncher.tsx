"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import BenAvatar from "./BenAvatar";

type Position = { x: number; y: number };
const storageKey = "ben.launcher.position.v1";
const margin = 12;

export default function BenLauncher({ buttonRef, open, live, onToggle }: {
  buttonRef: RefObject<HTMLButtonElement | null>; open: boolean; live: boolean; onToggle: () => void;
}) {
  const [position, setPosition] = useState<Position | null>(null);
  const [dragging, setDragging] = useState(false);
  const preferred = useRef<Position | null>(null);
  const suppressClick = useRef(false);
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number; moved: boolean } | null>(null);

  function bounds() {
    const viewport = window.visualViewport, box = buttonRef.current?.getBoundingClientRect();
    const left = (viewport?.offsetLeft ?? 0) + margin, top = (viewport?.offsetTop ?? 0) + margin;
    return { left, top, width: Math.max(0, (viewport?.width ?? innerWidth) - (box?.width ?? 0) - margin * 2), height: Math.max(0, (viewport?.height ?? innerHeight) - (box?.height ?? 0) - margin * 2) };
  }
  function move(left: number, top: number) {
    const b = bounds();
    const next = { x: b.width ? Math.max(0, Math.min(1, (left - b.left) / b.width)) : 0, y: b.height ? Math.max(0, Math.min(1, (top - b.top) / b.height)) : 0 };
    preferred.current = next;
    setPosition({ x: b.left + next.x * b.width, y: b.top + next.y * b.height });
  }
  function save() { try { localStorage.setItem(storageKey, JSON.stringify(preferred.current)); } catch { /* Moving works when storage is unavailable. */ } }
  useEffect(() => {
    const button = buttonRef.current;
    function fit() {
      const viewport = window.visualViewport, box = button?.getBoundingClientRect();
      if (!box) return;
      const left = (viewport?.offsetLeft ?? 0) + margin, top = (viewport?.offsetTop ?? 0) + margin;
      const width = Math.max(0, (viewport?.width ?? innerWidth) - box.width - margin * 2), height = Math.max(0, (viewport?.height ?? innerHeight) - box.height - margin * 2);
      const p = preferred.current ?? { x: 1, y: 1 };
      setPosition({ x: left + width * p.x, y: top + height * p.y });
    }
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (saved && typeof saved === "object" && "x" in saved && "y" in saved && typeof saved.x === "number" && typeof saved.y === "number" && Number.isFinite(saved.x) && Number.isFinite(saved.y) && saved.x >= 0 && saved.x <= 1 && saved.y >= 0 && saved.y <= 1) preferred.current = { x: saved.x, y: saved.y };
    } catch { /* Invalid or blocked storage uses the default corner. */ }
    fit();
    const observer = new ResizeObserver(fit);
    if (button) observer.observe(button);
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("scroll", fit);
    return () => { observer.disconnect(); window.removeEventListener("resize", fit); window.visualViewport?.removeEventListener("resize", fit); window.visualViewport?.removeEventListener("scroll", fit); };
  }, [buttonRef]);

  return <button ref={buttonRef} type="button" aria-label="Mở Ben" aria-expanded={open} title="Bấm để mở Ben · Kéo hoặc dùng Alt + phím mũi tên để di chuyển"
    style={{ ...(position ? { left: position.x, top: position.y, right: "auto", bottom: "auto" } : {}), touchAction: "none", userSelect: "none", cursor: dragging ? "grabbing" : "grab" }}
    onPointerDown={event => {
      if (!event.isPrimary || event.button !== 0) return;
      suppressClick.current = false;
      const box = event.currentTarget.getBoundingClientRect();
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: box.left, top: box.top, moved: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      const start = drag.current;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (!start.moved && Math.hypot(dx, dy) < 6) return;
      start.moved = true; setDragging(true); event.preventDefault();
      move(start.left + dx, start.top + dy);
    }}
    onPointerUp={event => {
      const start = drag.current;
      if (!start || start.id !== event.pointerId) return;
      suppressClick.current = start.moved || event.pointerType === "touch";
      if (start.moved) save();
      else if (event.pointerType === "touch") onToggle();
      drag.current = null; setDragging(false);
    }}
    onPointerCancel={() => { if (drag.current?.moved) { suppressClick.current = true; save(); } drag.current = null; setDragging(false); }}
    onLostPointerCapture={() => { if (drag.current?.moved) { suppressClick.current = true; save(); } drag.current = null; setDragging(false); }}
    onClick={event => { if (suppressClick.current) { suppressClick.current = false; event.preventDefault(); return; } suppressClick.current = false; onToggle(); }}
    onKeyDown={event => {
      if (event.key === "Enter" || event.key === " ") suppressClick.current = false;
      if (!event.altKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault(); const box = event.currentTarget.getBoundingClientRect();
      move(box.left + (event.key === "ArrowLeft" ? -24 : event.key === "ArrowRight" ? 24 : 0), box.top + (event.key === "ArrowUp" ? -24 : event.key === "ArrowDown" ? 24 : 0)); save();
    }}
    className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 font-semibold text-white shadow-xl hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
    <span className="pointer-events-none flex items-center gap-2"><BenAvatar /><span>Ben</span>{!live && <span className="rounded bg-white/20 px-1.5 text-[10px]">MẪU</span>}</span>
  </button>;
}
