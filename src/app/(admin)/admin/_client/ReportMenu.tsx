"use client";
import {useEffect,useId,useRef,useState} from "react";
import {createPortal} from "react-dom";
import {usePathname} from "next/navigation";
import {BarChart3,ChevronDown} from "lucide-react";
import ActiveLink from "./AdminActiveLink";
type ReportLink={href:string;label:string};
export default function ReportMenu({items,expanded,onNavigate}:{items:ReportLink[];expanded:boolean;onNavigate:()=>void}){
 const pathname=usePathname(),id=useId(),trigger=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null);
 const [open,setOpen]=useState(false),[position,setPosition]=useState({top:0,left:0});
 const active=items.some(item=>pathname===item.href||pathname.startsWith(item.href+"/"));
 useEffect(()=>{setOpen(false);},[pathname,expanded]);
 useEffect(()=>{
  if(!open)return;
  const dismiss=(event:PointerEvent)=>{if(!trigger.current?.contains(event.target as Node)&&!panel.current?.contains(event.target as Node))setOpen(false);};
  const key=(event:KeyboardEvent)=>{if(event.key==="Escape"){setOpen(false);trigger.current?.focus();}};
  const close=()=>setOpen(false);document.addEventListener("pointerdown",dismiss);document.addEventListener("keydown",key);window.addEventListener("resize",close);window.addEventListener("scroll",close,true);
  return()=>{document.removeEventListener("pointerdown",dismiss);document.removeEventListener("keydown",key);window.removeEventListener("resize",close);window.removeEventListener("scroll",close,true);};
 },[open]);
 const links=<div ref={panel} id={id} aria-label="Các báo cáo" className={expanded?"mt-1 space-y-1 border-l border-white/10 pl-2":"fixed z-[100] w-60 space-y-1 rounded-xl bg-[#11191f] p-2 text-gray-200 shadow-xl"} style={expanded?undefined:position}>
   {!expanded&&<p className="px-3 py-2 text-xs font-semibold text-white/60">Báo cáo</p>}
   {items.map(item=><ActiveLink key={item.href} href={item.href} label={item.label} expanded className="h-10 justify-start gap-2 px-3" onNavigate={()=>{setOpen(false);onNavigate();}}><span className="text-sm">{item.label}</span></ActiveLink>)}
 </div>;
 return <div className="relative pt-2">
  <button ref={trigger} type="button" aria-label="Báo cáo" aria-expanded={open} aria-controls={open?id:undefined} title={!expanded?"Báo cáo":undefined}
    onClick={()=>{const rect=trigger.current?.getBoundingClientRect();if(rect)setPosition({top:Math.max(8,Math.min(rect.top,window.innerHeight-(items.length*44+64))),left:rect.right+8});setOpen(!open);}}
    onKeyDown={event=>{if(event.key==="ArrowDown"){event.preventDefault();const rect=trigger.current?.getBoundingClientRect();if(rect)setPosition({top:Math.max(8,Math.min(rect.top,window.innerHeight-(items.length*44+64))),left:rect.right+8});setOpen(true);requestAnimationFrame(()=>panel.current?.querySelector<HTMLAnchorElement>('a')?.focus());}}}
    className={`flex h-12 w-full items-center rounded-xl px-4 text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${expanded?"justify-start gap-3":"justify-center"} ${active?"bg-gray-900 text-white":""}`}>
    <BarChart3 size={18} className="shrink-0 opacity-80"/>{expanded&&<><span className="flex-1 text-left text-sm">Báo cáo</span><ChevronDown size={14} className={open?"rotate-180":""}/></>}
  </button>
  {open&&(expanded?links:createPortal(links,document.body))}
 </div>;
}
