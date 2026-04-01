// app/(admin)/admin/acquisitions/new/page.tsx

import { getVendorList } from "../../vendors/_server/vendor.service";
import NewAcqForm from "../_client/NewAcqForm";

export default async function AcquisitionNewPage() {
    const vendors = await getVendorList();

    return (
        <div className="w-full px-6 max-w-[1400px] px-4 pt-6 lg:px-6">
            <NewAcqForm vendors={vendors} />
        </div>
    );
}
