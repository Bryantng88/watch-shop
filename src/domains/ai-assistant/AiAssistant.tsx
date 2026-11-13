"use client";
import styles from "./BenChat.module.css";
import BenConversationMessage,{type BenUserProfile} from "./BenConversationMessage";
import OrderServicesDraftReview from "./OrderServicesDraftReview";
import {personalWorkDraftItems} from "./personal-work-contract";
import MediaPostDraftReview from "./MediaPostDraftReview";
import PersonalWorkUpdateReview from "./PersonalWorkUpdateReview";
import {benEnvironmentLabel, type BenEnvironment} from "./environment";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import ProductPhotoCard from "./ProductPhotoCard";
import ProductionMainRelease from "./ProductionMainRelease";
import CodeJobPanel from "./CodeJobPanel";
import RepositorySources from "./RepositorySources";
import {waitingMediaDraft} from "./media-insight";
import BenMediaReview from "./BenMediaReview";
import {currentMediaEditor, subscribeMediaEditor, type MediaEditor} from "./media-editor";
import BenScreenContext from "./BenScreenContext";
import BenAvatar from "./BenAvatar";
import PersonalWorkDraftReview from "./PersonalWorkDraftReview";
import { BenLogout } from "./BenLogout";
import BenPushControls from "./BenPushControls";
import BenPwaRuntime from "./BenPwaRuntime";
import { benCalendarResultLabel } from "@/domains/personal-work/shared/ben-calendar-sync";
import { LiveReadGate, livePollDelay } from "./live-read";
import {takeNavigation,type PendingNavigation} from "./navigation-client";
import { usePathname, useRouter } from "next/navigation";
import { MAX_BEN_IMAGE_BYTES } from "./image-search";
import { ImagePlus, X, Plus, History, Send, Square, Trash2, Check, ArrowRight, ExternalLink, ListTodo, Watch, LockKeyhole } from "lucide-react";
import { followScreenWhileEmpty, isProductContext, newConversation, pageContext, readConversations, simulateReply, type Conversation, type Scenario } from "./simulation";
import { assignedRequests } from "./assigned-requests";
import OrderDraftReview from "./OrderDraftReview";
import CustomerRequestDemo from "./CustomerRequestDemo";
import { collectCustomerRequest, customerRequestQuestion, requestSummary } from "./customer-request";

const departments = { TECHNICAL: "Kỹ thuật", OPERATION: "Vận hành", SALES: "Sales", MEDIA: "Media" };
const people = { technical: "Minh · Kỹ thuật (mẫu)", operation: "An · Vận hành (mẫu)", sales: "Linh · Sales (mẫu)", media: "Hà · Media (mẫu)" };
const field = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

