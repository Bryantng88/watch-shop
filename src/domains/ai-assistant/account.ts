import {PERMISSIONS} from "@/constants/permissions";
import {assistantCapabilities,hasAssistantPermission,type AssistantAuthority} from "./capabilities";
type Account=AssistantAuthority&{id:string;name:string|null;roles:{name:string}[]};
export function requesterIdentity(actor:Account,isLong:boolean){
 return {id:actor.id,name:actor.name,roles:actor.roles.map(r=>r.name),isAdmin:actor.admin,isLong,
  permissions:actor.admin?Object.values(PERMISSIONS):[...actor.permissions].sort(),...assistantCapabilities(actor)};
}
export function accountQuestion(text:string){
 const q=text.normalize("NFC").toLowerCase().replace(/[?!.，,]/g,"").trim();
 return /^(?:ben(?: ơi)?[, ]+)?(?:(?:tôi|mình|tớ|em|anh) là ai|(?:tôi|mình|tớ|em|anh) (?:có thể )?làm (?:được|dc) những gì|quyền (?:của )?(?:tôi|mình)|(?:tôi|mình) có (?:những )?quyền gì)$/.test(q);
}
export function accountReply(actor:Account,isLong:boolean){
 const name=actor.name||"tài khoản chưa đặt tên",role=actor.admin?"quản trị viên (ADMIN)":actor.roles.map(r=>r.name).join(", ")||"chưa được gán vai trò";
 const actions=[["ORDER_VIEW","xem đơn hàng"],["ORDER_CREATE","tạo đơn hàng"],["ORDER_UPDATE","sửa đơn hàng"],["ORDER_APPROVE","duyệt đơn hàng"],["PRODUCT_VIEW","xem sản phẩm"],["PRODUCT_UPDATE","sửa sản phẩm"],["CUSTOMER_VIEW","xem khách hàng"],["CUSTOMER_CREATE","tạo khách hàng"],["TASK_VIEW","xem công việc"],["TASK_MANAGE","giao/quản lý công việc"],["SERVICE_CREATE","tạo phiếu kỹ thuật"],["USER_MANAGE","quản lý người dùng"],["REPORT_FINANCE_VIEW","xem báo cáo tài chính"]].filter(([p])=>hasAssistantPermission(actor,p)).map(([,label])=>label);
 const caps=assistantCapabilities(actor),throughBen=[caps.canCreateTasks?"tạo task":null,caps.canCreateTechnical?"tạo phiếu kỹ thuật":null,caps.canCreateOrders?"tạo đơn nháp":null].filter(Boolean);
 return `Bạn đang đăng nhập với tài khoản ${name}, vai trò ${role}.${isLong?" Bạn là Long, người tạo ra toàn bộ dự án.":""}\n\nTheo quyền hiện tại, bạn ${actions.length?"có thể "+actions.join(", ")+" trong phạm vi dữ liệu được phép":"chưa được cấp quyền xử lý nghiệp vụ; vẫn có thể trò chuyện"}.\n\nQua Ben, bạn có thể trò chuyện${caps.allowedLookups.length?", tra cứu theo quyền":""}${throughBen.length?" và chuẩn bị "+throughBen.join(", ")+" để duyệt trước khi tạo":""}. Các thao tác khác cần mở màn hình chức năng tương ứng; quyền của bạn và khả năng của Ben là hai phần riêng biệt.`;
}
