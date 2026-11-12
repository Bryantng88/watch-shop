import {PERMISSIONS} from "@/constants/permissions";
import {assistantCapabilities,type AssistantAuthority} from "./capabilities";
import {expandPermissions} from "@/server/auth/permission-implications";
type Account=AssistantAuthority&{id:string;name:string|null;roles:{name:string}[]};
export function requesterIdentity(actor:Account,isLong:boolean){
 return {id:actor.id,name:actor.name,roles:actor.roles.map(r=>r.name),isAdmin:actor.admin,isLong,
  permissions:actor.admin?[...new Set([...Object.values(PERMISSIONS),...actor.permissions])]:[...expandPermissions(actor.permissions)].sort(),...assistantCapabilities(actor)};
}
function permissionDescription(code:string){
 const scopes:Record<string,string>={DASHBOARD:"tổng quan",ORDER:"đơn hàng",PRODUCT:"sản phẩm",ACCESSORY:"phụ kiện",CUSTOMER:"khách hàng",USER:"người dùng",SERVICE:"dịch vụ/kỹ thuật",SHIPMENT:"vận đơn",MEDIA:"media",TASK:"công việc",ACTIVITY:"lịch sử hoạt động",WORK_CASE:"work case",SYSTEM_JOB:"hàng đợi hệ thống",REPORT:"báo cáo",REPORT_FINANCE:"báo cáo tài chính",REPORT_SALES:"báo cáo bán hàng",WATCH_ACQUISITION:"phiếu nhập đồng hồ",ACCESSORY_ACQUISITION:"phiếu nhập phụ kiện",ACQUISITION:"phiếu nhập",ORDER_PAYMENT:"thu/chi đơn hàng",ACQUISITION_PAYMENT:"thu/chi phiếu nhập",SERVICE_PAYMENT:"thu/chi dịch vụ",SHIPMENT_PAYMENT:"thu/chi vận đơn",PAYMENT:"thu/chi"};
 const verbs:Record<string,string>={VIEW:"xem",READ:"xem",CREATE:"tạo",UPDATE:"cập nhật",EDIT:"sửa",DELETE:"xóa",APPROVE:"duyệt",MANAGE:"quản lý"};
 const match=code.match(/_(VIEW|READ|CREATE|UPDATE|EDIT|DELETE|APPROVE|MANAGE)(?:_ALL)?$/),scope=code.replace(/_(VIEW|READ|CREATE|UPDATE|EDIT|DELETE|APPROVE|MANAGE)(?:_ALL)?$/,"");
 return match&&scopes[scope]?`${verbs[match[1]]} ${scopes[scope]}${code.endsWith("_ALL")?" (toàn bộ phạm vi được cấp)":""}`:`quyền ${code}`;
}
export function accountQuestion(text:string){
 const q=text.normalize("NFC").toLowerCase().replace(/[?!.，,]/g,"").trim();
 return /^(?:ben(?: ơi)?[, ]+)?(?:(?:tôi|mình|tớ|em|anh) là ai|(?:tôi|mình|tớ|em|anh) (?:có thể )?làm (?:được|dc) những gì|quyền (?:của )?(?:tôi|mình)|(?:tôi|mình) có (?:những )?quyền gì)$/.test(q);
}
export function accountReply(actor:Account,isLong:boolean){
 const name=actor.name||"tài khoản chưa đặt tên",role=actor.admin?"quản trị viên (ADMIN)":actor.roles.map(r=>r.name).join(", ")||"chưa được gán vai trò";
 const actions=[...expandPermissions(actor.permissions)].sort().map(permissionDescription);
 const caps=assistantCapabilities(actor),throughBen=[caps.canAppendOrderServices?"thêm dịch vụ vào đơn khách gửi với bản duyệt":null,caps.canSchedulePersonalCodex?"tạo việc và hẹn giờ giao Codex sau khi duyệt":null,caps.canUpdatePersonalWork?"cập nhật công việc cá nhân có quyền sửa":null,caps.canAssignPersonalWork?"giao công việc cá nhân cho người đã xác minh":null,caps.canCreatePersonalWork?"tạo công việc cá nhân hoặc sự kiện có lịch":null,caps.canCreateTasks?"tạo task":null,caps.canCreateTechnical?"tạo phiếu kỹ thuật":null,caps.canCreateOrders?"tạo đơn nháp":null].filter(Boolean);
 const rights=actor.admin?"có quyền quản trị sản phẩm, khách hàng, đơn hàng, công việc, kỹ thuật, người dùng và các nghiệp vụ quản trị khác theo chính sách phạm vi dữ liệu của hệ thống":actions.length?"được cấp các quyền: "+actions.join("; ")+", trong phạm vi dữ liệu được phép":"chưa được cấp quyền xử lý nghiệp vụ; vẫn có thể trò chuyện";
 return `Bạn đang đăng nhập với tài khoản ${name}, vai trò ${role}.${isLong?" Bạn là Long, người tạo ra toàn bộ dự án.":""}\n\nTheo quyền hiện tại, bạn ${rights}.\n\nQua Ben, bạn có thể trò chuyện${caps.allowedLookups.length?", tra cứu theo quyền":""}${throughBen.length?" và chuẩn bị "+throughBen.join(", ")+" để duyệt trước khi tạo":""}.${caps.canReadCode?" Bạn cũng có thể yêu cầu đọc repository và làm rõ yêu cầu sửa code; phần này chỉ phân tích, chưa thực thi.":""}${caps.canRunCode?" Luồng sửa code và mở PR cũng đã bật; merge/deploy staging cần lệnh riêng và cấu hình executor.":""} Các thao tác khác cần mở màn hình chức năng tương ứng; quyền của bạn và khả năng của Ben là hai phần riêng biệt.`;
}
