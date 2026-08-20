import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  FileText,
  ImageIcon,
  MoreHorizontal,
  PackagePlus,
  Pencil,
  ReceiptText,
  Save,
  ShoppingBag,
  Stethoscope,
  Wrench,
} from "lucide-react";

const button = "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition";

function LinkRow({ icon: Icon, title, meta, status, tone }: { icon: typeof Wrench; title: string; meta: string; status: string; tone: string }) {
  return (
    <button type="button" className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/30">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="h-4 w-4" /></span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-slate-900">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-slate-500">{meta}</span>
      </span>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{status}</span>
      <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-violet-600" />
    </button>
  );
}

export default function WatchDetailCommandCenterTestPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] pb-24 text-slate-900">
      <div className="mx-auto max-w-[1500px] px-4 py-5 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <div><b>UI test · Watch Command Center</b><span className="ml-2 text-violet-700">Dữ liệu mẫu, các nút chưa gọi API thật.</span></div>
          <Link href="/admin/watches" className="inline-flex items-center gap-2 text-xs font-bold"><ArrowLeft className="h-4 w-4" /> Danh sách Watch</Link>
        </div>

        <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="relative grid min-h-52 place-items-center bg-gradient-to-br from-slate-200 to-slate-100 text-slate-400">
              <ImageIcon className="h-12 w-12" />
              <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/80 px-2.5 py-1.5 text-[10px] font-bold text-white">12 ảnh</span>
            </div>
            <div className="p-5 lg:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2"><span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">WT-2026-0184</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">CÒN HÀNG</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">SERVICE ĐANG MỞ</span></div>
                  <h1 className="mt-4 text-3xl font-black tracking-tight">Rolex Datejust 31</h1>
                  <p className="mt-2 text-sm text-slate-500">Rolex · Ref. 278273 · Nữ · Automatic</p>
                </div>
                <button className={`${button} border-slate-200 bg-white text-slate-700`}><MoreHorizontal className="h-4 w-4" /> Thêm</button>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
                {[["Giá bán", "285.000.000 ₫"], ["Giá vốn", "231.500.000 ₫"], ["Vendor", "Luxury Hub"], ["Cập nhật", "Hôm nay, 10:42"]].map(([label, value]) => <div key={label}><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</div><div className="mt-1 text-xs font-bold text-slate-800">{value}</div></div>)}
              </div>
            </div>
          </div>
        </header>

        <nav className="sticky top-0 z-30 mt-4 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg shadow-slate-200/40 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <button className={`${button} border-slate-950 bg-slate-950 text-white`}><Camera className="h-4 w-4" /> Xử lý Media</button>
            <button className={`${button} border-blue-200 bg-blue-50 text-blue-700`}><Stethoscope className="h-4 w-4" /> Tạo Service</button>
            <button className={`${button} border-emerald-200 bg-emerald-50 text-emerald-700`}><ShoppingBag className="h-4 w-4" /> Tạo Order</button>
            <button className={`${button} border-orange-200 bg-orange-50 text-orange-700`}><PackagePlus className="h-4 w-4" /> Buy Back</button>
            <span className="min-w-3 flex-1" />
            <button className={`${button} border-violet-600 bg-violet-600 text-white`}><Save className="h-4 w-4" /> Lưu thay đổi</button>
          </div>
        </nav>

        <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Tổng quan bán hàng</h2><p className="mt-1 text-xs text-slate-500">Thông tin chỉnh sửa trực tiếp, không chứa nút điều hướng nghiệp vụ.</p></div><Pencil className="h-4 w-4 text-slate-400" /></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="text-[10px] font-bold text-slate-400">GIÁ BÁN</div><div className="mt-2 text-xl font-black">285 triệu</div></div><div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><div className="text-[10px] font-bold text-emerald-600">LỢI NHUẬN DỰ KIẾN</div><div className="mt-2 text-xl font-black text-emerald-700">53,5 triệu</div></div><div className="rounded-xl border border-violet-100 bg-violet-50 p-4"><div className="text-[10px] font-bold text-violet-600">BIÊN LỢI NHUẬN</div><div className="mt-2 text-xl font-black text-violet-700">18,8%</div></div></div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Nội dung & hình ảnh</h2><p className="mt-1 text-xs text-slate-500">Chỉ hiển thị readiness; Media được xử lý duy nhất tại action bar.</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">CẦN HOÀN THIỆN</span></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"><FileText className="h-5 w-5 text-blue-600" /><div><div className="text-sm font-bold">Content bán hàng</div><div className="text-xs text-slate-500">Đã duyệt · cập nhật hôm qua</div></div><CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" /></div><div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4"><Camera className="h-5 w-5 text-amber-600" /><div><div className="text-sm font-bold">Gallery & Cover</div><div className="text-xs text-slate-500">2 ảnh đang chờ duyệt</div></div></div></div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Thông số kỹ thuật</h2><p className="mt-1 text-xs text-slate-500">Thông tin sản phẩm phục vụ bán hàng và kỹ thuật.</p></div><button className="text-xs font-bold text-violet-700">Chỉnh sửa</button></div>
              <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {[["Reference", "278273"], ["Kích thước", "31 mm"], ["Chất liệu vỏ", "Oystersteel & Yellow Gold"], ["Mặt số", "Champagne Diamond"], ["Bộ máy", "Calibre 2236"], ["Trữ cót", "55 giờ"], ["Chống nước", "100 m"], ["Dây", "Jubilee"], ["Năm", "2022"]].map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-3"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1.5 text-sm font-semibold text-slate-800">{value}</div></div>)}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Nội dung bán hàng</h2><p className="mt-1 text-xs text-slate-500">Bản nội dung đang dùng cho storefront và tư vấn.</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">APPROVED</span></div>
              <h3 className="mt-5 text-xl font-black">Rolex Datejust 31 Champagne Diamond</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Thiết kế thanh lịch dành cho cổ tay nữ, kết hợp thép Oystersteel cùng vàng vàng 18K. Mặt số champagne đính kim cương và dây Jubilee tạo nên tổng thể sang trọng nhưng vẫn dễ sử dụng hằng ngày.</p>
              <div className="mt-4 flex flex-wrap gap-2">{["Full set 2022", "Tình trạng đẹp", "Máy automatic", "Bảo hành cửa hàng"].map((item) => <span key={item} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">{item}</span>)}</div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Gallery</h2><p className="mt-1 text-xs text-slate-500">Xem nhanh asset và trạng thái; xử lý ảnh vẫn mở từ action bar.</p></div><span className="text-xs font-bold text-slate-500">12 ảnh</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {["Cover", "Góc nghiêng", "Mặt số", "Khóa dây"].map((label, index) => <div key={label}><div className={`grid aspect-square place-items-center rounded-xl border ${index === 3 ? "border-amber-200 bg-amber-50 text-amber-400" : "border-slate-200 bg-slate-100 text-slate-300"}`}><Camera className="h-7 w-7" /></div><div className="mt-2 flex items-center justify-between gap-2 text-[10px]"><span className="font-bold text-slate-600">{label}</span><span className={index === 3 ? "text-amber-700" : "text-emerald-700"}>{index === 3 ? "CHỜ DUYỆT" : "READY"}</span></div></div>)}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Dòng thời gian</h2><p className="mt-1 text-xs text-slate-500">Các thay đổi quan trọng của Watch.</p></div><button className="text-xs font-bold text-violet-700">Xem tất cả</button></div>
              <div className="mt-5 space-y-4">{[["Hôm nay, 10:42", "Cập nhật giá bán", "285.000.000 ₫ · bởi Minh"], ["Hôm qua, 16:20", "Content được duyệt", "Sẵn sàng dùng trên storefront"], ["18/08/2026", "Tạo Service Request", "SR-260820-014 · đánh giá kỹ thuật"], ["15/07/2026", "Phiếu nhập được POST", "PN-260715-021 · Luxury Hub"]].map(([date, title, meta], index) => <div key={date} className="grid grid-cols-[92px_14px_minmax(0,1fr)] gap-3"><div className="pt-0.5 text-[10px] font-semibold text-slate-400">{date}</div><div className="relative"><span className={`absolute top-1 h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-violet-600" : "bg-slate-300"}`} /><span className="absolute left-[4px] top-4 h-[calc(100%+8px)] w-px bg-slate-200 last:hidden" /></div><div><div className="text-sm font-bold text-slate-800">{title}</div><div className="mt-1 text-xs text-slate-500">{meta}</div></div></div>)}</div>
            </section>

          </div>

          <aside className="space-y-4 xl:sticky xl:top-[76px]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4"><h2 className="font-bold">Liên kết nghiệp vụ</h2><p className="mt-1 text-xs text-slate-500">Mở thẳng đúng hồ sơ liên quan.</p></div>
              <div className="space-y-2">
                <LinkRow icon={Wrench} title="Service SR-260820-014" meta="Đánh giá kỹ thuật · Nguyễn Minh" status="IN PROGRESS" tone="bg-blue-50 text-blue-700" />
                <LinkRow icon={ShoppingBag} title="Order ORD-260801-008" meta="Nguyễn Anh · 285.000.000 ₫" status="COMPLETED" tone="bg-emerald-50 text-emerald-700" />
                <LinkRow icon={ReceiptText} title="Phiếu nhập PN-260715-021" meta="Luxury Hub · Purchase" status="POSTED" tone="bg-violet-50 text-violet-700" />
              </div>
              <button className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Xem toàn bộ lịch sử liên kết</button>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Lịch sử Service</h2><p className="mt-1 text-xs text-slate-500">3 lần xử lý gần nhất</p></div><button className="text-[10px] font-bold text-violet-700">Xem tất cả</button></div>
              <div className="mt-4 space-y-4">{[["SR-260820-014", "Kiểm tra sai số & độ kín", "IN PROGRESS", "bg-blue-500"], ["SR-260112-006", "Bảo dưỡng bộ máy", "COMPLETED", "bg-emerald-500"], ["SR-250608-019", "Đánh bóng vỏ và dây", "COMPLETED", "bg-emerald-500"]].map(([ref, content, status, dot], index) => <button key={ref} className="group grid w-full grid-cols-[12px_minmax(0,1fr)_18px] gap-3 text-left"><span className="relative mt-1"><span className={`block h-2.5 w-2.5 rounded-full ${dot}`} />{index < 2 ? <span className="absolute left-[4px] top-3 h-9 w-px bg-slate-200" /> : null}</span><span><b className="block text-xs text-slate-800">{content}</b><span className="mt-1 block font-mono text-[9px] font-bold text-violet-700">{ref} · {status}</span></span><ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-violet-600" /></button>)}</div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Lịch sử bán hàng</h2><p className="mt-1 text-xs text-slate-500">Giao dịch theo Watch</p></div><button className="text-[10px] font-bold text-violet-700">Xem tất cả</button></div>
              <div className="mt-4 space-y-2">{[{ ref: "ORD-260801-008", label: "Bán hàng", party: "Nguyễn Anh", amount: "285 triệu", tone: "bg-emerald-50 text-emerald-700", icon: ShoppingBag }, { ref: "PN-260715-021", label: "Nhập hàng", party: "Luxury Hub", amount: "231,5 triệu", tone: "bg-violet-50 text-violet-700", icon: ReceiptText }, { ref: "ORD-250214-031", label: "Giữ hàng", party: "Trần Thảo", amount: "270 triệu", tone: "bg-slate-100 text-slate-600", icon: ShoppingBag }].map((item) => <button key={item.ref} className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 p-2.5 text-left hover:border-violet-200"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.tone}`}><item.icon className="h-3.5 w-3.5" /></span><span className="min-w-0 flex-1"><b className="block truncate text-xs text-slate-800">{item.label} · {item.party}</b><span className="mt-0.5 block truncate font-mono text-[9px] text-slate-400">{item.ref}</span></span><b className="text-[10px] text-slate-600">{item.amount}</b></button>)}</div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-bold">Tình trạng vận hành</h2><div className="mt-4 space-y-3">{[["Kho", "In stock", "text-emerald-700 bg-emerald-50"], ["Bán hàng", "Ready", "text-blue-700 bg-blue-50"], ["Media", "2 ảnh chờ duyệt", "text-amber-700 bg-amber-50"], ["Storefront", "Đang hiển thị", "text-violet-700 bg-violet-50"]].map(([label, value, tone]) => <div key={label} className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-slate-500">{label}</span><span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${tone}`}>{value}</span></div>)}</div></section>
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="text-xs font-bold text-amber-800">Cần xử lý tiếp</div><div className="mt-2 text-sm font-semibold text-slate-900">Service đang chờ kết luận kỹ thuật</div><button className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-amber-800">Mở Service Request <ArrowUpRight className="h-4 w-4" /></button></section>
          </aside>
        </div>
      </div>
    </main>
  );
}
