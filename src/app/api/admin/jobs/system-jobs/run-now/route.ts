import { NextResponse } from "next/server";
import { runSystemJobs } from "@/domains/system/server/jobs/system-job-runner.service";
import { pushSystemJobNotification } from "@/domains/system/server/jobs/system-job-notification.service";
import { getCurrentUser } from "@/server/auth/getCurrentUser";

export async function POST() {
    const user = await getCurrentUser();

    try {
        const summary = await runSystemJobs({
            triggerSource: "admin_manual",
        });

        if (user?.id) {
            await pushSystemJobNotification({
                userId: user.id,
                title: "Run All Jobs",
                message: "Hệ thống đã chạy toàn bộ jobs thành công",
                priority: "NORMAL",
                metadata: {
                    action: "run_all_jobs",
                },
            });
        }

        return NextResponse.json({
            success: true,
            summary,
        });
    } catch (error: any) {
        if (user?.id) {
            await pushSystemJobNotification({
                userId: user.id,
                title: "Run All Jobs FAILED",
                message: error?.message || "Run system jobs failed",
                priority: "URGENT",
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Run system jobs failed",
            },
            { status: 500 }
        );
    }
}