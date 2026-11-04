export type Condition = { id: string; requirement: string; expected: string; kind: "TECHNICAL" | "TASK"; assignee: string; progress: string; outcome: string; result: string; linkedRef?: string };
export type CustomerRequest = { id: string; reference: string; customer: string; watch: string; owner: string; original: string; status: "DRAFT" | "TRACKING"; conditions: Condition[]; decision: string; reviewReady?: boolean };
export function isCustomerRequest(value: unknown): value is CustomerRequest {
  if (!value || typeof value !== "object") return false;
  const r=value as CustomerRequest;
  return [r.id,r.reference,r.customer,r.watch,r.owner,r.original,r.decision].every(v=>typeof v==="string") && ["DRAFT","TRACKING"].includes(r.status) && Array.isArray(r.conditions) && r.conditions.length<=8 && r.conditions.every(c=>c && [c.id,c.requirement,c.expected,c.assignee,c.progress,c.outcome,c.result].every(v=>typeof v==="string") && ["TECHNICAL","TASK"].includes(c.kind));
}
export function condition(kind: Condition["kind"] = "TASK"): Condition {
  return { id: crypto.randomUUID(), requirement: "", expected: "", kind, assignee: "", progress: "Chờ tiếp nhận", outcome: "Chưa xác minh", result: "" };
}
const demoPeople = { Minh: "Minh · Kỹ thuật (mẫu)", An: "An · Vận hành (mẫu)", Linh: "Linh · Sales (mẫu)", Hà: "Hà · Media (mẫu)" };
export function collectCustomerRequest(text: string, watch: string, previous?: CustomerRequest) {
  if (previous?.status === "TRACKING") return { request: previous, question: "" };
  const r: CustomerRequest = previous ? { ...previous, conditions: previous.conditions.map(c=>({...c})), original: previous.original+"\n"+text } : { ...draftCustomerRequest(text,watch), conditions:[], reviewReady:false };
  const customer=text.match(/khách(?: hàng)?\s+(?:tên\s+)?(.+?)(?=\s+(?:muốn|cần|đang|quan tâm|sẽ|mua|hỏi|nếu|về)(?:\s|$)|[,;.\n]|$)/iu)?.[1]?.trim();
  if(customer && !/^(muốn|cần|mua|hỏi|này)(?:\s|$)/i.test(customer))r.customer=customer;
  const sku=text.match(/\bSKU\s*[:#]?\s*([a-z0-9][a-z0-9._-]{2,})/i)?.[1]?.replace(/[._-]+$/,"");
  if(sku)r.watch=sku;else if(!r.watch)r.watch=watch;
  const definitions=[
    {pattern:/chống\s*nước/i,key:"Kiểm tra chống nước",kind:"TECHNICAL" as const,expected:"Ghi kết quả kiểm tra và kết luận đáp ứng yêu cầu chống nước hay không."},
    {pattern:/kiểm tra (?:bộ )?máy/i,key:"Kiểm tra máy",kind:"TECHNICAL" as const,expected:"Ghi kết quả kiểm tra tình trạng máy và điều cần xử lý."},
    {pattern:/mắt\s*dây/i,key:"Xác minh nguồn mắt dây phù hợp",kind:"TASK" as const,expected:"Xác minh nguồn và tương thích mắt dây; chưa đặt mua hoặc cam kết giá."},
  ];
  for(const d of definitions)if(d.pattern.test(text)&&!r.conditions.some(c=>c.requirement===d.key))r.conditions.push({...condition(d.kind),requirement:d.key,expected:d.expected});
  // Deliberately bounded local script, not model inference or directory lookup.
  const clauses=text.replace(/khách(?: hàng)?\s+\S+/iu,"").split(/[,;.\n]/);
  for(const c of r.conditions){
    const topic=c.kind==="TECHNICAL"?/kiểm tra|chống nước|kỹ thuật|máy/i:/tìm|mắt|dây|vận hành|phụ kiện/i;
    const matching=clauses.filter(clause=>topic.test(clause));
    const names=Object.keys(demoPeople) as (keyof typeof demoPeople)[];
    const action=c.kind==="TECHNICAL"?"kiểm tra|xác minh|xử lý":"tìm|xác minh|chuẩn bị";
    const direct=names.find(name=>matching.some(clause=>new RegExp(`(?:^|\\s)${name}\\s+(?:giúp\\s+)?(?:${action})`,"iu").test(clause)));
    const mentioned=names.filter(name=>matching.some(clause=>new RegExp(`(?:^|\\s)${name}(?=\\s|$)`,"iu").test(clause)));
    const name=direct || (mentioned.length===1?mentioned[0]:undefined);
    if(name)c.assignee=demoPeople[name];
  }
  const missing=[];
  if(!r.customer)missing.push("khách tên hoặc mã gì");if(!r.watch)missing.push("watch có SKU nào");
  if(!r.conditions.length)missing.push("điều kiện khách cần đáp ứng là gì (bản mẫu hỗ trợ kiểm tra chống nước/máy và tìm mắt dây)");
  const unassigned=r.conditions.filter(c=>!c.assignee);
  if(unassigned.length)missing.push(`ai nhận ${unassigned.map(c=>c.requirement.toLowerCase()).join(", ")} (người mẫu: Minh, An, Linh, Hà; ví dụ “Minh kiểm tra, An tìm mắt dây”)`);
  if(!missing.length)r.reviewReady=true;
  return {request:r,question:missing.length?"Mình cần biết thêm: "+missing.join("; ")+"? Bạn trả lời ngay trong chat nhé.":""};
}
export function draftCustomerRequest(original: string, watch = ""): CustomerRequest {
  return { id: crypto.randomUUID(), reference: "", customer: "", watch, owner: "Bạn · người nhận yêu cầu", original, status: "DRAFT", decision: "Chưa quyết định", conditions: [
    { ...condition("TECHNICAL"), requirement: "Kiểm tra chống nước", expected: "Kỹ thuật ghi kết quả kiểm tra và kết luận đáp ứng yêu cầu hay không.", assignee: "Minh · Kỹ thuật (mẫu)" },
    { ...condition(), requirement: "Xác minh nguồn mắt dây phù hợp", expected: "Xác minh tương thích, nguồn cung và thông tin cần báo lại; chưa đặt mua.", assignee: "An · Vận hành (mẫu)" },
  ] };
}
export function validateCustomerRequest(r: CustomerRequest): string | null {
  if (!r.customer.trim() || !r.watch.trim() || !r.owner.trim()) return "Điền khách hàng, watch cụ thể và người phụ trách bán hàng.";
  if (!r.conditions.length) return "Cần ít nhất một điều kiện mua.";
  if (r.conditions.some(c => !c.requirement.trim() || !c.expected.trim() || !c.assignee)) return "Mỗi điều kiện cần nội dung, kết quả mong đợi và người nhận.";
  return null;
}
export function approveCustomerRequest(r: CustomerRequest): CustomerRequest {
  if (r.status === "TRACKING") return r;
  const error = validateCustomerRequest(r); if (error) throw Error(error);
  return { ...r, status: "TRACKING", reference: `YC-MAU-${r.id.slice(0, 6).toUpperCase()}`, conditions: r.conditions.map((c, i) => ({ ...c, linkedRef: `${c.kind === "TECHNICAL" ? "KT" : "TASK"}-MAU-${r.id.slice(0, 4).toUpperCase()}-${i + 1}` })) };
}
export function requestSummary(r: CustomerRequest) {
  if (r.status === "DRAFT") return "Bản nháp · chưa tạo phiếu/task";
  if (r.conditions.some(c => c.outcome === "Không đạt")) return "Có điều kiện không đạt · Sales cần trao đổi lại với khách";
  if (r.conditions.some(c => c.outcome === "Cần khách xác nhận")) return "Đang chờ khách xác nhận điều kiện";
  if (r.conditions.every(c => c.outcome === "Đạt")) return "Các điều kiện đều đạt · chờ Sales quyết định bước tiếp theo";
  return "Chưa đủ kết quả để chốt với khách";
}
