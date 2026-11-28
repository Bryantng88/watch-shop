"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BusinessEntityPreviewModal, useBusinessEntityPreview } from "../business/BusinessEntityPreview";
import type { WatchQuickPreviewSeed } from "./WatchQuickPreviewTrigger";

/** Keep the existing preview/confirmation portals usable above a parent work dialog. */
export default function WatchQuickPreviewHost({seed,onClose}:{seed:WatchQuickPreviewSeed;onClose:()=>void}){
 const state=useBusinessEntityPreview(),panel=useRef<HTMLDivElement>(null);
 useEffect(()=>{state.openPreview({type:"WATCH",id:seed.productId,title:seed.label,imageUrl:seed.imageUrl});
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
  document.body.style.overflow="hidden";panel.current?.querySelector<HTMLButtonElement>('button[aria-label="Đóng xem nhanh"]')?.focus();
  return()=>{document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus({preventScroll:true});};
 },[]);
 useEffect(()=>{
  const handler=(event:KeyboardEvent)=>{
   if(event.defaultPrevented||!panel.current)return;
   if([...document.querySelectorAll('[role="alertdialog"]')].some(node=>node.getClientRects().length))return;
   const active=document.activeElement as HTMLElement|null;
   if(active?.closest('[role="menu"]'))return;
   const nested=active?.closest('[role="dialog"]');if(nested&&nested!==panel.current)return;
   if(event.key==="Escape"){
    event.preventDefault();event.stopImmediatePropagation();
    const imageClose=panel.current.querySelector<HTMLButtonElement>('button[aria-label="Đóng ảnh phóng lớn"]');if(imageClose)imageClose.click();else onClose();
   }
   if(event.key==="Tab"){
    const nodes=[...panel.current.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(node=>node.getClientRects().length);
    const first=nodes[0],last=nodes.at(-1);if(!first)return;
    if(event.shiftKey&&active===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&active===last){event.preventDefault();first.focus();}
   }
  };
  window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);
 },[onClose]);
 return createPortal(<div ref={panel} role="dialog" aria-modal="true" aria-label="Xem nhanh đồng hồ" className="fixed inset-0 z-[70]">
  <BusinessEntityPreviewModal open preview={state.preview||{type:"WATCH",id:seed.productId,title:seed.label}} loading={state.loading} error={state.error} onClose={onClose} onActivityChanged={()=>state.refreshPreview()}/>
 </div>,document.body);
}
