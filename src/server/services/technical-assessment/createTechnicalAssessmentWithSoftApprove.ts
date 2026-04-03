// import { prisma } from "@/server/db";
import type { TechnicalAssessmentSubmitPayload } from "@/app/(admin)/admin/services/_client/TechnicalAssessmentModal";

/**
 * Luồng:
 * 1. Upsert technical assessment
 * 2. Replace movement lines
 * 3. Tạo maintenance log trực tiếp cho movement lines + crown nếu có
 * 4. Với proposal ngoại hình:
 *    - vẫn tạo approval request
 *    - auto set APPROVED
 *    - đồng thời tạo maintenance log
 */

export async function createTechnicalAssessmentWithSoftApprove(
    payload: TechnicalAssessmentSubmitPayload
) {
    // TODO: thay bằng prisma thật của bạn
    // const assessment = await prisma.technicalAssessment.upsert({...})

    const fakeAssessmentId = `ta_${Date.now()}`;

    // 1) Upsert technical assessment master
    const assessment = {
        id: fakeAssessmentId,
        serviceRequestId: payload.serviceRequestId,
        appearanceScore: payload.appearance.score,
        totalCost: payload.financialSummary.totalCost,
    };

    // 2) Replace movement lines
    const maintenanceLogs: unknown[] = [];
    const approvals: unknown[] = [];

    // 3) Movement lines -> maintenance log trực tiếp
    for (const line of payload.movement.lines) {
        if (!line.action) continue;

        const maintenanceLog = {
            serviceRequestId: payload.serviceRequestId,
            technicalAssessmentId: assessment.id,
            sourceType: "TECHNICAL_ASSESSMENT",
            category: "MOVEMENT",
            action: line.action,
            execution: line.execution ?? null,
            vendorId: line.vendorId ?? null,
            partId: line.partId ?? null,
            cost: line.cost ?? 0,
            note: line.note ?? null,
            status: "CREATED",
        };

        maintenanceLogs.push(maintenanceLog);

        // await prisma.maintenanceLog.create({ data: maintenanceLog })
    }

    // 4) Crown -> maintenance log trực tiếp
    if (payload.appearance.crown.status === "ISSUE" && payload.appearance.crown.action) {
        const crownMaintenanceLog = {
            serviceRequestId: payload.serviceRequestId,
            technicalAssessmentId: assessment.id,
            sourceType: "TECHNICAL_ASSESSMENT",
            category: "CROWN",
            action: payload.appearance.crown.action,
            execution: payload.appearance.crown.execution ?? null,
            vendorId: payload.appearance.crown.vendorId ?? null,
            partId: payload.appearance.crown.partId ?? null,
            cost: payload.appearance.crown.cost ?? 0,
            note: payload.appearance.crown.note ?? null,
            status: "CREATED",
        };

        maintenanceLogs.push(crownMaintenanceLog);

        // await prisma.maintenanceLog.create({ data: crownMaintenanceLog })
    }

    // 5) Proposal ngoại hình -> approval request + auto APPROVED + maintenance log
    const cosmeticProposals = [
        {
            part: "CASE",
            score: payload.appearance.case.score,
            data: payload.appearance.case.proposal,
        },
        {
            part: "GLASS",
            score: payload.appearance.glass.score,
            data: payload.appearance.glass.proposal,
        },
        {
            part: "DIAL",
            score: payload.appearance.dial.score,
            data: payload.appearance.dial.proposal,
        },
    ].filter((item) => item.data.enabled);

    for (const item of cosmeticProposals) {
        const approvalRequest = {
            serviceRequestId: payload.serviceRequestId,
            technicalAssessmentId: assessment.id,
            type: "TECHNICAL_APPEARANCE_PROPOSAL",
            sourceModule: "TECHNICAL_ASSESSMENT",
            title: `Đề xuất xử lý ${item.part}`,
            summary: `Đề xuất ${item.data.action ?? "-"} cho ${item.part}, chi phí dự kiến ${item.data.estimatedCost ?? 0}`,
            status: "APPROVED", // soft approve
            autoApproved: true,
            payloadJson: {
                part: item.part,
                currentScore: item.score,
                proposedAction: item.data.action ?? null,
                estimatedCost: item.data.estimatedCost ?? 0,
                execution: item.data.execution ?? null,
                vendorId: item.data.vendorId ?? null,
                note: item.data.note ?? null,
            },
        };

        approvals.push(approvalRequest);

        // const approval = await prisma.approvalRequest.create({ data: approvalRequest })
        const approval = { id: `apr_${Date.now()}_${item.part}` };

        const cosmeticMaintenanceLog = {
            serviceRequestId: payload.serviceRequestId,
            technicalAssessmentId: assessment.id,
            approvalRequestId: approval.id,
            sourceType: "TECHNICAL_APPEARANCE_PROPOSAL",
            category: item.part,
            action: item.data.action ?? null,
            execution: item.data.execution ?? null,
            vendorId: item.data.vendorId ?? null,
            partId: null,
            cost: item.data.estimatedCost ?? 0,
            note: item.data.note ?? null,
            status: "CREATED",
            autoApproved: true,
        };

        maintenanceLogs.push(cosmeticMaintenanceLog);

        // await prisma.maintenanceLog.create({ data: cosmeticMaintenanceLog })
    }

    return {
        assessment,
        approvals,
        maintenanceLogs,
    };
}