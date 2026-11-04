export type Context = { kind: string; label: string; href: string; id?: string };
export type Step = { id: string; title: string; department: string; assignee: string; description: string; dependsOn: string[] };
export type Message = { id: string; role: "user" | "assistant"; text: string };
export type Conversation = { id: string; title: string; context: Context | null; messages: Message[]; steps: Step[]; approved: boolean; tasks: (Step & { status: string })[]; updatedAt: string };
export type Scenario = "normal" | "clarify" | "error" | "denied";
const sections: Record<string, string> = { orders: "Đơn hàng", watches: "Đồng hồ", customers: "Khách hàng", acquisitions: "Phiếu nhập", "technical-issues": "Phiếu kỹ thuật", "personal-work": "Việc cá nhân", dashboard: "Tổng quan", coordination: "Điều phối công việc" };
const teams: Record<string, string> = { sales: "Sales", technical: "Kỹ thuật", operation: "Vận hành", media: "Media" };
export function pageContext(pathname: string): Context {
  const parts = pathname.split("/").filter(Boolean), section = parts[1];
  const label = sections[section] || "Màn hình nghiệp vụ";
  if (section === "coordination") return { kind: "list", label: teams[parts[2]] || label, href: pathname };
  const id = parts[2];
  if (id && !["new", "create", "edit"].includes(id) && sections[section]) return { kind: section, label: `${label} · ${decodeURIComponent(id).slice(0, 48)}`, id, href: pathname };
  return { kind: "list", label, href: pathname };
}
export function newConversation(context: Context | null): Conversation {
  return { id: crypto.randomUUID(), title: "Trao đổi mới", context, messages: [], steps: [], approved: false, tasks: [], updatedAt: new Date().toISOString() };
}
export function sampleSteps(): Step[] {
  return [
    { id: "s1", title: "Xác minh yêu cầu và tình trạng", department: "TECHNICAL", assignee: "technical", description: "Kiểm tra tình trạng và điều kiện cần đáp ứng; ghi nhận kết quả để các bộ phận phối hợp.", dependsOn: [] },
    { id: "s2", title: "Chuẩn bị phương án phối hợp", department: "OPERATION", assignee: "operation", description: "Đối chiếu kết quả kiểm tra, xác minh nguồn lực và phương án thực hiện; chưa cam kết giá hoặc thời hạn.", dependsOn: ["s1"] },
    { id: "s3", title: "Tổng hợp và phản hồi", department: "SALES", assignee: "sales", description: "Tổng hợp kết quả để người phụ trách kiểm tra trước khi phản hồi khách.", dependsOn: ["s2"] },
  ];
}
export function removeStep(steps: Step[], id: string) {
  return steps.filter(step => step.id !== id).map(step => ({ ...step, dependsOn: step.dependsOn.filter(key => key !== id) }));
}
export function simulateReply(text: string, scenario: Scenario, context: Context | null, clarifying: boolean) {
  if (scenario === "error") return { text: "Giả lập lỗi xử lý. Yêu cầu chưa tạo công việc. Bạn có thể đổi kịch bản rồi thử lại.", steps: [] };
  if (scenario === "denied") return { text: "Giả lập không đủ quyền với đối tượng này. Không tra cứu hoặc tạo việc. Bạn cần người có thẩm quyền xử lý; AI không cấp thêm quyền.", steps: [] };
  if (scenario === "clarify" && !clarifying) return { text: "Bạn muốn đạt kết quả gì, và cần bộ phận nào hỗ trợ? Hãy bổ sung điều kiện cần xác minh. Đây là câu hỏi mẫu, chưa đọc dữ liệu nghiệp vụ.", steps: [] };
  if (!context && !clarifying) return { text: "Yêu cầu này liên quan tới đối tượng hoặc công việc nào? Bạn có thể chọn màn hình hiện tại làm ngữ cảnh, hoặc mô tả đối tượng trong tin tiếp theo.", steps: [] };
  if (/tóm tắt|kiểm tra|tình hình/i.test(text) && !/đề xuất|tạo việc/i.test(text)) return { text: `Bản tóm tắt mẫu cho ${context?.label || "yêu cầu của bạn"}: cần làm rõ nhu cầu, kiểm tra điều kiện thực hiện và thống nhất người phụ trách. Chưa có dữ liệu thật về tiến độ, thanh toán hoặc tồn kho. Nếu cần, hãy yêu cầu tôi đề xuất các công việc phối hợp.`, steps: [] };
  return { text: `Tôi đề xuất 3 bước phối hợp cho ${context?.label || "yêu cầu bạn vừa mô tả"}. Đây là phương án mẫu, không suy ra từ dữ liệu thật. Bạn có thể sửa nội dung, bộ phận, người nhận và thứ tự phụ thuộc trước khi xác nhận. Quan hệ trước/sau chỉ để tham khảo, chưa tự chuyển trạng thái.`, steps: sampleSteps() };
}
export function readConversations(raw: string | null): Conversation[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((c): c is Conversation => Boolean(c && typeof c === "object" && typeof c.id === "string" && typeof c.title === "string" && typeof c.updatedAt === "string" && Array.isArray(c.messages) && c.messages.length <= 40 && c.messages.every((m: Message) => typeof m.id === "string" && ["user", "assistant"].includes(m.role) && typeof m.text === "string") && Array.isArray(c.steps) && Array.isArray(c.tasks) && [...c.steps, ...c.tasks].every((s: Step) => typeof s.id === "string" && typeof s.title === "string" && typeof s.department === "string" && typeof s.assignee === "string" && typeof s.description === "string" && Array.isArray(s.dependsOn)) && typeof c.approved === "boolean" && (c.context === null || (typeof c.context?.label === "string" && typeof c.context?.href === "string" && c.context.href.startsWith("/admin/"))))).slice(0, 20);
  } catch { return []; }
}
