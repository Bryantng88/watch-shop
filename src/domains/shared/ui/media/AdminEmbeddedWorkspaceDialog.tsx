"use client";
import {useCallback,useEffect,useId,useRef,useState} from "react";
import {X} from "lucide-react";
import {AdminButton} from "../admin-design-contract/AdminButton";
import {useAppDialog} from "@/domains/shared/feedback";

export function AdminEmbeddedWorkspaceDialog({href,title,onClose}:{href:string;title:string;onClose:(changed:boolean)=>void}) {
  const dialog=useRef<HTMLDialogElement>(null),frame=useRef<HTMLIFrameElement>(null),dirty=useRef(false),changed=useRef(false),closing=useRef(false);
  const frameKeyCleanup=useRef<(()=>void)|null>(null);
  useEffect(()=>()=>frameKeyCleanup.current?.(),[]);
  const [error,setError]=useState(false),titleId=useId(),appDialog=useAppDialog();
  const url=new URL(href,"https://workspace.invalid");
  const allowed=url.origin==="https://workspace.invalid"&&/^\/admin\/watches\/[\w-]+\/edit$/.test(url.pathname);
  url.searchParams.set("embedded","1");url.searchParams.set("returnTo","/admin/personal-work");
  const requestClose=useCallback(async()=>{
    if(closing.current)return;closing.current=true;
    try{if(dirty.current&&!await appDialog.confirm({title:"Bạn có thay đổi chưa lưu",message:"Đóng cửa sổ sẽ bỏ các chỉnh sửa media chưa lưu. Bạn vẫn muốn đóng?",confirmText:"Bỏ thay đổi và đóng",cancelText:"Ở lại chỉnh tiếp",tone:"warning"}))return;onClose(changed.current);}finally{closing.current=false;}
  },[appDialog,onClose]);
  useEffect(()=>{
    const element=dialog.current,previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";element?.showModal();
    return()=>{element?.close();document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[]);
  useEffect(()=>{
    const receive=(event:MessageEvent)=>{
      if(event.origin!==window.location.origin||event.source!==frame.current?.contentWindow)return;
      if(event.data?.type==="workspace-target-modal-dirty"){if(dirty.current&&event.data.dirty===false)changed.current=true;dirty.current=event.data.dirty===true;}
      if(event.data?.type==="workspace-target-modal-refresh")changed.current=true;
      if(event.data?.type==="workspace-target-modal-close"){dirty.current=false;onClose(true);}
    };
    window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);
  },[onClose]);
  const bindFrameEscape=()=>{
    frameKeyCleanup.current?.();
    try{
      const document=frame.current?.contentDocument;if(!document)return;
      const escape=(event:KeyboardEvent)=>{
        // Let an editor's own menu/dialog consume Escape before the workspace closes.
        if(event.key!=="Escape"||event.defaultPrevented||document.querySelector('dialog[open], [role="alertdialog"], [role="menu"], [role="listbox"]'))return;
        event.preventDefault();event.stopPropagation();void requestClose();
      };
      document.addEventListener("keydown",escape);frameKeyCleanup.current=()=>document.removeEventListener("keydown",escape);
    }catch{/* A redirected cross-origin frame remains closable from the outer header. */}
  };
  return <dialog ref={dialog} aria-modal="true" aria-labelledby={titleId} onCancel={event=>{event.preventDefault();void requestClose();}} onClick={event=>{event.stopPropagation();if(event.target===event.currentTarget)void requestClose();}} onKeyDown={event=>event.stopPropagation()} className="fixed inset-0 m-auto h-[92dvh] w-[calc(100%_-_24px)] max-w-[1500px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-lg backdrop:bg-slate-950/40">
    <div className="flex h-full flex-col"><div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-2"><h2 id={titleId} className="min-w-0 truncate text-sm font-semibold">{title}</h2><AdminButton type="button" variant="quiet" density="compact" iconOnly aria-label="Đóng xử lý media" onClick={()=>void requestClose()}><X className="h-4 w-4"/></AdminButton></div>
    {!allowed||error?<p role="alert" className="p-4 text-sm text-rose-700">Không mở được cửa sổ media. Đóng và thử lại.</p>:<iframe ref={frame} onLoad={bindFrameEscape} src={url.pathname+url.search} title={title} onError={()=>setError(true)} className="min-h-0 flex-1 border-0 bg-white"/>}</div>
  </dialog>;
}
