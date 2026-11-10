"use client";
import PersonalWorkUpdateReview from "./PersonalWorkUpdateReview";
import {benEnvironmentLabel, type BenEnvironment} from "./environment";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import ProductPhotoCard from "./ProductPhotoCard";
import ProductionMainRelease from "./ProductionMainRelease";
import CodeJobPanel from "./CodeJobPanel";
import RepositorySources from "./RepositorySources";
import BenMessage from "./BenMessage";
import {waitingMediaDraft} from "./media-insight";
import BenMediaReview from "./BenMediaReview";
import {currentMediaEditor, subscribeMediaEditor, type MediaEditor} from "./media-editor";
import BenScreenContext from "./BenScreenContext";
import BenAvatar from "./BenAvatar";
import PersonalWorkDraftReview from "./PersonalWorkDraftReview";
import BenPwaRuntime from "./BenPwaRuntime";
import {takeNavigation,type PendingNavigation} from "./navigation-client";
import { usePathname, useRouter } from "next/navigation";
import { MAX_BEN_IMAGE_BYTES } from "./image-search";
import { ImagePlus, X, Plus, History, Send, Square, Trash2, Check, ArrowRight } from "lucide-react";
import { followScreenWhileEmpty, isProductContext, newConversation, pageContext, readConversations, simulateReply, type Conversation, type Scenario } from "./simulation";
import { assignedRequests } from "./assigned-requests";
import OrderDraftReview from "./OrderDraftReview";
import CustomerRequestDemo from "./CustomerRequestDemo";
import { collectCustomerRequest, customerRequestQuestion, requestSummary } from "./customer-request";

const departments = { TECHNICAL: "Kỹ thuật", OPERATION: "Vận hành", SALES: "Sales", MEDIA: "Media" };
const people = { technical: "Minh · Kỹ thuật (mẫu)", operation: "An · Vận hành (mẫu)", sales: "Linh · Sales (mẫu)", media: "Hà · Media (mẫu)" };
const field = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

