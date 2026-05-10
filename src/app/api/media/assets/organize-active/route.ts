import { NextResponse } from "next/server";
import { organizeActiveMedia } from "@/domains/media/server";

export const dynamic = "force-dynamic";

export async function POST() {
    try {
        const result = await organizeActiveMedia();

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Không thể organize active.",
            },
            { status: 500 }
        );
    }
}