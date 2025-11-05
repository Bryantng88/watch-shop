// app/(admin)/admin/acquisitions/new/page.tsx
import { getVendorList } from "../../vendors/_server/vendor.service";
import NewAcqForm from "../_client/NewAcqForm";

export default async function AcquisitionNewPage() {
    const vendors = await getVendorList();
    return (
        <div className="max-w-2xl mx-auto pt-6">
            <h1 className="font-semibold text-xl mb-5">Tạo phiếu nhập mới</h1>
            <NewAcqForm vendors={vendors} />
        </div>
    );
}
