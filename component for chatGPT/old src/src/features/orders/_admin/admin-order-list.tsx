import * as React from "react";
import { useMemo, useState } from "react";
import { Plus, Search, Calendar, Filter, Ellipsis, CheckCircle2, XCircle, CircleDashed, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// -------------------------------------------------------------
// Types & Mock Data
// -------------------------------------------------------------

type OrderStatus = "DRAFT" | "PROCESSING" | "POSTED" | "CANCELLED";

interface Order {
  id: string;
  code: string;
  date: string; // ISO date
  vendor: string; // or customer
  items: number;
  amount: number; // VND
  status: OrderStatus;
}

const money = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const MOCK: Order[] = [
  { id: "1", code: "PO-240001", date: "2025-03-10", vendor: "Sapphire Co.", items: 3, amount: 12500000, status: "DRAFT" },
  { id: "2", code: "PO-240002", date: "2025-03-10", vendor: "Omega VN", items: 1, amount: 54000000, status: "POSTED" },
  { id: "3", code: "PO-240003", date: "2025-03-09", vendor: "Seiko Hoàn Kiếm", items: 5, amount: 23200000, status: "PROCESSING" },
  { id: "4", code: "PO-240004", date: "2025-03-08", vendor: "Citizen Dist.", items: 2, amount: 8200000, status: "CANCELLED" },
  { id: "5", code: "PO-240005", date: "2025-03-08", vendor: "Longines VN", items: 2, amount: 35200000, status: "POSTED" },
];

const statusMeta: Record<OrderStatus, { label: string; tone: string; icon: React.ReactNode }> = {
  DRAFT: { label: "Draft", tone: "bg-slate-100 text-slate-700", icon: <CircleDashed className="h-3.5 w-3.5" /> },
  PROCESSING: { label: "Processing", tone: "bg-amber-100 text-amber-700", icon: <BadgeDollarSign className="h-3.5 w-3.5" /> },
  POSTED: { label: "Posted", tone: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  CANCELLED: { label: "Cancelled", tone: "bg-rose-100 text-rose-700", icon: <XCircle className="h-3.5 w-3.5" /> },
};

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------

export default function OrdersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return MOCK.filter((o) =>
      (!q || o.code.toLowerCase().includes(q.toLowerCase()) || o.vendor.toLowerCase().includes(q.toLowerCase())) &&
      (!status || o.status === status) &&
      (!vendor || o.vendor === vendor) &&
      (!from || new Date(o.date) >= new Date(from)) &&
      (!to || new Date(o.date) <= new Date(to))
    );
  }, [q, status, vendor, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const _today = filtered.filter((o) => o.date === today);
    const sum = (arr: Order[]) => arr.reduce((s, i) => s + i.amount, 0);
    return {
      todayCount: _today.length,
      draft: filtered.filter((o) => o.status === "DRAFT").length,
      posted: filtered.filter((o) => o.status === "POSTED").length,
      cancelled: filtered.filter((o) => o.status === "CANCELLED").length,
      totalAmount: sum(filtered),
    };
  }, [filtered]);

  const resetFilters = () => {
    setQ(""); setStatus(""); setVendor(""); setFrom(""); setTo(""); setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quản lý phiếu nhập</h1>
          <p className="text-sm text-muted-foreground">Theo dõi, lọc và duyệt các phiếu nhập (Acquisitions)</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Phiếu nhập mới</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Stat title="Hôm nay" value={stats.todayCount.toString()} icon={<Calendar className="h-4 w-4" />} />
        <Stat title="Draft" value={stats.draft.toString()} tone="bg-slate-50" />
        <Stat title="Posted" value={stats.posted.toString()} tone="bg-emerald-50" />
        <Stat title="Cancelled" value={stats.cancelled.toString()} tone="bg-rose-50" />
        <Stat title="Tổng tiền" value={money(stats.totalAmount)} tone="bg-amber-50" />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4" />Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm theo mã / vendor" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </div>
          <div className="md:col-span-2">
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="POSTED">Posted</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select value={vendor} onValueChange={(v) => { setVendor(v); setPage(1); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Vendor" /></SelectTrigger>
              <SelectContent>
                {[...new Set(MOCK.map(m => m.vendor))].map(v => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} />
          </div>
          <div className="md:col-span-2">
            <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} />
          </div>
          <div className="md:col-span-12 flex justify-end gap-2">
            <Button variant="secondary" onClick={resetFilters}>Xóa lọc</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="rounded-2xl border bg-white">
        <div className="px-4 py-3 text-sm text-muted-foreground flex items-center justify-between">
          <span>{filtered.length} kết quả</span>
          <span>Trang {page}/{totalPages}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-slate-50">
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Số dòng</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((row) => (
                <tr key={row.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{row.code}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.vendor}</td>
                  <td className="px-4 py-3">{row.items}</td>
                  <td className="px-4 py-3">{money(row.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${statusMeta[row.status].tone}`}>
                      {statusMeta[row.status].icon}
                      {statusMeta[row.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><Ellipsis className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelected(row)} className="gap-2"><Eye className="h-4 w-4" />Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Pencil className="h-4 w-4" />Chỉnh sửa</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-rose-600"><Trash2 className="h-4 w-4" />Xóa</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {!pageData.length && (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>Không có dữ liệu.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-muted-foreground">Hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} trên {filtered.length}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu {selected?.code}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-muted-foreground">Ngày</div><div className="font-medium">{selected.date}</div></div>
                <div><div className="text-muted-foreground">Vendor</div><div className="font-medium">{selected.vendor}</div></div>
                <div><div className="text-muted-foreground">Số dòng</div><div className="font-medium">{selected.items}</div></div>
                <div><div className="text-muted-foreground">Tổng tiền</div><div className="font-medium">{money(selected.amount)}</div></div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Trạng thái</div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs border">
                    {statusMeta[selected.status].icon}
                    <span>{statusMeta[selected.status].label}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-sm font-medium mb-2">Ghi chú</div>
                <p className="text-sm text-muted-foreground">(Mô phỏng) Hàng nhập đợt sáng. Sẽ đối soát chứng từ và post phiếu sau khi kiểm đếm.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">In phiếu</Button>
                <Button>Post phiếu</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ title, value, icon, tone }: { title: string; value: string; icon?: React.ReactNode; tone?: string }) {
  return (
    <Card className={tone ? tone + " border-none" : undefined}>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground flex items-center gap-2">{icon}{title}</div>
        <div className="text-xl font-semibold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}
