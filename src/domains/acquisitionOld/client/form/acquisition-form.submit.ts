import type { AcquisitionInlineSubmitPayload } from "./acquisition-form.types";

export async function submitInlineAcquisition(
    payload: AcquisitionInlineSubmitPayload
) {
    const res = await fetch("/api/admin/acquisitions/inline-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.error || "Lưu phiếu nhập thất bại");
    }

    return data;
}