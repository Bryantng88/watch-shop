import { notFound } from "next/navigation";
import WorkCaseDetailClient from "@/domains/work-case/client/WorkCaseDetailClient";
import { getWorkCaseDetailPageData } from "@/domains/work-case/server/work-case.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function AdminWorkCaseDetailPage(props: PageProps) {
    const { id } = await props.params;
    const auth = await requirePermission("TASK_VIEW");

    const data = await getWorkCaseDetailPageData(prisma, id, auth).catch((error) => {
        if (String(error?.message ?? "").includes("Không tìm thấy")) return null;
        throw error;
    });

    if (!data) notFound();

    return <WorkCaseDetailClient {...data} />;
}
