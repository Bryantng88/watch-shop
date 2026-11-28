"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import * as React from "react";

type DialogTone = "default" | "success" | "warning" | "danger";

type ConfirmOptions = {
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    tone?: DialogTone;
};

type AlertOptions = {
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    secondaryText?: string;
    tone?: DialogTone;
};

type DialogState =
    | null
    | ({
        type: "confirm";
        resolve: (value: boolean) => void;
    } & ConfirmOptions)
    | ({
        type: "alert";
        resolve: () => void;
    } & AlertOptions);

type AppDialogApi = {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    alert: (options: AlertOptions) => Promise<void>;
    close: () => void;
};

const AppDialogContext = React.createContext<AppDialogApi | null>(null);

/** Native top-layer dialog provides stacking and focus containment for all callers. */
export function AppDialogProvider({children}:{children:React.ReactNode}) {
    const [dialog,setDialog]=React.useState<DialogState>(null);
    const pending=React.useRef<NonNullable<DialogState>[]>([]),node=React.useRef<HTMLDialogElement>(null),safeButton=React.useRef<HTMLButtonElement>(null);
    const titleId=React.useId(),bodyId=React.useId();
    const enqueue=React.useCallback((request:NonNullable<DialogState>)=>{pending.current.push(request);if(pending.current.length===1)setDialog(request);},[]);
    const settle=React.useCallback((accepted:boolean,expected?:DialogState)=>{
        if(expected&&pending.current[0]!==expected)return;
        const current=pending.current.shift();if(!current)return;
        if(current.type==="confirm")current.resolve(accepted);else current.resolve();
        setDialog(pending.current[0]??null);
    },[]);
    const confirm=React.useCallback((options:ConfirmOptions)=>new Promise<boolean>(resolve=>enqueue({...options,type:"confirm",resolve})),[enqueue]);
    const alert=React.useCallback((options:AlertOptions)=>new Promise<void>(resolve=>enqueue({...options,type:"alert",resolve})),[enqueue]);
    const close=React.useCallback(()=>settle(false),[settle]);
    React.useEffect(()=>()=>{for(const request of pending.current){if(request.type==="confirm")request.resolve(false);else request.resolve();}pending.current=[];},[]);
    React.useEffect(()=>{
        if(!dialog)return;
        const element=node.current,previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
        document.body.style.overflow="hidden";element?.showModal();safeButton.current?.focus({preventScroll:true});
        return()=>{element?.close();document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus({preventScroll:true});};
    },[dialog]);
    const value=React.useMemo(()=>({confirm,alert,close}),[confirm,alert,close]);
    return <AppDialogContext.Provider value={value}>{children}{dialog&&<dialog ref={node} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId}
        onCancel={event=>{event.preventDefault();settle(false,dialog);}}
        onClick={event=>{event.stopPropagation();if(event.target===event.currentTarget)settle(false,dialog);}}
        onKeyDown={event=>event.stopPropagation()}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_32px)] max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-950 shadow-lg backdrop:bg-slate-950/40">
        <h2 id={titleId} className="text-lg font-bold">{dialog.title||(dialog.type==="confirm"?"Xác nhận thao tác":"Thông báo")}</h2>
        <div id={bodyId} className="mt-3 text-sm leading-5 text-slate-600">{dialog.message}</div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
            {dialog.type==="confirm"?<AdminButton ref={safeButton} type="button" variant="secondary" onClick={()=>settle(false,dialog)}>{dialog.cancelText??"Bỏ qua"}</AdminButton>:dialog.secondaryText?<AdminButton ref={safeButton} type="button" variant="secondary" onClick={()=>settle(false,dialog)}>{dialog.secondaryText}</AdminButton>:null}
            <AdminButton ref={dialog.type==="alert"&&!dialog.secondaryText?safeButton:undefined} type="button" variant={dialog.tone==="danger"?"danger":"primary"} onClick={()=>settle(true,dialog)}>{dialog.confirmText??(dialog.type==="confirm"?"Xác nhận":"Đã hiểu")}</AdminButton>
        </div>
    </dialog>}</AppDialogContext.Provider>;
}

export function useAppDialog(){const context=React.useContext(AppDialogContext);if(!context)throw new Error("useAppDialog must be used inside <AppDialogProvider>");return context;}