export default function AiAssistant({ userId, canManage, live = false, environment, fullPage = false, imageSearch = false, userProfile }: { userProfile?:BenUserProfile; userId: string; canManage: boolean; live?:boolean; environment?:BenEnvironment; fullPage?:boolean; imageSearch?:boolean }) {
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
  const liveReads=useRef(new LiveReadGate());
  const livePoll=useRef({finishedAt:0,failures:0});
  useEffect(()=>{liveSelected.current=selected;},[selected]);
  const expireSession=useCallback(()=>{
    liveReads.current.cancel();
    liveSequence.current++;livePending.current=false;liveTracking.current=false;liveRequestKey.current=null;liveSelected.current="";
    pendingNavigation.current=null;pendingMedia.current=null;setMediaRequest(undefined);setManualMedia(undefined);setMediaStatus(undefined);setProductionRelease(undefined);
    setChats([]);setSelected("");setInput("");setAttachment(undefined);setBusy(false);setSessionExpired(true);
  },[]);
  const refreshLive=useCallback(async(preferred?:string,background=false)=>{
    if(background&&liveSubmitting.current)return;
    const read=liveReads.current.begin(background);if(!read)return;
    const sequence=++liveSequence.current;
    try {
    const active=preferred||liveSelected.current;const target=active&&!liveDrafts.current.has(active)?"?id="+encodeURIComponent(active):"";const response=await fetch("/api/admin/customer-assistant"+target,{cache:"no-store",signal:read.signal});
    if(!read.isCurrent()||sequence!==liveSequence.current)return;
    if(response.status===401){expireSession();throw Error("Phiên đăng nhập đã hết hạn.");}const data=await response.json();if(!read.isCurrent()||sequence!==liveSequence.current)return;if(!response.ok)throw Error(data.error||"Không tải được cuộc trao đổi.");
    livePoll.current.failures=0;
    const rows=data.conversations as Conversation[];const navigation=takeNavigation(pendingNavigation.current,rows.find(r=>r.id===(preferred||liveSelected.current)));if(navigation){pendingNavigation.current=null;router.push(fullPage&&navigation.href==="/admin/personal-work"?"/admin/personal-work?view=list":navigation.href);}
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
    } catch(error) {
      // Superseded reads cannot show errors or mutate another conversation.
      if(sequence!==liveSequence.current||(read.signal.aborted&&!read.timedOut()))return;
      livePoll.current.failures++;
      if(read.timedOut())throw Error("Tải cuộc trao đổi quá lâu. Ben sẽ thử tải lại khi có kết nối.");
      throw error;
    } finally {
      if(sequence===liveSequence.current)livePoll.current.finishedAt=Date.now();
      read.finish();
    }
  },[router,expireSession,fullPage]);
  async function livePost(body:unknown){const response=await fetch("/api/admin/customer-assistant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});if(response.status===401){expireSession();throw Error("Phiên đăng nhập đã hết hạn.");}const data=await response.json();if(!response.ok)throw Error(data.error||"Chưa thực hiện được yêu cầu.");return data;}
  useEffect(()=>{
    if(!live||sessionExpired)return;
    const reads=liveReads.current;const sequenceRef=liveSequence;let disposed=false;
    const available=()=>document.visibilityState==="visible"&&navigator.onLine;
    const load=()=>refreshLive(undefined,true).catch(e=>{if(!disposed)setNotice(e.message);});
    const resume=()=>{if(available())void load();else{sequenceRef.current++;reads.cancel();}};
    resume();
    // A cheap clock tick does no network work while idle, hidden or offline.
    const timer=setInterval(()=>{
      const delay=livePollDelay(livePending.current,open&&liveTracking.current,livePoll.current.failures);
      if(available()&&delay!==null&&Date.now()-livePoll.current.finishedAt>=delay)void load();
    },1000);
    window.addEventListener("online",resume);window.addEventListener("offline",resume);window.addEventListener("pageshow",resume);document.addEventListener("visibilitychange",resume);
    return()=>{disposed=true;sequenceRef.current++;reads.cancel();clearInterval(timer);window.removeEventListener("online",resume);window.removeEventListener("offline",resume);window.removeEventListener("pageshow",resume);document.removeEventListener("visibilitychange",resume);};
  },[live,open,refreshLive,sessionExpired]);
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
  const assignedCount=(chat?.updatedServiceOrders?.length||0)+(chat?.createdMediaPosts?.length||0)+(chat?.updatedPersonalWork?.length||0)+(chat?.createdPersonalWork?.length||0)+assigned.length+(chat?.permissionRequests?.length||0)+(chat?.createdOrders?.length||0);
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
  function create(context = live ? null : current) { pendingNavigation.current=null; pendingMedia.current=null; setMediaRequest(undefined); setManualMedia(undefined); const c = newConversation(context); if(live){liveSequence.current++;liveReads.current.cancel();liveSelected.current=c.id;livePending.current=false;liveTracking.current=false;liveDrafts.current.add(c.id);} liveRequestKey.current=null; setChats(rows => [c, ...rows].slice(0, 20)); setSelected(c.id); setHistory(false); setAssignedOpen(false); setInput(""); setNotice(""); return c; }
  function update(id: string, fn: (c: Conversation) => Conversation) { setChats(rows => rows.map(c => c.id === id ? { ...fn(c), updatedAt: new Date().toISOString() } : c).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt))); }
  const selectedImage=live&&imageSearch&&attachment?.chatId===(chat?.id||"")?attachment.file:undefined;
  async function send(value = input) {
    const image=selectedImage;
    const text=value.trim()||(image?"Tìm đồng hồ trong kho từ ảnh mình gửi.":""); if (!text || busy || !ready || !scopeEnabled) return;
    if(!image&&awaitingInsight){await writeMedia(text);return;}
    const c = chat || create();
    if(live){
      setBusy(true);setNotice("");liveSubmitting.current=true;liveSequence.current++;
      liveReads.current.cancel();
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
        const row=await livePost({action:"send",...(imageBase64?{imageBase64}:{}),...(c.revision?{id:c.id}:{}),requestKey:liveRequestKey.current.key,text,...(c.pendingReview?{reviewApproval:{kind:c.pendingReview.kind,revision:c.pendingReview.revision,token:c.pendingReview.token}}:{}),screenPath,productId:mediaEditor?.productId??(isProductContext(current)?current.id||null:null)}) as Conversation;if(pendingNavigation.current)pendingNavigation.current.conversationId=row.id;if(pendingMedia.current)pendingMedia.current.conversationId=row.id;liveDrafts.current.delete(c.id);liveRequestKey.current=null;setInput("");setAttachment(undefined);liveSelected.current=row.id;setSelected(row.id);setChats(rows=>[row,...rows.filter(r=>r.id!==c.id&&r.id!==row.id)]);}
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
  async function approveMediaPostLive(){if(!chat?.mediaPostDraft)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"approve-media-post",id:chat.id,revision:chat.mediaPostDraft.revision});await refreshLive(chat.id);}catch(error){setNotice(error instanceof Error?error.message:"Chưa tạo được post. Hãy tải lại cuộc trao đổi trước khi thử tiếp.");}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approvePersonalWorkLive(){if(!chat?.personalWorkDraft)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"approve-personal-work",id:chat.id,revision:chat.personalWorkDraft.revision,includeUpdates:!!chat.personalWorkDraft.updates});await refreshLive(chat.id);}catch(error){setNotice(error instanceof Error?error.message:"Chưa tạo được lịch cá nhân.");}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approveOrderServicesLive(){if(!chat?.orderServicesDraft)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"approve-order-services",id:chat.id,revision:chat.orderServicesDraft.revision});await refreshLive(chat.id);}catch(error){setNotice(error instanceof Error?error.message:"Chưa xác nhận cập nhật. Tải lại cuộc trao đổi để kiểm tra trước khi thử lại.");}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approveOrderLive(){if(!chat?.orderDraft)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"approve-order",id:chat.id,revision:chat.orderDraft.revision});await refreshLive(chat.id);}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approveLive(){if(!chat?.revision)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"approve",id:chat.id,revision:chat.revision});await refreshLive(chat!.id);}finally{liveSubmitting.current=false;setBusy(false);}}
  async function approvePermissionLive(){if(!chat?.permissionRequest)return;setBusy(true);liveSubmitting.current=true;try{await livePost({action:"permission-support",id:chat.id,revision:chat.permissionRequest.revision});await refreshLive(chat.id);}catch(e){setNotice(e instanceof Error?e.message:"Chưa gửi được yêu cầu cho Long.");}finally{liveSubmitting.current=false;setBusy(false);}}
  async function updateLiveRequest(request:NonNullable<Conversation["customerRequest"]>,requestRevision?:number){const original=requestRevision!==undefined?chat?.approvedRequests?.find(r=>r.revision===requestRevision)?.request:chat?.customerRequest;if(!original)return;const changed=request.conditions.find(c=>{const old=original.conditions.find(o=>o.id===c.id);return old&&(old.outcome!==c.outcome||old.result!==c.result);});if(!changed)return;setBusy(true);try{await livePost({action:"outcome",id:chat!.id,requestRevision,conditionId:changed.id,outcome:changed.outcome,result:changed.result});await refreshLive(chat!.id);}catch(e){setNotice(e instanceof Error?e.message:"Chưa lưu kết quả.");}finally{setBusy(false);}}
  if(live&&sessionExpired)return <aside aria-label="Ben · Đăng nhập lại" className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-white p-6 text-center"><h2 className="text-lg font-semibold">Đăng nhập lại để tiếp tục với Ben</h2><p className="my-3 text-sm text-slate-600">Phiên đăng nhập đã hết hạn. Các cuộc trò chuyện vẫn được lưu trong tài khoản.</p><a className="min-h-11 rounded-xl bg-blue-600 px-5 py-3 text-white" href={"/login?next="+encodeURIComponent(pathname)}>Đăng nhập lại</a></aside>;
  return <>
    {!fullPage && <button ref={launcher} type="button" aria-label="Mở Ben" aria-expanded={open} onClick={() => {if(open)close();else setWindowOpen(true);}} className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 font-semibold text-white shadow-xl hover:bg-blue-800"><BenAvatar /><span>Ben</span>{!live && <span className="rounded bg-white/20 px-1.5 text-[10px]">MẪU</span>}</button>}
    {(open || fullPage) && <>{!fullPage&&<button aria-label="Đóng Ben" onClick={close} className="fixed inset-0 z-[65] bg-slate-950/30 sm:hidden" />}
    <aside ref={panel} style={fullPage?{height:"var(--ben-viewport-height, 100dvh)",top:"var(--ben-viewport-top, 0px)"}:undefined} aria-label="Ben · Hỗ trợ công việc" onKeyDown={event => { if (event.key === "Escape") close(); if (event.key === "Tab" && window.innerWidth < 640) { const nodes = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea, input, select, a[href]'); if (!nodes?.length) return; const first = nodes[0], last = nodes[nodes.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } }} className={styles.panel+" "+(fullPage ? "fixed inset-0 z-[70] mx-auto flex h-[100dvh] w-full max-w-3xl flex-col bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-xl" : "fixed inset-y-0 right-0 z-[70] flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:w-[540px] lg:w-[600px] xl:w-[640px]")}>
      <header className={styles.header+" flex items-center justify-between"}><div className="flex items-center gap-3"><BenAvatar/><div><h2 className="font-semibold">Ben</h2><p className="mt-0.5 text-xs text-slate-500"><span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${busy?"bg-violet-400":"bg-emerald-500"}`}/>{busy?"Đang xử lý…":"Sẵn sàng hỗ trợ"}</p></div></div><div className="flex items-center gap-1">{live&&fullPage&&<><BenPushControls/><BenLogout/></>}{live&&!fullPage&&<Link href="/admin/ben" aria-label="Mở Ben riêng" title="Mở Ben riêng" className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-violet-50"><ExternalLink size={19}/></Link>}{!fullPage&&<button aria-label="Đóng Ben" onClick={close} className="min-h-11 min-w-11 p-2"><X size={22}/></button>}</div></header>
      {benEnvironmentLabel(live,environment)&&<div className="px-5 pb-2 text-[10px] text-violet-700"><span className="rounded bg-violet-50 px-2 py-1">{benEnvironmentLabel(live,environment)}</span>{!live&&<span className="ml-2">Không tạo việc thật</span>}</div>}
      {live&&fullPage&&<BenPwaRuntime/>}
      {live&&(mediaEditor ? <BenMediaReview key={mediaEditor.productId+":"+selected} editor={mediaEditor} awaitingInsight={awaitingInsight} status={currentMediaStatus} onAsk={()=>{mediaEditor.showDraft();setMediaStatus(undefined);setManualMedia({key:crypto.randomUUID(),session:mediaEditor.session});}} onSkip={()=>void writeMedia("")} requestKey={mediaRequest?.mode==="inspect"&&mediaRequest.editor.session===mediaEditor.session?mediaRequest.key:undefined}/> : <BenScreenContext pathname={pathname}/>)}
      {live&&<nav aria-label="Mục trong cuộc trao đổi" className={styles.tabs}><button type="button" aria-pressed={!history&&!assignedOpen} onClick={()=>{setHistory(false);setAssignedOpen(false);}}>Trò chuyện</button><button type="button" aria-pressed={assignedOpen} onClick={()=>{if(fullPage){router.push("/admin/personal-work?view=list");return;}setHistory(false);setAssignedOpen(true);}}>Công việc <span className={styles.badge}>{assignedCount}</span></button><button type="button" disabled={busy} aria-label="Lịch sử trao đổi" aria-pressed={history} onClick={()=>{setAssignedOpen(false);setHistory(v=>!v);}} title="Lịch sử trao đổi"><History size={18}/></button></nav>}
      {live&&assignedOpen?<section aria-label="Các yêu cầu đã giao" className="min-h-0 flex-1 overflow-y-auto p-5"><h3 className="font-semibold">Công việc trong cuộc trò chuyện</h3><p className="mt-2 text-xs leading-5 text-slate-500">Các yêu cầu trong cuộc trao đổi này. Đã giao việc chưa có nghĩa là đã hoàn tất.</p>{!assignedCount&&<p className="mt-6 text-sm text-slate-500">Chưa có yêu cầu nào được giao.</p>}{assigned.map(r=><details key={r.key} className="mt-4 rounded-xl border p-3"><summary className="cursor-pointer text-sm font-medium">{r.request.reference||"Yêu cầu đã giao"} · {r.request.watch}</summary><CustomerRequestDemo request={r.request} live environment={environment} busy={busy} canManage={canManage&&!busy} onEdit={()=>{setAssignedOpen(false);}} onChange={request=>{void updateLiveRequest(request,r.current?undefined:r.revision);}} /></details>)}{chat?.updatedPersonalWork?.map(item=><Link key={"updated-"+item.revision+"-"+item.id} href={"/admin/personal-work?"+(fullPage?"view=list&":"")+"item="+encodeURIComponent(item.id)} className="mt-4 block rounded-xl border p-3 text-sm text-blue-700">Đã cập nhật: {item.code?item.code+" · ":""}{item.title}</Link>)}{chat?.createdPersonalWork?.map(item=><Link key={"personal-"+item.revision+"-"+item.id} href={"/admin/personal-work?"+(fullPage?"view=list&":"")+"item="+encodeURIComponent(item.id)} className="mt-4 block rounded-xl border p-3 text-sm text-blue-700">{item.kind==="EVENT"?"Sự kiện":"Công việc"}: {item.code?item.code+" · ":""}{item.title}{item.codex?(item.codex.notBefore?" · Codex đã hẹn giờ":" · Đã xếp hàng Codex"):""}{item.calendarRecipients?.length?" · "+benCalendarResultLabel(item.calendarRecipients):item.calendar==="FAILED"?" · Đã lưu, chưa đồng bộ Google. Mở Quản lý công việc để thử lại.":item.calendar==="PENDING"?" · Chưa xác nhận đồng bộ Google.":""}</Link>)}{chat?.createdMediaPosts?.map(post=><Link key={"post-"+post.revision} href={"/admin/media-posts/"+encodeURIComponent(post.id)} className="mt-4 block rounded-xl border p-3 text-sm text-blue-700">Post nháp {post.reference} · {post.count} đồng hồ</Link>)}{chat?.updatedServiceOrders?.map(o=><Link key={"services-"+o.revision} href={"/admin/orders/"+encodeURIComponent(o.id)} className="mt-4 block rounded-xl border p-3 text-sm text-indigo-700 underline">Đơn {o.reference} · Đã thêm {o.addedCount} dịch vụ</Link>)}{chat?.createdOrders?.map(o=><Link key={`order-${o.revision}`} href={`/admin/orders/${o.id}`} className="mt-4 block rounded-xl border p-3 text-sm text-indigo-700 underline">Đơn nháp {o.reference} · Mở đơn hàng</Link>)}{chat?.permissionRequests?.map(r=><p key={r.revision} className="mt-4 rounded-xl border p-3 text-sm">{r.reference} · Đã gửi Long xem xét quyền hạn</p>)}{notice&&<p role="status" className="mt-4 rounded bg-amber-50 p-2 text-xs text-amber-900">{notice}</p>}</section>:history ? <div className="flex-1 overflow-y-auto p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Trao đổi gần đây</h3><button disabled={live || busy || !chats.length} onClick={() => { setChats([]); setSelected(""); setNotice("Đã xóa lịch sử mẫu khỏi trình duyệt."); }} className="text-xs text-rose-700 underline">Xóa tất cả</button></div>{!chats.length && <p className="text-sm text-slate-500">Chưa có cuộc trao đổi nào.</p>}{chats.filter(c => live || isProductContext(c.context)).map(c => <div key={c.id} className="mb-2 flex rounded-xl border p-3"><button className="min-w-0 flex-1 text-left" onClick={() => { pendingNavigation.current=null; pendingMedia.current=null; setMediaRequest(undefined); setManualMedia(undefined); setSelected(c.id); if(live)void refreshLive(c.id).catch(e=>setNotice(e.message)); setHistory(false); setNotice(""); }}><p className="truncate text-sm font-medium">{c.title}</p><p className="mt-1 text-xs text-slate-500">{live?"Trò chuyện với Ben":c.context?.label || "Trao đổi tự do"} · {c.approved || c.customerRequest?.status === "TRACKING" ? live ? "Đã giao việc" : "Đã duyệt mẫu" : "Đang trao đổi"}</p></button><button disabled={live} aria-label={`Xóa trao đổi ${c.title}`} onClick={() => { setChats(rows => rows.filter(row => row.id !== c.id)); if (selected === c.id) setSelected(""); }} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button></div>)}</div> : <>
      {!live && <div className="space-y-2 border-b bg-slate-50 px-5 py-3 text-xs"><div className="flex items-center justify-between gap-2"><span className="font-medium text-slate-700">{chat ? chat.context ? `Đang trao đổi về: ${chat.context.label}` : "Trao đổi tự do · chưa gắn đối tượng" : `Ngữ cảnh gợi ý: ${current.label}`}</span></div>{chat && isProductContext(current) && chat.context?.href !== current.href && <div className="rounded-lg border border-indigo-200 bg-white p-2 text-indigo-900"><p>Bạn đang mở {current.label}. Cuộc trao đổi này vẫn giữ ngữ cảnh cũ.</p><button disabled={busy} onClick={() => create()} className="mt-1 font-semibold underline">Bắt đầu trao đổi về màn hình hiện tại</button></div>}{chat?.context?.kind === "list" && <p className="text-slate-500">Chọn một watch hoặc nêu SKU trong chat.</p>}</div>}
      <div className={styles.scroll}>
        {!scopeEnabled && <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm"><strong>Đang tập trung vào Sản phẩm</strong><p className="my-2">Ngữ cảnh của các màn hình khác tạm tắt. Mở danh sách hoặc chi tiết sản phẩm để bắt đầu trao đổi.</p><Link href="/admin/watches" className="font-semibold text-indigo-700 underline">Mở Sản phẩm</Link></div>}
        {scopeEnabled && !chat?.messages.length && <div className="space-y-5 py-5"><h3 className="text-2xl font-semibold tracking-tight text-slate-900">Chào bạn, Ben đây.</h3><p className="text-sm leading-6 text-slate-500">Bạn muốn xử lý việc gì hôm nay? Mình sẽ cùng bạn làm rõ và chuẩn bị đề xuất để bạn duyệt.</p><div className="space-y-2">{["Ghi nhận yêu cầu khách hàng có điều kiện", "Tóm tắt tình hình sản phẩm", "Đề xuất công việc phối hợp liên phòng ban"].map(text => <button key={text} disabled={!ready || !scopeEnabled} onClick={() => void send(text)} className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm hover:border-indigo-300 hover:bg-indigo-50">{text}<ArrowRight size={16}/></button>)}</div></div>}
        <div className="space-y-6" aria-live="polite">{chat?.messages.map(m=><BenConversationMessage key={m.id} message={m} userProfile={userProfile} containerRef={m.id===latestMessage?.id&&m.role==="assistant"?latestReply:undefined}>{live&&m.role==="assistant"&&m.repositorySources&&<RepositorySources sources={m.repositorySources}/>} {live&&m.navigation&&<Link href={fullPage&&m.navigation.href==="/admin/personal-work"?"/admin/personal-work?view=list":m.navigation.href} className="mt-3 inline-flex rounded-xl border border-violet-100 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50">Mở {m.navigation.label} →</Link>}{live&&m.role==="assistant"&&m.products?.map(product=><ProductPhotoCard key={product.id} product={product} compact={m.compactProductCards}/>)}</BenConversationMessage>)}{busy&&<p role="status" className="animate-pulse pl-10 text-xs text-violet-600">{live?"Ben đang xử lý…":"Đang chuẩn bị câu trả lời mẫu…"}</p>}{busy&&<div ref={bottom}/>}</div>
        {productionRelease&&productionRelease.conversationId===chat?.id&&chat.capabilities?.canDeployProduction&&<a className="text-sm underline" href={productionRelease.workflowUrl} target="_blank" rel="noopener noreferrer">Mở GitHub Actions production</a>}
        {live&&chat?.capabilities?.canReviewProductionMain&&<ProductionMainRelease key={chat.id} />}
        {live&&chat&&<CodeJobPanel draft={chat.codeDraft?.revision===chat.revision?chat.codeDraft:undefined} job={chat.codeJob} busy={busy} canRun={!!chat.capabilities?.canRunCode} canMerge={!!chat.capabilities?.canMergeCode} canDeploy={!!chat.capabilities?.canDeployCode} canDeployProduction={!!chat.capabilities?.canDeployProduction} onCommand={(action,input)=>{void codeAction(action,input);}}/>}
        {live&&chat?.orderServicesDraft&&chat.orderServicesDraft.revision===chat.revision&&chat.runStatus==="DRAFT"&&<OrderServicesDraftReview draft={chat.orderServicesDraft} busy={busy||!chat.capabilities?.canAppendOrderServices} onApprove={()=>void approveOrderServicesLive()}/>}
        {live&&chat?.orderDraft&&chat.runStatus==="DRAFT"&&<OrderDraftReview draft={chat.orderDraft} busy={busy} canCreate={!!chat.capabilities?.canCreateOrders} onApprove={approveOrderLive} onEdit={()=>{setInput("");textarea.current?.focus();}}/>}
        {live&&chat?.permissionRequest&&<section data-ben-review className="mt-4 rounded-xl border border-violet-100 bg-white p-4"><h3 className="text-sm font-semibold">Nhờ Long hỗ trợ quyền hạn</h3><p className="mt-2 whitespace-pre-wrap text-sm">{chat.permissionRequest.summary}</p><p className="mt-2 text-xs text-slate-600">Long sẽ xem xét yêu cầu. Quyền của bạn và công việc đang bị chặn chưa thay đổi.</p><button type="button" disabled={busy} data-ben-approve onClick={()=>void approvePermissionLive()} className="mt-3 rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">Tạo công việc cho Long</button></section>}
        {missingQuestion && lastAssistant !== missingQuestion && <p role="status" className="mt-4 rounded-2xl bg-slate-100 p-3.5 text-sm text-slate-800">{missingQuestion}</p>}
        {live&&!busy&&chat?.personalWorkUpdateDraft&&<PersonalWorkUpdateReview draft={chat.personalWorkUpdateDraft} busy={busy||!chat.capabilities?.canUpdatePersonalWork} onApprove={()=>void approvePersonalWorkUpdateLive()} onEdit={()=>{setInput("");textarea.current?.focus();}}/>}
        {live&&chat?.createdMediaPosts?.at(-1)&&<Link href={"/admin/media-posts/"+encodeURIComponent(chat.createdMediaPosts.at(-1)!.id)} className="mt-3 block text-sm font-medium text-blue-700 underline">Mở post nháp {chat.createdMediaPosts.at(-1)!.reference}</Link>}
        {live&&chat?.mediaPostDraft&&<MediaPostDraftReview draft={chat.mediaPostDraft} busy={busy||!chat.capabilities?.canCreateMediaPosts} onApprove={()=>void approveMediaPostLive()}/>}
        {live&&!busy&&chat?.personalWorkDraft&&<PersonalWorkDraftReview draft={chat.personalWorkDraft} busy={busy||!chat.capabilities?.canCreatePersonalWork||personalWorkDraftItems(chat.personalWorkDraft).some(d=>!!d.plan.codex)&&!chat.capabilities?.canSchedulePersonalCodex} onApprove={()=>void approvePersonalWorkLive()} onEdit={()=>{setInput("");textarea.current?.focus();}}/>}
        {chat?.customerRequest && !missingQuestion && (!live || (!chat.approved && chat.customerRequest.status!=="TRACKING" && chat.runStatus === "DRAFT")) && <CustomerRequestDemo key={chat.customerRequest.id} request={chat.customerRequest} live={live} environment={environment} onApprove={live?approveLive:undefined} onEdit={text => { setInput(text); textarea.current?.focus(); }} busy={busy} canManage={(live?chat.customerRequest.conditions.every(c=>c.kind==="TECHNICAL"?chat.capabilities?.canCreateTechnical:chat.capabilities?.canCreateTasks):canManage&&scenario!=="denied")&&!busy} onChange={request => { if(live)void updateLiveRequest(request);else update(chat.id, c => ({ ...c, customerRequest: request })); }} />}
        {!!chat?.steps.length && !chat.approved && !chat.customerRequest && <p role="status" className="mt-4 rounded-2xl bg-slate-100 p-3.5 text-sm">Để chuẩn bị giao việc, bạn cho mình biết thông tin khách hàng và SKU trong chat nhé.</p>}
        {!live&&chat?.approved && !chat.customerRequest && <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><h3 className="flex items-center gap-2 font-semibold text-emerald-900"><Check size={18}/>Đã duyệt phương án mẫu</h3><p className="mt-1 text-xs text-emerald-800">Không có việc thật trong hàng đợi nghiệp vụ.</p>{chat.tasks.map((s, i) => <div key={s.id} className="mt-3 rounded-lg bg-white p-3 text-sm"><strong>{i + 1}. {s.title}</strong><p className="mt-1 text-xs text-slate-500">{departments[s.department as keyof typeof departments]} · {people[s.assignee as keyof typeof people]}</p><label className="mt-2 block text-xs">Tiến độ mẫu<select aria-label={`Tiến độ ${s.title}`} className={field} value={s.status} onChange={e => update(chat.id, c => ({ ...c, tasks: c.tasks.map(t => t.id === s.id ? { ...t, status: e.target.value } : t) }))}>{["Chờ tiếp nhận (mẫu)", "Đang xử lý (mẫu)", "Cần phản hồi (mẫu)", "Hoàn tất (mẫu)"].map(status => <option key={status}>{status}</option>)}</select></label></div>)}</section>}
        {live&&!busy&&chat?.pendingReview&&<p className={styles.reviewHint}><LockKeyhole size={13} className="shrink-0"/>Ben chỉ lưu khi bạn xác nhận. Bấm Duyệt hoặc nhắn “duyệt”, “ok”.</p>}
        {!busy&&<div ref={bottom}/>}
      </div>
      <footer className={styles.footer}>{!history&&!assignedOpen&&!busy&&!input.trim()&&!selectedImage&&<div className={styles.shortcuts}>{[{label:"Việc của tôi",text:"Mở công việc của tôi"},{label:"Tìm đồng hồ",text:"Mình muốn tìm đồng hồ "}].map(action=>live&&action.label==="Việc của tôi"?<Link key={action.label} href="/admin/personal-work?view=list"><ListTodo/>{action.label}</Link>:<button type="button" key={action.label} disabled={busy||!ready||!scopeEnabled} onClick={()=>{setInput(action.text);textarea.current?.focus();}} className="disabled:opacity-40">{action.label==="Việc của tôi"?<ListTodo/>:<Watch/>}{action.label}</button>)}</div>}{!live&&<label className="flex items-center justify-between gap-2 text-xs text-slate-500">Kịch bản giả lập<select aria-label="Kịch bản trợ lý" disabled={busy} value={scenario} onChange={e => setScenario(e.target.value as Scenario)} className="rounded border px-2 py-1"><option value="normal">Bình thường</option><option value="clarify">Hỏi lại trước khi đề xuất</option><option value="error">Lỗi xử lý</option><option value="denied">Không đủ quyền</option></select></label>}{notice && <p role="status" className="rounded bg-amber-50 p-2 text-xs text-amber-900">{notice}</p>}{selectedImage&&<div className="flex items-center justify-between gap-2 text-xs"><span className="truncate">Ảnh đã chọn · {selectedImage.name}</span><button type="button" disabled={busy} onClick={()=>setAttachment(undefined)}>Bỏ ảnh</button></div>}<form onSubmit={e => { e.preventDefault(); void send(); }} className={styles.composer}><button type="button" aria-label="Trao đổi mới" title="Trao đổi mới" className={styles.icon} disabled={busy||!ready||(!live&&!isProductContext(current))} onClick={()=>create()}><Plus size={20}/></button>{live&&imageSearch&&<label className={styles.icon+" relative focus-within:ring-2 focus-within:ring-violet-300"} title="Chọn ảnh để tìm đồng hồ"><ImagePlus size={18}/><input className="absolute inset-0 cursor-pointer opacity-0" type="file" aria-label="Chọn ảnh đồng hồ" accept="image/jpeg,image/png,image/webp" disabled={busy||!ready||!scopeEnabled} onChange={e=>{
        const file=e.currentTarget.files?.[0];e.currentTarget.value="";
        if(!file)return;
        if(file.size>MAX_BEN_IMAGE_BYTES||!["image/jpeg","image/png","image/webp"].includes(file.type)){setNotice("Chọn ảnh JPG, PNG hoặc WebP tối đa 4 MB.");return;}
        setNotice("");setAttachment({chatId:chat?.id||"",file});
      }}/></label>}<textarea ref={textarea} aria-label="Tin nhắn cho Ben" maxLength={4000} rows={1} value={input} disabled={busy || !scopeEnabled} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }} placeholder="Nhờ Ben tìm hoặc xử lý công việc…" className="max-h-20 min-h-10 sm:max-h-36 flex-1 resize-none rounded-xl border-0 bg-transparent px-2 py-2 text-base leading-6 outline-none sm:text-sm"/>{busy ? <button type="button" aria-label="Hủy lượt trả lời" onClick={cancel} className="rounded-xl bg-slate-900 p-3 text-white"><Square size={18}/></button> : <button type="submit" aria-label="Gửi tin nhắn" disabled={(!input.trim()&&!selectedImage) || !ready || !scopeEnabled} className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-40"><Send size={18}/></button>}</form>{!live && <p className={styles.caption}>Bản giả lập · Không tạo việc thật</p>}</footer>
      </>}
    </aside></>}
  </>;
}
