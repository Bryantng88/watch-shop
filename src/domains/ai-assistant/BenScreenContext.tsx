import React from "react";
import Link from "next/link";
import { ChevronRight, PanelsTopLeft } from "lucide-react";
const labels: Record<string,string> = {
  "/admin":"Tổng quan", "/admin/ben":"Trò chuyện với Ben", "/admin/personal-work":"Công việc của tôi",
  "/admin/watches":"Danh sách đồng hồ", "/admin/orders":"Đơn hàng", "/admin/customers":"Khách hàng",
  "/admin/coordination/operation":"Không gian vận hành", "/admin/coordination/sales":"Không gian bán hàng",
  "/admin/services/issues-board":"Bảng kỹ thuật", "/admin/media":"Thư viện media", "/admin/users/profile":"Hồ sơ cá nhân",
};
export default function BenScreenContext({ pathname }: { pathname: string }) {
  const label=labels[pathname]||(/^\/admin\/orders\/[^/]+$/.test(pathname)?"Chi tiết đơn hàng":/^\/admin\/watches\/[^/]+$/.test(pathname)?"Chi tiết đồng hồ":"Màn hình làm việc hiện tại");
  if(pathname==="/admin/ben")return null;
  return <Link href={pathname} title="Màn hình bạn đang mở; Ben không nhìn thấy các ô bạn đang nhập." className="mx-4 mb-3 flex min-w-0 items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-xs text-slate-600"><PanelsTopLeft size={17} className="shrink-0 text-blue-600"/><span className="min-w-0 flex-1 truncate">Đang xem · <strong className="font-medium text-slate-800">{label}</strong></span><ChevronRight size={15} className="shrink-0"/></Link>;
}
