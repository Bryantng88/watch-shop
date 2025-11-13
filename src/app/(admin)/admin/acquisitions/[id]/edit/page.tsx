// app/(admin)/admin/acquisitions/new/page.tsx
import { getVendorList } from "../../../vendors/_server/vendor.service";
// app/(admin)/admin/acquisitions/[id]/edit/page.tsx
import EditAcqForm from "../../_client/EditAcqForm";

// app/(admin)/admin/acquisitions/[id]/edit/page.tsx

import * as service from "../../_server/acquisition.service"
import { ProductType } from "@prisma/client";

export default async function EditAcquisitionPage({ params }: { params: { id: string } }) {
    // 1. Lấy dữ liệu phiếu nhập và item
    const acquisitionData = await service.getAcquisitionDetail(params.id);
    // 2. Lấy danh sách vendors
    const vendors = await getVendorList();
    // 3. Lấy enum loại sản phẩm (tuỳ cách bạn tổ chức)
    const productTypes = ProductType; // ["WATCH", "BOX", "PARTS", ...]

    // 4. Tách items cho đúng dạng props
    const items = acquisitionData.acquisitionItem.map(item => ({
        id: item.id,
        title: item.product?.title,
        quantity: item.quantity,
        unitCost: item.unitCost,
        productType: item.product?.type, // hoặc item.type tuỳ DB bạn
    }));

    return (
        <div className="max-w-2xl mx-auto pt-6">
            <h1 className="font-semibold text-xl mb-5">Sửa phiếu nhập</h1>
            <EditAcqForm
                acquisition={acquisitionData}
                items={items}
                vendors={vendors}
            />
        </div>
    );
}