export default function AiAssistant({ userId, canManage, live = false, environment, fullPage = false, imageSearch = false }: { userId: string; canManage: boolean; live?:boolean; environment?:BenEnvironment; fullPage?:boolean; imageSearch?:boolean }) {
  const router=useRouter();const pendingNavigation=useRef<PendingNavigation|null>(null);
  const consumedMedia=useRef(new Set<string>());
  const draftingMedia=useRef(false);
  const [manualMedia,setManualMedia]=useState<{key:string;session:object}>();
  const [mediaStatus,setMediaStatus]=useState<{session:object;text:string;pending:boolean}>();
  const pendingMedia=useRef<{requestKey:string;conversationId:string;editor:MediaEditor}|null>(null);
  const [mediaRequest,setMediaRequest]=useState<{key:string;editor:MediaEditor;mode?:"draft"|"inspect"}>();
  const pathname = usePathname(), current = pageContext(pathname), storageKey = `watchshop:ai-demo:v1:${userId}`;
  const [open, setOpen] = useState(fullPage), [history, setHistory] = useState(false), [chats, setChats] = useState<Conversation[]>([]), [selected, setSelected] = useState("");
  const visibilityKey=`watchshop:ben-window:${userId}:${live?"live":"simulation"}`;
  const setWindowOpen=useCallback((value:boolean)=>{
    setOpen(value);
    try{sessionStorage.setItem(visibilityKey,value?"open":"closed");}catch{/* In-memory visibility still works when storage is unavailable. */}
  },[visibilityKey]);
  useEffect(()=>{
    try{if(fullPage){setWindowOpen(true);}else{setOpen(sessionStorage.getItem(visibilityKey)==="open");}}catch{if(fullPage)setOpen(true);}
  },[fullPage,visibilityKey,setWindowOpen]);
  const mediaEditor = useSyncExternalStore(subscribeMediaEditor, currentMediaEditor, () => undefined);
  const screenPath = mediaEditor ? `/admin/watches/${mediaEditor.productId}/edit` : pathname;
  const [attachment,setAttachment]=useState<{chatId:string;file:File}>();
  const [assignedOpen,setAssignedOpen]=useState(false);
  const [productionRelease, setProductionRelease] = useState<{ conversationId: string; workflowUrl: string }>();
  const [sessionExpired,setSessionExpired]=useState(false);
  const [ready, setReady] = useState(false), [input, setInput] = useState(""), [busy, setBusy] = useState(false), [scenario, setScenario] = useState<Scenario>("normal"), [notice, setNotice] = useState("");
  const launcher = useRef<HTMLButtonElement>(null), textarea = useRef<HTMLTextAreaElement>(null), bottom = useRef<HTMLDivElement>(null), latestReply = useRef<HTMLDivElement>(null), panel = useRef<HTMLElement>(null), generation = useRef(0);
  const liveSelected=useRef("");const liveSequence=useRef(0);const livePending=useRef(false);const liveTracking=useRef(false);const liveSubmitting=useRef(false);const liveDrafts=useRef(new Set<string>());const liveRequestKey=useRef<{id:string;text:string;key:string;screenPath:string;image?:File}|null>(null);
  useEffect(()=>{liveSelected.current=selected;},[selected]);
  const expireSession=useCallback(()=>{
    liveSequence.current++;livePending.current=false;liveTracking.current=false;liveRequestKey.current=null;liveSelected.current="";
    pendingNavigation.current=null;pendingMedia.current=null;setMediaRequest(undefined);setManualMedia(undefined);setMediaStatus(undefined);setProductionRelease(undefined);
    setChats([]);setSelected("");setInput("");setAttachment(undefined);setBusy(false);setSessionExpired(true);
  },[]);
  const refreshLive=useCallback(async(preferred?:string)=>{
    const sequence=++liveSequence.current;const active=preferred||liveSelected.current;const target=active&&!liveDrafts.current.has(active)?"?id="+encodeURIComponent(active):"";const response=await fetch("/api/admin/customer-assistant"+target,{cache:"no-store"});if(response.status===401){expireSession();throw Error("Phiên đăng nhập đã hết hạn.");}const data=await response.json();if(!response.ok)throw Error(data.error||"Không tải được cuộc trao đổi.");if(sequence!==liveSequence.current)return;
    const rows=data.conversations as Conversation[];const navigation=takeNavigation(pendingNavigation.current,rows.find(r=>r.id===(preferred||liveSelected.current)));if(navigation){pendingNavigation.current=null;router.push(navigation.href);}
    const pending=pendingMedia.current;
    const row=pending&&rows.find(item=>item.id===pending.conversationId&&item.id===(preferred||liveSelected.current));
    const media=row&&["NEEDS_INFO","APPLIED"].includes(row.runStatus||"")?row.messages.at(-1)?.mediaDraftRequest:undefined;
    if(pending&&media?.sourceMessageId===pending.requestKey&&media.productId===pending.editor.productId){
      pendingMedia.current=null;
      const editor=currentMediaEditor();
      if(editor?.session===pending.editor.session)setMediaRequest({key:pending.requestKey,editor,mode:media.mode});
      else setNotice("Form media đã đổi hoặc đã đóng. Mở lại đúng sản phẩm rồi nhắn Ben để tiếp tục.");
    }
    const id=preferred||liveSelected.current||rows[0]?.id||"";liveSelected.current=id;setSelected(id);livePending.current=rows.some(r=>["QUEUED","RUNNING"].includes(r.runStatus||"")||["QUEUED","RUNNING","MERGE_QUEUED","MERGING","DEPLOY_QUEUED","DEPLOYING"].includes(r.codeJob?.status||""));liveTracking.current=rows.some(r=>r.id===id&&r.approved);setBusy(liveSubmitting.current||rows.some(r=>r.id===id&&["QUEUED","RUNNING"].includes(r.runStatus||"")));setChats(current=>data.partial?current.map(r=>rows.find(row=>row.id===r.id)||r).concat(rows.filter(row=>!current.some(r=>r.id===row.id))):[...current.filter(r=>liveDrafts.current.has(r.id)),...rows]);
  },[router,expireSession]);
  async function livePost(body:unknown){const response=await fetch("/api/admin/customer-assistant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});if(response.status===401){expireSession();throw Error("Phiên đăng nhập đã hết hạn.");}const data=await response.json();if(!response.ok)throw Error(data.error||"Chưa thực hiện được yêu cầu.");return data;}
  useEffect(()=>{if(!live||sessionExpired)return;const sequenceRef=liveSequence;let disposed=false;const load=()=>refreshLive().catch(e=>{if(!disposed)setNotice(e.message);});const resume=()=>{if(document.visibilityState==="visible"&&navigator.onLine)void load();};void load();const timer=setInterval(()=>{if(document.visibilityState==="visible"&&navigator.onLine&&(livePending.current||(open&&liveTracking.current)))void load();},5000);window.addEventListener("online",resume);window.addEventListener("pageshow",resume);document.addEventListener("visibilitychange",resume);return()=>{disposed=true;sequenceRef.current++;clearInterval(timer);window.removeEventListener("online",resume);window.removeEventListener("pageshow",resume);document.removeEventListener("visibilitychange",resume);};},[live,open,refreshLive,sessionExpired]);
  useEffect(()=>{const el=textarea.current;if(el){el.style.height="auto";el.style.height=Math.min(el.scrollHeight,144)+"px";}},[input,open,history,assignedOpen]);
  const storedChat = chats.find(c => c.id === selected);
  const chat = storedChat && (live || isProductContext(storedChat.context)) ? live ? storedChat : followScreenWhileEmpty(storedChat, current) : undefined;
  const draftKey=mediaEditor&&(manualMedia?.session===mediaEditor.session?manualMedia.key:
    waitingMediaDraft(chat,mediaEditor.productId));
  const awaitingInsight=Boolean(draftKey&&!consumedMedia.current.has(draftKey));
  const currentMediaStatus=mediaStatus?.session===mediaEditor?.session?mediaStatus:undefined;

  async function writeMedia(insight:string) {
    if(!mediaEditor||!draftKey||consumedMedia.current.has(draftKey)||draftingMedia.current)return;
    const editor=mediaEditor;
    consumedMedia.current.add(draftKey);
    draftingMedia.current=true;
    editor.showDraft();
    setManualMedia(undefined);
    setInput("");
    setMediaStatus({session:editor.session,text:"Ben đang tra cứu ảnh và viết bản nháp…",pending:true});
    try{
      const draft=await editor.draft(insight);
      const current=currentMediaEditor();
      if(current?.session!==editor.session)return;
      current.showDraft(draft);
      setMediaStatus({session:editor.session,text:"Bản nháp đã sẵn sàng trong tab Content.",pending:false});
    }catch(error){
      setMediaStatus({session:editor.session,text:error instanceof Error?error.message:"Ben chưa viết được bản nháp. Bạn thử lại nhé.",pending:false});
    }finally{
      draftingMedia.current=false;
    }
  }

  const assigned=assignedRequests(chat);
  const assignedCount=(chat?.updatedPersonalWork?.length||0)+(chat?.createdPersonalWork?.length||0)+assigned.length+(chat?.permissionRequests?.length||0)+(chat?.createdOrders?.length||0);
  const missingQuestion = chat?.customerRequest?.status === "DRAFT" ? customerRequestQuestion(chat.customerRequest) : "";
  const lastAssistant = chat?.messages.filter(m => m.role === "assistant").at(-1)?.text;
  const scopeEnabled = live || isProductContext(current) || (!!chat?.messages.length && isProductContext(chat.context));
  useEffect(() => { if(live){setReady(true);return;} let rows: Conversation[] = []; try { rows = readConversations(localStorage.getItem(storageKey)); } catch { setNotice("Trình duyệt đang chặn lưu trữ. Lịch sử chỉ giữ trong tab hiện tại."); } setChats(rows); setSelected(rows.find(c => isProductContext(c.context))?.id || ""); setReady(true); }, [storageKey,live]);
  useEffect(() => { if (ready && !live) { try { localStorage.setItem(storageKey, JSON.stringify(chats.slice(0, 20))); } catch { setNotice("Không lưu được lịch sử trên trình duyệt. Bạn vẫn có thể tiếp tục trong tab này."); } } }, [chats, ready, storageKey,live]);
  useEffect(() => { const show = () => setWindowOpen(true); window.addEventListener("open-local-ai-assistant", show); return () => window.removeEventListener("open-local-ai-assistant", show); }, [setWindowOpen]);
  useEffect(() => { if (open) textarea.current?.focus(); }, [open, history,assignedOpen]);
  useEffect(()=>{setAssignedOpen(false);},[selected]);
  const latestMessage = chat?.messages.at(-1);
  useEffect(() => {
    if (!open || history || assignedOpen) return;
    if (fullPage && !busy && latestMessage?.role === "assistant") {
      latestReply.current?.scrollIntoView({ block: "start" });
    } else {
      bottom.current?.scrollIntoView({ block: "nearest" });
    }
  }, [open, history, assignedOpen, fullPage, latestMessage?.id, latestMessage?.role, busy]);
  useEffect(() => () => { generation.current++; }, []);
  function close() { if(fullPage)return; pendingNavigation.current=null; pendingMedia.current=null; setMediaRequest(undefined); setManualMedia(undefined); setWindowOpen(false); launcher.current?.focus(); }
  function create(context = live ? null : current) { pendingNavigation.current=null; pendingMedia.current=null; setMediaRequest(undefined); setManualMedia(undefined); const c = newConversation(context); if(live)liveDrafts.current.add(c.id); liveRequestKey.current=null; setChats(rows => [c, ...rows].slice(0, 20)); setSelected(c.id); setHistory(false); setAssignedOpen(false); setInput(""); setNotice(""); return c; }
  function update(id: string, fn: (c: Conversation) => Conversation) { setChats(rows => rows.map(c => c.id === id ? { ...fn(c), updatedAt: new Date().toISOString() } : c).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt))); }
  const selectedImage=live&&imageSearch&&attachment?.chatId===(chat?.id||"")?attachment.file:undefined;
  async function send(value = input) {
    const image=selectedImage;
    const text=value.trim()||(image?"Tìm đồng hồ trong kho từ ảnh mình gửi.":""); if (!text || busy || !ready || !scopeEnabled) return;
    if(!image&&awaitingInsight){await writeMedia(text);return;}
    const c = chat || create();
    if(live){
      setBusy(true);setNotice("");liveSubmitting.current=true;liveSequence.current++;
      if(!liveRequestKey.current||liveRequestKey.current.id!==c.id||liveRequestKey.current.text!==text||liveRequestKey.current.screenPath!==screenPath||liveRequestKey.current.image!==image)liveRequestKey.current={id:c.id,text,key:crypto.randomUUID(),screenPath,image};
      pendingMedia.current=!image&&mediaEditor?{requestKey:liveRequestKey.current.key,conversationId:c.id,editor:mediaEditor}:null;
      setMediaRequest(undefined);
      pendingNavigation.current=image?null:{requestKey:liveRequestKey.current.key,conversationId:c.id};
      try{
        const imageBase64=image?await new Promise<string>((resolve,reject)=>{
          const reader=new FileReader();
          reader.onerror=()=>reject(Error("Không đọc được ảnh đã chọn."));
          reader.onload=()=>typeof reader.result==="string"?resolve(reader.result.split(",",2)[1]):reject(Error("Không đọc được ảnh đã chọn."));
          reader.readAsDataURL(image);
        }):undefined;
        const row=await livePost({action:"send",...(imageBase64?{imageBase64}:{}),...(c.revision?{id:c.id}:{}),requestKey:liveRequestKey.current.key,text,screenPath,productId:mediaEditor?.productId??(isProductContext(current)?current.id||null:null)}) as Conversation;if(pendingNavigation.current)pendingNavigation.current.conversationId=row.id;if(pendingMedia.current)pendingMedia.current.conversationId=row.id;liveDrafts.current.delete(c.id);liveRequestKey.current=null;setInput("");setAttachment(undefined);liveSelected.current=row.id;setSelected(row.id);setChats(rows=>[row,...rows.filter(r=>r.id!==c.id&&r.id!==row.id)]);}
      catch(e){pendingNavigation.current=null;pendingMedia.current=null;if(image)setAttachment({chatId:c.id,file:image});setNotice(e instanceof Error?e.message:"Không gửi được tin nhắn.");}
      finally{liveSubmitting.current=false;setBusy(false);await refreshLive(liveSelected.current||undefined).catch(e=>setNotice(e.message));}return;
    }
    if (c.messages.length >= 38) { setNotice("Cuộc trao đổi đã đủ dài. Hãy tạo trao đổi mới để tiếp tục."); return; }
    const token = ++generation.current; setBusy(true); setInput(""); setNotice("");
    update(c.id, row => ({ ...row, context: c.context, title: row.messages.length ? row.title : text.slice(0, 65), messages: [...row.messages, { id: crypto.randomUUID(), role: "user", text }] }));
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (token !== generation.current) return;
    const customerFlow = !!c.customerRequest || /đề xuất|giao.*việc|phối hợp/i.test(text) || /khách|điều kiện|yêu cầu mua/i.test(text) || c.messages.some(m => m.role === "user" && /khách|điều kiện|yêu cầu mua/i.test(m.text));
    const collected = customerFlow && (scenario === "normal" || (scenario === "clarify" && c.messages.some(m => m.role === "assistant"))) ? collectCustomerRequest(text, c.context?.id || "", c.customerRequest) : undefined;
    const request = collected?.request;
    const reply = request ? { text: request.status === "TRACKING" ? requestSummary(request) : collected?.question || "Mình sẽ giao việc như dưới đây. Cần đổi gì, bạn cứ nhắn thêm nhé.", steps: [] } : c.approved ? { text: "Phương án đã được xác nhận. Các việc mẫu đang được theo dõi bên dưới.", steps: [] } : simulateReply(text, scenario, c.context, c.messages.some(m => m.role === "assistant"));
    update(c.id, row => ({ ...row, ...(request ? { customerRequest: request } : {}), messages: [...row.messages, { id: crypto.randomUUID(), role: "assistant", text: reply.text }], steps: request ? [] : row.approved ? row.steps : reply.steps.length ? reply.steps : row.steps })); setBusy(false);
  }
  async function cancel() { pendingNavigation.current=null; pendingMedia.current=null; setMediaRequest(undefined); if(live&&chat){try{await livePost({action:"cancel",id:chat.id});await refreshLive(chat!.id);}catch(e){setNotice(e instanceof Error?e.message:"Không hủy được lượt xử lý.");}return;} generation.current++; setBusy(false); if (chat) update(chat.id, c => ({ ...c, messages: [...c.messages, { id: crypto.randomUUID(), role: "assistant", text: "Đã hủy lượt trả lời giả lập. Không tạo hoặc thay đổi công việc." }] })); }
  async function codeAction(
    action: 'approve' | 'cancel' | 'merge' | 'deploy' | 'deploy-production',
    input: { revision?: number; jobId?: string; sha?: string }
  ) {
    if (!chat) return;
    setBusy(true);
    liveSubmitting.current = true;
    try {
      const response = await fetch('/api/admin/ben-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, id: chat.id, ...input }),
      });
      if(response.status===401){expireSession();throw Error("Phiên đăng nhập đã hết hạn.");}
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Không thực hiện được thao tác.');
      if (action === 'deploy-production') {
        setProductionRelease({ conversationId: chat.id, workflowUrl: data.workflowUrl });
        setNotice('Đã xác nhận tag production. Mở GitHub Actions để kiểm tra và duyệt lượt chạy.');
      }
      await refreshLive(chat.id);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Cần tải lại để kiểm tra.');
    } finally {
      liveSubmitting.current = false;
      setBusy(false);
    }
  }
  async function approvePersonalWorkUpdateLive(){if(!chat?.personalWorkUpdateDraft)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"update-personal-work",id:chat.id,revision:chat.personalWorkUpdateDraft.revision});await refreshLive(chat.id);}catch(error){setNotice(error instanceof Error?error.message:"Chưa cập nhật được công việc.");}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approvePersonalWorkLive(){if(!chat?.personalWorkDraft)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"approve-personal-work",id:chat.id,revision:chat.personalWorkDraft.revision});await refreshLive(chat.id);}catch(error){setNotice(error instanceof Error?error.message:"Chưa tạo được lịch cá nhân.");}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approveOrderLive(){if(!chat?.orderDraft)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"approve-order",id:chat.id,revision:chat.orderDraft.revision});await refreshLive(chat.id);}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approveLive(){if(!chat?.revision)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"approve",id:chat.id,revision:chat.revision});await refreshLive(chat!.id);}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approvePermissionLive(){if(!chat?.permissionRequest)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"permission-support",id:chat.id,revision:chat.permissionRequest.revision});await refreshLive(chat.id);}catch(e){setNotice(e instanceof Error?e.message:"Chưa gửi được yêu cầu cho Long.");}finally{liveSubmitting.current=false;setBusy(false);}}
  async function updateLiveRequest(request:NonNullable<Conversation["customerRequest"]>,requestRevision?:number){const original=requestRevision!==undefined?chat?.approvedRequests?.find(r=>r.revision===requestRevision)?.request:chat?.customerRequest;if(!original)return;const changed=request.conditions.find(c=>{const old=original.conditions.find(o=>o.id===c.id);return old&&(old.outcome!==c.outcome||old.result!==c.result);});if(!changed)return;setBusy(true);try{await livePost({action:"outcome",id:chat!.id,requestRevision,conditionId:changed.id,outcome:changed.outcome,result:changed.result});await refreshLive(chat!.id);}catch(e){setNotice(e instanceof Error?e.message:"Chưa lưu kết quả.");}finally{setBusy(false);}}
  if(live&&sessionExpired)return <aside aria-label="Ben · Đăng nhập lại" className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-white p-6 text-center"><h2 className="text-lg font-semibold">Đăng nhập lại để tiếp tục với Ben</h2><p className="my-3 text-sm text-slate-600">Phiên đăng nhập đã hết hạn. Các cuộc trò chuyện vẫn được lưu trong tài khoản.</p><a className="min-h-11 rounded-xl bg-blue-600 px-5 py-3 text-white" href={"/login?next="+encodeURIComponent(pathname)}>Đăng nhập lại</a></aside>;
  return <>
    {!fullPage && <button ref={launcher} type="button" aria-label="Mở Ben" aria-expanded={open} onClick={() => {if(open)close();else setWindowOpen(true);}} className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 font-semibold text-white shadow-xl hover:bg-blue-800"><BenAvatar /><span>Ben</span>{!live && <span className="rounded bg-white/20 px-1.5 text-[10px]">MẪU</span>}</button>}
    {(open || fullPage) && <>{!fullPage&&<button aria-label="Đóng Ben" onClick={close} className="fixed inset-0 z-[65] bg-slate-950/30 sm:hidden" />}
    <aside ref={panel} style={fullPage?{height:"var(--ben-viewport-height, 100dvh)",top:"var(--ben-viewport-top, 0px)"}:undefined} aria-label="Ben · Hỗ trợ công việc" onKeyDown={event => { if (event.key === "Escape") close(); if (event.key === "Tab" && window.innerWidth < 640) { const nodes = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea, input, select, a[href]'); if (!nodes?.length) return; const first = nodes[0], last = nodes[nodes.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } }} className={fullPage ? "fixed inset-0 z-[70] mx-auto flex h-[100dvh] w-full max-w-3xl flex-col bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-xl" : "fixed inset-y-0 right-0 z-[70] flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:w-[540px] lg:w-[600px] xl:w-[640px]"}>
      <header className="flex items-center justify-between border-b-0 border-blue-100 px-3 py-1 sm:px-5 sm:py-4"><div className="flex items-center gap-3"><BenAvatar /><div><h2 className="font-semibold text-slate-950">Ben</h2><p className="text-xs text-slate-500"><span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${busy?"bg-blue-500":"bg-emerald-500"}`}/>{busy?"Đang xử lý…":"Cùng bạn xử lý công việc"}</p></div></div><div className="flex gap-1">{live&&!fullPage&&<Link href="/admin/ben" className="self-center rounded-lg px-2 text-xs text-indigo-700">Mở riêng</Link>}<button disabled={busy} aria-label="Lịch sử trao đổi" onClick={() => {setAssignedOpen(false);setHistory(v => !v);}} className="min-h-11 min-w-11 rounded-lg p-2 hover:bg-slate-100"><History size={19}/></button><button disabled={busy || (!live && !isProductContext(current))} aria-label="Trao đổi mới" onClick={() => create()} className="min-h-11 min-w-11 rounded-lg p-2 hover:bg-slate-100"><Plus size={19}/></button>{!fullPage&&<button aria-label="Đóng Ben" onClick={close} className="min-h-11 min-w-11 rounded-lg p-2 hover:bg-slate-100"><X size={20}/></button>}</div></header>
      <div className="flex items-center gap-2 px-3 pb-1 text-[11px] sm:px-5 sm:pb-3 text-slate-500">{benEnvironmentLabel(live,environment)&&<span className="rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 font-medium text-blue-700">{benEnvironmentLabel(live,environment)}</span>}<span>{live?"Tra cứu · Đề xuất · Bạn quyết định":"Không gọi AI hoặc tạo việc thật"}</span></div>
      {live&&fullPage&&<BenPwaRuntime/>}
      {live&&(mediaEditor ? <BenMediaReview key={mediaEditor.productId+":"+selected} editor={mediaEditor} awaitingInsight={awaitingInsight} status={currentMediaStatus} onAsk={()=>{mediaEditor.showDraft();setMediaStatus(undefined);setManualMedia({key:crypto.randomUUID(),session:mediaEditor.session});}} onSkip={()=>void writeMedia("")} requestKey={mediaRequest?.mode==="inspect"&&mediaRequest.editor.session===mediaEditor.session?mediaRequest.key:undefined}/> : <BenScreenContext pathname={pathname}/>)}
      {live&&<nav aria-label="Mục trong cuộc trao đổi" className="mx-3 mb-1 flex rounded-xl sm:mx-4 sm:mb-3 border border-blue-100 bg-slate-50/70 p-1 text-sm"><button type="button" aria-pressed={!history&&!assignedOpen} onClick={()=>{setHistory(false);setAssignedOpen(false);}} className={`min-h-10 flex-1 rounded-lg px-3 py-1 sm:py-2 ${!history&&!assignedOpen?"bg-blue-100/70 font-semibold text-blue-700":"text-slate-500 hover:bg-white"}`}>Trò chuyện</button><button type="button" aria-pressed={assignedOpen} onClick={()=>{setHistory(false);setAssignedOpen(true);}} className={`min-h-10 flex-1 rounded-lg px-3 py-1 sm:py-2 ${assignedOpen?"bg-blue-100/70 font-semibold text-blue-700":"text-slate-500 hover:bg-white"}`}>Công việc <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{assignedCount}</span></button></nav>}
      {live&&assignedOpen?<section aria-label="Các yêu cầu đã giao" className="min-h-0 flex-1 overflow-y-auto p-5"><h3 className="font-semibold">Công việc trong cuộc trò chuyện</h3><p className="mt-2 text-xs leading-5 text-slate-500">Các yêu cầu trong cuộc trao đổi này. Đã giao việc chưa có nghĩa là đã hoàn tất.</p>{!assignedCount&&<p className="mt-6 text-sm text-slate-500">Chưa có yêu cầu nào được giao.</p>}{assigned.map(r=><details key={r.key} className="mt-4 rounded-xl border p-3"><summary className="cursor-pointer text-sm font-medium">{r.request.reference||"Yêu cầu đã giao"} · {r.request.watch}</summary><CustomerRequestDemo request={r.request} live environment={environment} busy={busy} canManage={canManage&&!busy} onEdit={()=>{setAssignedOpen(false);}} onChange={request=>{void updateLiveRequest(request,r.current?undefined:r.revision);}} /></details>)}{chat?.updatedPersonalWork?.map(item=><Link key={"updated-"+item.revision} href={"/admin/personal-work?item="+encodeURIComponent(item.id)} className="mt-4 block rounded-xl border p-3 text-sm text-blue-700">Đã cập nhật: {item.title}</Link>)}{chat?.createdPersonalWork?.map(item=><Link key={"personal-"+item.revision} href={"/admin/personal-work?item="+encodeURIComponent(item.id)} className="mt-4 block rounded-xl border p-3 text-sm text-blue-700">{item.kind==="EVENT"?"Sự kiện":"Công việc"}: {item.title}{item.calendar==="FAILED"?" · Đã lưu, chưa đồng bộ Google. Mở Công việc của tôi để thử lại.":item.calendar==="PENDING"?" · Chưa xác nhận đồng bộ Google.":""}</Link>)}{chat?.createdOrders?.map(o=><Link key={`order-${o.revision}`} href={`/admin/orders/${o.id}`} className="mt-4 block rounded-xl border p-3 text-sm text-indigo-700 underline">Đơn nháp {o.reference} · Mở đơn hàng</Link>)}{chat?.permissionRequests?.map(r=><p key={r.revision} className="mt-4 rounded-xl border p-3 text-sm">{r.reference} · Đã gửi Long xem xét quyền hạn</p>)}{notice&&<p role="status" className="mt-4 rounded bg-amber-50 p-2 text-xs text-amber-900">{notice}</p>}</section>:history ? <div className="flex-1 overflow-y-auto p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Trao đổi gần đây</h3><button disabled={live || busy || !chats.length} onClick={() => { setChats([]); setSelected(""); setNotice("Đã xóa lịch sử mẫu khỏi trình duyệt."); }} className="text-xs text-rose-700 underline">Xóa tất cả</button></div>{!chats.length && <p className="text-sm text-slate-500">Chưa có cuộc trao đổi nào.</p>}{chats.filter(c => live || isProductContext(c.context)).map(c => <div key={c.id} className="mb-2 flex rounded-xl border p-3"><button className="min-w-0 flex-1 text-left" onClick={() => { pendingNavigation.current=null; pendingMedia.current=null; setMediaRequest(undefined); setManualMedia(undefined); setSelected(c.id); if(live)void refreshLive(c.id).catch(e=>setNotice(e.message)); setHistory(false); setNotice(""); }}><p className="truncate text-sm font-medium">{c.title}</p><p className="mt-1 text-xs text-slate-500">{live?"Trò chuyện với Ben":c.context?.label || "Trao đổi tự do"} · {c.approved || c.customerRequest?.status === "TRACKING" ? live ? "Đã giao việc" : "Đã duyệt mẫu" : "Đang trao đổi"}</p></button><button disabled={live} aria-label={`Xóa trao đổi ${c.title}`} onClick={() => { setChats(rows => rows.filter(row => row.id !== c.id)); if (selected === c.id) setSelected(""); }} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button></div>)}</div> : <>
      {!live && <div className="space-y-2 border-b bg-slate-50 px-5 py-3 text-xs"><div className="flex items-center justify-between gap-2"><span className="font-medium text-slate-700">{chat ? chat.context ? `Đang trao đổi về: ${chat.context.label}` : "Trao đổi tự do · chưa gắn đối tượng" : `Ngữ cảnh gợi ý: ${current.label}`}</span></div>{chat && isProductContext(current) && chat.context?.href !== current.href && <div className="rounded-lg border border-indigo-200 bg-white p-2 text-indigo-900"><p>Bạn đang mở {current.label}. Cuộc trao đổi này vẫn giữ ngữ cảnh cũ.</p><button disabled={busy} onClick={() => create()} className="mt-1 font-semibold underline">Bắt đầu trao đổi về màn hình hiện tại</button></div>}{chat?.context?.kind === "list" && <p className="text-slate-500">Chọn một watch hoặc nêu SKU trong chat.</p>}</div>}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/40 px-3 py-2 sm:px-5 sm:py-5">
        {!scopeEnabled && <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm"><strong>Đang tập trung vào Sản phẩm</strong><p className="my-2">Ngữ cảnh của các màn hình khác tạm tắt. Mở danh sách hoặc chi tiết sản phẩm để bắt đầu trao đổi.</p><Link href="/admin/watches" className="font-semibold text-indigo-700 underline">Mở Sản phẩm</Link></div>}
        {scopeEnabled && !chat?.messages.length && <div className="space-y-5 py-5"><h3 className="text-2xl font-semibold tracking-tight text-slate-900">Chào bạn, Ben đây.</h3><p className="text-sm leading-6 text-slate-500">Bạn muốn xử lý việc gì hôm nay? Mình sẽ cùng bạn làm rõ và chuẩn bị đề xuất để bạn duyệt.</p><div className="space-y-2">{["Ghi nhận yêu cầu khách hàng có điều kiện", "Tóm tắt tình hình sản phẩm", "Đề xuất công việc phối hợp liên phòng ban"].map(text => <button key={text} disabled={!ready || !scopeEnabled} onClick={() => void send(text)} className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm hover:border-indigo-300 hover:bg-indigo-50">{text}<ArrowRight size={16}/></button>)}</div></div>}
        <div className="space-y-5" aria-live="polite">{chat?.messages.map(m => <div ref={m.id===latestMessage?.id&&m.role==="assistant"?latestReply:undefined} key={m.id} className={m.role==="user"?"ml-10 flex justify-end":"flex items-start gap-2"}>{m.role==="assistant"&&<span className="mt-1 shrink-0 [&_img]:h-7 [&_img]:w-7"><BenAvatar/></span>}<div className={m.role==="user"?"max-w-full whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-violet-100/80 px-4 py-3 text-sm leading-6 text-slate-900":"min-w-0 flex-1 rounded-2xl rounded-tl-md border border-blue-100/80 bg-white px-4 py-3.5 text-slate-800 shadow-sm"}>{m.role==="assistant"?<BenMessage text={m.text}/>:m.text}{live&&m.role==="assistant"&&m.repositorySources&&<RepositorySources sources={m.repositorySources}/>} {live&&m.navigation&&<Link href={m.navigation.href} className="mt-3 inline-flex rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50">Mở {m.navigation.label} →</Link>}{live&&m.role==="assistant"&&m.products?.map(product=><ProductPhotoCard key={product.id} product={product} compact={m.compactProductCards}/>)}</div></div>)}{busy&&<p role="status" className="animate-pulse pl-9 text-xs text-blue-700">{live?"Ben đang xử lý…":"Đang chuẩn bị câu trả lời mẫu…"}</p>}{busy&&<div ref={bottom}/>}</div>
        {productionRelease&&productionRelease.conversationId===chat?.id&&chat.capabilities?.canDeployProduction&&<a className="text-sm underline" href={productionRelease.workflowUrl} target="_blank" rel="noopener noreferrer">Mở GitHub Actions production</a>}
        {live&&chat?.capabilities?.canReviewProductionMain&&<ProductionMainRelease key={chat.id} />}
        {live&&chat&&<CodeJobPanel draft={chat.codeDraft?.revision===chat.revision?chat.codeDraft:undefined} job={chat.codeJob} busy={busy} canRun={!!chat.capabilities?.canRunCode} canMerge={!!chat.capabilities?.canMergeCode} canDeploy={!!chat.capabilities?.canDeployCode} canDeployProduction={!!chat.capabilities?.canDeployProduction} onCommand={(action,input)=>{void codeAction(action,input);}}/>}
        {live&&chat?.orderDraft&&chat.runStatus==="DRAFT"&&<OrderDraftReview draft={chat.orderDraft} busy={busy} canCreate={!!chat.capabilities?.canCreateOrders} onApprove={approveOrderLive} onEdit={()=>{setInput("");textarea.current?.focus();}}/>}
        {live&&chat?.permissionRequest&&<section className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4"><h3 className="text-sm font-semibold">Nhờ Long hỗ trợ quyền hạn</h3><p className="mt-2 whitespace-pre-wrap text-sm">{chat.permissionRequest.summary}</p><p className="mt-2 text-xs text-slate-600">Long sẽ xem xét yêu cầu. Quyền của bạn và công việc đang bị chặn chưa thay đổi.</p><button type="button" disabled={busy} onClick={()=>void approvePermissionLive()} className="mt-3 rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">Tạo công việc cho Long</button></section>}
        {missingQuestion && lastAssistant !== missingQuestion && <p role="status" className="mt-4 rounded-2xl bg-slate-100 p-3.5 text-sm text-slate-800">{missingQuestion}</p>}
        {live&&!busy&&chat?.personalWorkUpdateDraft&&<PersonalWorkUpdateReview draft={chat.personalWorkUpdateDraft} busy={busy||!chat.capabilities?.canUpdatePersonalWork} onApprove={()=>void approvePersonalWorkUpdateLive()}/>}
        {live&&!busy&&chat?.personalWorkDraft&&<PersonalWorkDraftReview draft={chat.personalWorkDraft} busy={busy||!chat.capabilities?.canCreatePersonalWork} onApprove={()=>void approvePersonalWorkLive()}/>}
        {chat?.customerRequest && !missingQuestion && (!live || (!chat.approved && chat.customerRequest.status!=="TRACKING" && chat.runStatus === "DRAFT")) && <CustomerRequestDemo key={chat.customerRequest.id} request={chat.customerRequest} live={live} environment={environment} onApprove={live?approveLive:undefined} onEdit={text => { setInput(text); textarea.current?.focus(); }} busy={busy} canManage={(live?chat.customerRequest.conditions.every(c=>c.kind==="TECHNICAL"?chat.capabilities?.canCreateTechnical:chat.capabilities?.canCreateTasks):canManage&&scenario!=="denied")&&!busy} onChange={request => { if(live)void updateLiveRequest(request);else update(chat.id, c => ({ ...c, customerRequest: request })); }} />}
        {!!chat?.steps.length && !chat.approved && !chat.customerRequest && <p role="status" className="mt-4 rounded-2xl bg-slate-100 p-3.5 text-sm">Để chuẩn bị giao việc, bạn cho mình biết thông tin khách hàng và SKU trong chat nhé.</p>}
        {!live&&chat?.approved && !chat.customerRequest && <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><h3 className="flex items-center gap-2 font-semibold text-emerald-900"><Check size={18}/>Đã duyệt phương án mẫu</h3><p className="mt-1 text-xs text-emerald-800">Không có việc thật trong hàng đợi nghiệp vụ.</p>{chat.tasks.map((s, i) => <div key={s.id} className="mt-3 rounded-lg bg-white p-3 text-sm"><strong>{i + 1}. {s.title}</strong><p className="mt-1 text-xs text-slate-500">{departments[s.department as keyof typeof departments]} · {people[s.assignee as keyof typeof people]}</p><label className="mt-2 block text-xs">Tiến độ mẫu<select aria-label={`Tiến độ ${s.title}`} className={field} value={s.status} onChange={e => update(chat.id, c => ({ ...c, tasks: c.tasks.map(t => t.id === s.id ? { ...t, status: e.target.value } : t) }))}>{["Chờ tiếp nhận (mẫu)", "Đang xử lý (mẫu)", "Cần phản hồi (mẫu)", "Hoàn tất (mẫu)"].map(status => <option key={status}>{status}</option>)}</select></label></div>)}</section>}
        {!busy&&<div ref={bottom}/>}
      </div>
      <footer className="shrink-0 space-y-1 border-t border-blue-100 bg-white px-3 py-1.5 sm:space-y-3 sm:px-5 sm:py-3">{!history&&!assignedOpen&&!busy&&!input.trim()&&!selectedImage&&<div className="flex gap-2 overflow-x-auto">{[{label:"Việc của tôi",text:"Mở công việc của tôi"},{label:"Tìm đồng hồ",text:"Mình muốn tìm đồng hồ "},{label:"Tạo yêu cầu",text:"Mình cần tạo yêu cầu "}].map(action=><button type="button" key={action.label} disabled={busy||!ready||!scopeEnabled} onClick={()=>{setInput(action.text);textarea.current?.focus();}} className="shrink-0 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-blue-50 disabled:opacity-40">{action.label}</button>)}</div>}{!live&&<label className="flex items-center justify-between gap-2 text-xs text-slate-500">Kịch bản giả lập<select aria-label="Kịch bản trợ lý" disabled={busy} value={scenario} onChange={e => setScenario(e.target.value as Scenario)} className="rounded border px-2 py-1"><option value="normal">Bình thường</option><option value="clarify">Hỏi lại trước khi đề xuất</option><option value="error">Lỗi xử lý</option><option value="denied">Không đủ quyền</option></select></label>}{notice && <p role="status" className="rounded bg-amber-50 p-2 text-xs text-amber-900">{notice}</p>}{selectedImage&&<div className="flex items-center justify-between gap-2 text-xs"><span className="truncate">Ảnh đã chọn · {selectedImage.name}</span><button type="button" disabled={busy} onClick={()=>setAttachment(undefined)}>Bỏ ảnh</button></div>}<form onSubmit={e => { e.preventDefault(); void send(); }} className="flex items-end gap-2 rounded-2xl border border-blue-200 bg-white p-2 focus-within:ring-2 focus-within:ring-blue-100">{live&&imageSearch&&<label className="relative rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500" title="Chọn ảnh để tìm đồng hồ"><ImagePlus size={18}/><input className="absolute inset-0 cursor-pointer opacity-0" type="file" aria-label="Chọn ảnh đồng hồ" accept="image/jpeg,image/png,image/webp" disabled={busy||!ready||!scopeEnabled} onChange={e=>{
        const file=e.currentTarget.files?.[0];e.currentTarget.value="";
        if(!file)return;
        if(file.size>MAX_BEN_IMAGE_BYTES||!["image/jpeg","image/png","image/webp"].includes(file.type)){setNotice("Chọn ảnh JPG, PNG hoặc WebP tối đa 4 MB.");return;}
        setNotice("");setAttachment({chatId:chat?.id||"",file});
      }}/></label>}<textarea ref={textarea} aria-label="Tin nhắn cho Ben" maxLength={4000} rows={1} value={input} disabled={busy || !scopeEnabled} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }} placeholder="Nhắn cho Ben…" className="max-h-20 min-h-10 sm:max-h-36 flex-1 resize-none rounded-xl border-0 bg-transparent px-2 py-2 text-base leading-6 outline-none sm:text-sm"/>{busy ? <button type="button" aria-label="Hủy lượt trả lời" onClick={cancel} className="rounded-xl bg-slate-900 p-3 text-white"><Square size={18}/></button> : <button type="submit" aria-label="Gửi tin nhắn" disabled={(!input.trim()&&!selectedImage) || !ready || !scopeEnabled} className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-40"><Send size={18}/></button>}</form><p className="hidden text-center text-[11px] text-slate-400 sm:block">{live?"Chỉ tạo việc hoặc đơn hàng sau khi bạn duyệt":"Bản giả lập · Không tạo việc thật"}</p></footer>
      </>}
    </aside></>}
  </>;
}
