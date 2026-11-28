"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { HomeHero } from "./HomeHero";
import type { HomeContent } from "./contract";
import type { DisplayImage } from "./EditorialPhoto";
import "@/app/(public)/storefront.css";

/** Render the public component in a real device viewport, not an approximated crop. */
export function HeroLivePreview({ hero, image, mobile }: {hero: HomeContent["hero"]; image?: DisplayImage; mobile?: DisplayImage}) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [body, setBody] = useState<HTMLElement | null>(null);
  const [available, setAvailable] = useState(0);
  const [height, setHeight] = useState(540);
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const width = device === "desktop" ? 1280 : 390;
  const scale = Math.min(1, available / width);
  useEffect(() => {
    const node = host.current!;
    const observer = new ResizeObserver(entries => setAvailable(entries[0].contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!body) return;
    function syncStyles() {
      const head = body!.ownerDocument.head;
      head.querySelectorAll('[data-preview-style]').forEach(node => node.remove());
      document.head.querySelectorAll('style,link[rel="stylesheet"]').forEach(node => {
        const copy = node.cloneNode(true) as HTMLElement;
        copy.setAttribute("data-preview-style", "");
        head.append(copy);
      });
    }
    syncStyles();
    const hero = body.querySelector(".vg-hero");
    const resize = new ResizeObserver(() => {
      const size = Math.ceil(hero?.getBoundingClientRect().height ?? 0);
      if (size > 0) setHeight(size);
    });
    if (hero) resize.observe(hero);
    const observer = new MutationObserver(syncStyles);
    observer.observe(document.head, {childList: true, subtree: true, characterData: true});
    return () => { observer.disconnect(); resize.disconnect(); };
  }, [body]);
  return <section className="sfc-hero-live" aria-label="Xem trước ảnh mở đầu">
    <div className="sfc-row"><strong>Xem trước trực tiếp</strong><div role="group" aria-label="Thiết bị xem trước Hero">{(["desktop", "mobile"] as const).map(value => <AdminButton key={value} variant="quiet" density="compact" type="button" aria-pressed={device===value} onClick={() => setDevice(value)}>{value==="desktop"?"Desktop":"Mobile"}</AdminButton>)}</div></div>
    <p className="sfc-image-hint">Cập nhật ngay khi chỉnh, chưa lưu hay xuất bản. Mobile để trống sẽ dùng ảnh và căn chỉnh desktop.</p>
    {!image && <p className="sfc-image-hint">Chọn ảnh desktop để căn chỉnh tại đây. Nếu dùng ảnh tự động từ danh mục, kiểm tra bằng Xem trước trang.</p>}
    <div ref={host} style={{minWidth:0}}><div style={{height:height*scale, width:width*scale, maxWidth:"100%", marginInline:"auto", overflow:"hidden"}}>
      <iframe ref={frame} title="Preview Hero trực tiếp" srcDoc={'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"></body></html>'} onLoad={() => setBody(frame.current?.contentDocument?.body ?? null)} style={{width,height,border:0,transform:`scale(${scale})`,transformOrigin:"top left",display:"block"}}/>
    </div></div>
    {body && createPortal(<div className="storefront-surface vintic-gallery" onClickCapture={event => event.preventDefault()}><HomeHero hero={hero} image={image} mobile={mobile}/></div>,body)}
  </section>;
}
