import { getVendorList } from "@/domains/vendor/server/vendor.service";
import AcquisitionFormClient from "@/domains/acquisition/client/AcquisitionFormClient";

export default async function AcquisitionNewPage() {
    const vendors = await getVendorList();

    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
            <AcquisitionFormClient vendors={vendors} />
        </div>
    );
}