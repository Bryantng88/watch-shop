/** Most specific routes precede section fallbacks. Record identities stay in content. */
export function adminRouteTitle(pathname: string): string {
  const exact: Record<string, string> = {
    "/admin": "Trang chủ", "/admin/dashboard": "Trang chủ",
    "/admin/users/roles": "Vai trò & quyền truy cập", "/admin/users/new": "Tạo người dùng",
    "/admin/profile": "Thông tin tài khoản", "/admin/users/profile": "Thông tin tài khoản",
    "/admin/straps/catalog": "Danh mục dây & khóa", "/admin/straps/replenishment": "Danh sách cần đặt thêm",
    "/admin/storefront/home": "Trang chủ website", "/admin/storefront/media": "Thư viện ảnh website",
    "/admin/media/recycle": "Thùng rác ảnh", "/admin/media": "Quản lý ảnh",
    "/admin/reports/finance": "Báo cáo", "/admin/reports/sales": "Báo cáo", "/admin/reports/overview": "Báo cáo",
    "/admin/system/jobs": "Tác vụ hệ thống", "/admin/system/job-logs": "Nhật ký tác vụ",
    "/admin/system/channels": "Kênh đăng", "/admin/system/blueprints": "Blueprint công việc",
    "/admin/system/workflows": "Quy trình", "/admin/workflows": "Quy trình",
    "/admin/work-cases/settings": "Cấu hình hồ sơ công việc",
  };
  if (exact[pathname]) return exact[pathname];
  if (/^\/admin\/acquisitions(?:\/(?:watches|straps|clasps|accessories))?\/new$/.test(pathname)) return "Tạo phiếu nhập";
  if (pathname === "/admin/orders/new") return "Tạo đơn hàng";
  if (/^\/admin\/orders\/[^/]+\/edit$/.test(pathname)) return "Chỉnh sửa đơn hàng";
  if (pathname === "/admin/watches/new") return "Tạo đồng hồ";
  if (/^\/admin\/watches\/[^/]+\/edit$/.test(pathname)) return "Chỉnh sửa đồng hồ";
  const sections: [string, string][] = [
    ["coordination", "Vận hành"], ["products", "Sản phẩm"], ["watches", "Sản phẩm"], ["straps", "Sản phẩm"],
    ["trading", "Mua bán"], ["acquisitions", "Mua bán"], ["orders", "Mua bán"],
    ["directory", "Danh bạ"], ["users", "Danh bạ"], ["customers", "Danh bạ"], ["vendors", "Danh bạ"],
    ["reports", "Báo cáo"], ["personal-work", "Quản lý công việc"], ["tasks", "Công việc"], ["task-items", "Đầu việc"],
    ["services", "Dịch vụ"], ["catalogs", "Danh mục kỹ thuật"], ["shipments", "Vận chuyển"], ["payments", "Thanh toán"],
    ["purchase-requests", "Yêu cầu mua"], ["work-cases", "Hồ sơ công việc"], ["activity", "Hoạt động"],
    ["media-posts", "Media Post"], ["system", "System"], ["settings", "Cài đặt"], ["storefront", "Quản trị website"],
  ];
  return sections.find(([segment]) => pathname === `/admin/${segment}` || pathname.startsWith(`/admin/${segment}/`))?.[1] ?? "Quản trị";
}
