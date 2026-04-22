import { NextResponse } from "next/server";
import { runAcquisitionSpecProcessorNow } from "@/domains/system/server/jobs/acquisition-spec.processor";
import { pushSystemJobNotification } from "@/domains/system/server/jobs/system-job-notification.service";
import { getCurrentUser } from "@/server/auth/getCurrentUser";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));

    const limit = Math.max(1, Math.min(Number(body?.limit ?? 3), 10));
    const includeFailed = Boolean(body?.includeFailed ?? false);

    const user = await getCurrentUser(); // ✅ dùng cái này

    try {
        const result = await runAcquisitionSpecProcessorNow({
            triggerSource: "admin_manual",
            limit,
            includeFailed,
        });

        const processed = Number(result?.result?.processed ?? 0);
        const failed = Number(result?.result?.failed ?? 0);

        // 🔥 push notification
        if (user?.id) {
            await pushSystemJobNotification({
                userId: user.id,
                title: includeFailed
                    ? "Retry Acquisition Spec"
                    : "Run Acquisition Spec",
                message:
                    failed > 0
                        ? `Đã xử lý ${processed} job, có ${failed} lỗi`
                        : `Đã xử lý ${processed} job thành công`,
                priority: failed > 0 ? "HIGH" : "NORMAL",
                metadata: {
                    processor: "acquisition_spec",
                    processed,
                    failed,
                    includeFailed,
                },
            });
        }

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error: any) {
        if (user?.id) {
            await pushSystemJobNotification({
                userId: user.id,
                title: "Acquisition Spec FAILED",
                message: error?.message || "Run acquisition spec failed",
                priority: "URGENT",
                metadata: {
                    processor: "acquisition_spec",
                },
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Run acquisition spec failed",
            },
            { status: 500 }
        );
    }
}