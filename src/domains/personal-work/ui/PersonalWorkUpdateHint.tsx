"use client";
import {useCallback,useEffect,useId,useRef,useState} from "react";
import { PersonalWorkFloatingPanel } from "./PersonalWorkFloatingPanel";
import {History} from "lucide-react";
export function PersonalWorkUpdateHint({text,time,labelClassName}:{text:string;time:string;labelClassName?:string}) {
  const [open,setOpen]=useState(false),id=useId(),root=useRef<HTMLSpanElement>(null),trigger=useRef<HTMLButtonElement>(null);
  const close = useCallback(()=>setOpen(false),[]);
  useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close);},[open]);
  return <span ref={root} className="relative inline-flex shrink-0" onMouseLeave={()=>setOpen(false)}>
    <button ref={trigger} type="button" aria-label={`Có cập nhật: ${text}`} aria-describedby={open?id:undefined}
      onPointerEnter={e=>{if(e.pointerType==="mouse")setOpen(true);}}
      onFocus={e=>{if(e.currentTarget.matches(":focus-visible"))setOpen(true);}}
      onBlur={()=>setOpen(false)} onKeyDown={e=>{if(e.key==="Escape"){e.stopPropagation();setOpen(false);}}}
      onClick={()=>setOpen(v=>!v)} className="inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium text-blue-700 hover:bg-blue-50">
      <History className="h-3 w-3"/><span className={labelClassName || "hidden sm:inline"}>Có cập nhật</span>
    </button>
    {open&&<PersonalWorkFloatingPanel anchor={trigger.current} onClose={close} id={id} role="tooltip" className="pointer-events-none rounded bg-slate-900 px-2 py-1.5 text-left text-white shadow-sm">
      <span className="block truncate text-[11px] leading-4">{text}</span>
      <span className="block text-[10px] leading-4 text-slate-300">{time}</span>
    </PersonalWorkFloatingPanel>}
  </span>;
}
