import { NextResponse } from "next/server";
import * as technicalService from "@/app/(admin)/admin/services/_server/technical_assessment.serivce"

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const panel = await technicalService.getTechnicalAssessmentPanel(id);
        return NextResponse.json(panel);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Load technical assessment failed" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const saved = await technicalService.saveTechnicalAssessment({
            serviceRequestId: id,
            movementKind: body.movementKind ?? "UNKNOWN",
            runningOk: body.runningOk ?? null,
            batteryWeak: body.batteryWeak ?? null,
            batteryIssueBattery: body.batteryIssueBattery ?? false,
            batteryIssueIC: body.batteryIssueIC ?? false,
            batteryIssueCoil: body.batteryIssueCoil ?? false,
            preRate: body.preRate ?? null,
            preAmplitude: body.preAmplitude ?? null,
            preBeatError: body.preBeatError ?? null,
            postRate: body.postRate ?? null,
            postAmplitude: body.postAmplitude ?? null,
            postBeatError: body.postBeatError ?? null,
            diagnosis: body.diagnosis ?? null,
            conclusion: body.conclusion ?? null,
            imageFileKey: body.imageFileKey ?? null,
            issues: Array.isArray(body.issues) ? body.issues : [],
        });

        return NextResponse.json({ ok: true, item: saved });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Save technical assessment failed" },
            { status: 500 }
        );
    }
}