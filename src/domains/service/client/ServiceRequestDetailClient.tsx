"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ServiceIssueManageModal, type IssueBoardCatalogs, type IssueItem } from "@/domains/service/ui/issue-board";
import {
  ServiceCompletedSummaryCard,
  ServiceDetailHero,
  ServiceIssuesSummaryCard,
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
  catalogs?: IssueBoardCatalogs;
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
      <ServiceIssuesSummaryCard detail={detail} />
      <ServiceCompletedSummaryCard detail={detail} />
      <ServiceReadonlyInfoCard detail={detail} />

      <ServiceIssueManageModal
        open={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        currentServiceRequestId={sr.id}
        serviceRefNo={sr.refNo}
        items={issueBoard.items}
        counts={issueBoard.counts}
        catalogs={issueBoard.catalogs}
      />
    </div>
  );
}