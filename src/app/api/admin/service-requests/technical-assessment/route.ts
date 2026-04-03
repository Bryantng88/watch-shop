import { NextRequest, NextResponse } from "next/server";
import { createTechnicalAssessmentWithSoftApprove } from "@/server/services/technical-assessment/createTechnicalAssessmentWithSoftApprove";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body?.serviceRequestId) {
            return NextResponse.json(
                { error: "Thiếu serviceRequestId" },
                { status: 400 }
            );
        }

        const result = await createTechnicalAssessmentWithSoftApprove(body);

        return NextResponse.json({
            ok: true,
            data: result,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Có lỗi khi lưu đánh giá kỹ thuật",
            },
            { status: 500 }
        );
    }
}