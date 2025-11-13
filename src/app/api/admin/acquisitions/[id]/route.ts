import * as service from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";
import { NextResponse, NextRequest } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    // ... validate, parse body
    return service.updateAcquisitionWithItems(id, body);
}
