"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Bell, BellRing, Loader2, X } from "lucide-react";

const api = "/api/admin/customer-assistant";
type PushState = "checking" | "off" | "on" | "blocked" | "unconfigured" | "unsupported" | "install" | "worker" | "error";
const labels:Record<PushState,string> = {
  checking:"Đang kiểm tra…",off:"Chưa bật",on:"Đã bật trên thiết bị này",blocked:"Trình duyệt đang chặn",unconfigured:"Chưa sẵn sàng",unsupported:"Thiết bị chưa hỗ trợ",install:"Cài Ben trước",worker:"Đang chuẩn bị",error:"Chưa kiểm tra được",
};
const descriptions:Partial<Record<PushState,string>> = {
  off:"Nhận thông báo khi có việc được giao hoặc đến giờ nhắc.",
  blocked:"Cho phép thông báo cho trang Ben trong cài đặt trình duyệt, rồi kiểm tra lại.",
  unconfigured:"Thông báo chưa được bật trên hệ thống. Cần quản trị viên cấu hình.",
  unsupported:"Trình duyệt này chưa hỗ trợ thông báo cho Ben. Thử mở bằng Chrome hoặc Safari mới nhất qua HTTPS.",
  install:"Trên iPhone/iPad: mở bằng Safari → Chia sẻ → Thêm vào Màn hình chính, rồi mở Ben từ icon.",
  worker:"Ben chưa chuẩn bị xong thông báo. Chờ một chút rồi kiểm tra lại.",
  error:"Kiểm tra kết nối hoặc tải lại Ben, rồi thử lại.",
};
async function updateSubscription(body: unknown) {
  const response = await fetch(api, {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
  if (!response.ok) throw new Error("Ben chưa lưu được cài đặt thông báo.");
  return response.json();
}
export default function BenPushControls() {
  const [open,setOpen]=useState(false),[state,setState]=useState<PushState>("checking");
  const [key,setKey]=useState<string>(),[subscription,setSubscription]=useState<PushSubscription|null>(null);
  const [busy,setBusy]=useState(false),[notice,setNotice]=useState("");
  const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null);
  const registration=useRef<ServiceWorkerRegistration|null>(null),request=useRef<AbortController|null>(null),revision=useRef(0);
  const id=useId();
  const check=useCallback(async()=>{
    const current=++revision.current;
    request.current?.abort();
    setState("checking");setNotice("");
    const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
    const installed=window.matchMedia("(display-mode: standalone)").matches||Boolean((navigator as Navigator&{standalone?:boolean}).standalone);
    if(ios&&!installed){setState("install");return;}
    if(!window.isSecureContext||!("PushManager" in window)||!("Notification" in window)||!("serviceWorker" in navigator)){setState("unsupported");return;}
    const controller=new AbortController();request.current=controller;
    const timer=window.setTimeout(()=>controller.abort(),8000);
    try{
      const response=await fetch(api+"?push=1",{cache:"no-store",signal:controller.signal});
      if(!response.ok)throw Error("status");
      const data=await response.json();
      if(current!==revision.current)return;
      if(data.publicKey===null){setKey(undefined);setState("unconfigured");return;}
      if(typeof data.publicKey!=="string"||!data.publicKey)throw Error("key");
      setKey(data.publicKey);
      const worker=await navigator.serviceWorker.getRegistration("/admin/ben");
      if(current!==revision.current)return;
      registration.current=worker??null;
      if(!worker?.active || worker.active.scriptURL!==new URL("/ben-sw.js",window.location.origin).href){setState("worker");return;}
      if(Notification.permission==="denied"){setState("blocked");return;}
      const existing=await worker.pushManager.getSubscription();
      if(current!==revision.current)return;
      if(existing){
        const result=await updateSubscription({action:"push-status",endpoint:existing.endpoint});
        if(current!==revision.current)return;
        setSubscription(result.enabled?existing:null);setState(result.enabled?"on":"off");
      }else{setSubscription(null);setState("off");}
    }catch{if(current===revision.current)setState("error");}
    finally{window.clearTimeout(timer);}
  },[]);
  const cancelPending=useCallback(()=>{revision.current++;request.current?.abort();},[]);
  useEffect(()=>{
    void check();
    const refresh=()=>{void check();};
    if("serviceWorker" in navigator)navigator.serviceWorker.addEventListener("controllerchange",refresh);
    return()=>{cancelPending();if("serviceWorker" in navigator)navigator.serviceWorker.removeEventListener("controllerchange",refresh);};
  },[check,cancelPending]);
  useEffect(()=>{
    if(!open)return;
    panel.current?.focus();
    const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};
    const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){e.preventDefault();e.stopPropagation();setOpen(false);trigger.current?.focus();}};
    document.addEventListener("pointerdown",outside);
    document.addEventListener("keydown",escape,true);
    return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape,true);};
  },[open]);
  function close(){setOpen(false);trigger.current?.focus();}
  async function toggle(){
    setBusy(true);setNotice("");
    try{
      if(subscription){await updateSubscription({action:"unsubscribe-push",endpoint:subscription.endpoint});await subscription.unsubscribe();setSubscription(null);setState("off");return;}
      if(!key||!registration.current?.active){setState("worker");return;}
      // Keep the browser permission request in the direct user-click call stack.
      if(await Notification.requestPermission()!=="granted"){setState(Notification.permission==="denied"?"blocked":"off");setNotice("Chưa cấp quyền thông báo.");return;}
      const existing=await registration.current.pushManager.getSubscription();
      const next=existing??await registration.current.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
      const {endpoint,keys}=next.toJSON();
      await updateSubscription({action:"subscribe-push",subscription:{endpoint,keys}});
      setSubscription(next);setState("on");
    }catch{setNotice("Chưa đổi được cài đặt. Kiểm tra kết nối rồi thử lại.");}
    finally{setBusy(false);}
  }
  return <div ref={root} className="relative self-center">
    <button ref={trigger} type="button" aria-label="Thông báo Ben" title="Thông báo Ben" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(v=>!v)} className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100">
      {state==="on"?<BellRing size={19}/>:<Bell size={19}/>}
      <span aria-hidden="true" className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${state==="on"?"bg-emerald-500":state==="off"?"bg-slate-300":"bg-amber-500"}`}/>
    </button>
    {open&&<div ref={panel} tabIndex={-1} id={id} role="dialog" aria-label="Cài đặt thông báo Ben" onKeyDown={e=>{if(e.key==="Escape"){e.stopPropagation();close();}}} className="absolute right-0 top-full z-50 mt-1 w-64 max-w-[calc(100vw-24px)] rounded-xl border border-slate-200 bg-white p-3 text-left shadow-lg outline-none">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-900">Thông báo</h3><button type="button" aria-label="Đóng cài đặt thông báo" onClick={close} className="rounded p-1 text-slate-400 hover:bg-slate-50"><X size={15}/></button></div>
      <p role="status" className="mt-2 text-xs font-medium text-slate-700">{labels[state]}</p>
      {descriptions[state]&&<p className="mt-1 text-xs leading-5 text-slate-500">{descriptions[state]}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {(state==="off"||state==="on")&&<button type="button" disabled={busy} onClick={()=>void toggle()} className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white disabled:opacity-50">{busy&&<Loader2 size={12} className="animate-spin"/>}{subscription?"Tắt thông báo":"Bật thông báo"}</button>}
        {state==="on"&&<button type="button" disabled={busy} onClick={async()=>{setBusy(true);setNotice("");try{await updateSubscription({action:"test-push"});setNotice("Đã gửi yêu cầu thử. Kiểm tra thông báo trên thiết bị nhé.");}catch{setNotice("Chưa gửi được thông báo thử.");}finally{setBusy(false);}}} className="min-h-9 rounded-lg px-2 text-xs text-blue-700 disabled:opacity-50">Gửi thử</button>}
        {!["checking","unsupported","install"].includes(state)&&<button type="button" disabled={busy} onClick={()=>void check()} className="min-h-9 text-xs text-slate-500 disabled:opacity-50">Kiểm tra lại</button>}
      </div>
      {notice&&<p role="status" className="mt-1 text-xs leading-5 text-slate-600">{notice}</p>}
    </div>}
  </div>;
}
