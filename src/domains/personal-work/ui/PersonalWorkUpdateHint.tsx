"use client";
import {useEffect,useId,useRef,useState} from "react";
import {History} from "lucide-react";
export function PersonalWorkUpdateHint({text,time}:{text:string;time:string}) {
  const [open,setOpen]=useState(false),id=useId(),root=useRef<HTMLSpanElement>(null);
  useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close);},[open]);
  return <span ref={root} className="relative inline-flex shrink-0" onMouseLeave={()=>setOpen(false)}>
    <button type="button" aria-label={`Có cập nhật: ${text}`} aria-describedby={open?id:undefined}
      onPointerEnter={e=>{if(e.pointerType==="mouse")setOpen(true);}}
      onFocus={e=>{if(e.currentTarget.matches(":focus-visible"))setOpen(true);}}
      onBlur={()=>setOpen(false)} onKeyDown={e=>{if(e.key==="Escape"){e.stopPropagation();setOpen(false);}}}
      onClick={()=>setOpen(v=>!v)} className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium text-blue-700 hover:bg-blue-50">
      <History className="h-3 w-3"/><span className="hidden sm:inline">Có cập nhật</span>
    </button>
    {open&&<span id={id} role="tooltip" className="absolute right-0 top-full z-40 mt-1 w-56 max-w-[70vw] rounded bg-slate-900 px-2 py-1.5 text-left text-white shadow-sm">
      <span className="block truncate text-[11px] leading-4">{text}</span>
      <span className="block text-[10px] leading-4 text-slate-300">{time}</span>
    </span>}
  </span>;
}
