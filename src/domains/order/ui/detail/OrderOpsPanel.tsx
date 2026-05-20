"use client";

import { CheckCircle2, Send, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/domains/shared/ui/form/fields";
import { SectionCard, type OrderDetailData } from "./shared";

type ActionName = "post" | "verify" | "cancel";

export default function OrderOpsPanel({
  data,
  busyAction,
  onAction,
}: {
  data: OrderDetailData;
  busyAction: string | null;
  onAction: (action: ActionName) => void;
}) {
  const canPost = data.status === "DRAFT" || data.status === "RESERVED";
  const canVerify = data.source === "WEB" && data.verificationStatus === "PENDING";
  const canCancel = data.status !== "CANCELLED" && data.status !== "COMPLETED";
  const busy = busyAction != null;

  return (
    <SectionCard icon={<Send className="h-5 w-5" />} title="Thao tác" subtitle="Action vận hành order">
      <div className="space-y-3">
        <Button type="button" className="w-full justify-center" disabled={!canPost || busy} onClick={() => onAction("post")}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {busyAction === "post" ? "Đang duyệt..." : "Duyệt / post đơn"}
        </Button>

        <Button type="button" variant="outline" className="w-full justify-center" disabled={!canVerify || busy} onClick={() => onAction("verify")}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          {busyAction === "verify" ? "Đang xác minh..." : "Xác minh đơn web"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-center border-rose-200 text-rose-600 hover:bg-rose-50"
          disabled={!canCancel || busy}
          onClick={() => onAction("cancel")}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {busyAction === "cancel" ? "Đang hủy..." : "Hủy đơn"}
        </Button>
      </div>
    </SectionCard>
  );
}
