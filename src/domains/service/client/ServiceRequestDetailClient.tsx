"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ServiceIssueManageModal, type IssueItem } from "@/domains/service/ui/issue-board";
import {
  ServiceCompletedSummaryCard,
  ServiceDetailHero,
  ServiceOverviewCard,
  ServiceReadonlyInfoCard,
} from "@/domains/service/ui/detail/ServiceDetailShell";
import type { ServiceRequestDetailViewModel } from "@/domains/service/ui/detail/types";

type IssueBoardPayload = {
  items: IssueItem[];
  counts: {
    pendingConfirm: number;
    ready: number;
    inProgress: number;
    done: number;
    readyToCloseSrCount?: number;
  };
};

export default function ServiceRequestDetailClient({
  detail,
  issueBoard,
}: {
  detail: ServiceRequestDetailViewModel;
  issueBoard: IssueBoardPayload;
}) {
  const router = useRouter();
  const [issueModalOpen, setIssueModalOpen] = React.useState(false);
  const sr = detail.serviceRequest;

  return (
    <div className="space-y-6">
      <ServiceDetailHero
        detail={detail}
        onBack={() => router.push("/admin/services")}
        onEditSpec={sr.productId ? () => router.push(`/admin/products/${sr.productId}/spec`) : undefined}
        onOpenIssues={() => setIssueModalOpen(true)}
      />

      <ServiceOverviewCard detail={detail} />
      <ServiceCompletedSummaryCard detail={detail} />
      <ServiceReadonlyInfoCard detail={detail} />

      <ServiceIssueManageModal
        open={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        serviceRequestId={sr.id}
        serviceRefNo={sr.refNo}
        items={issueBoard.items}
        counts={issueBoard.counts}
      />
    </div>
  );
}
