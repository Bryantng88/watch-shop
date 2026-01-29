// app/(admin)/admin/orders/new/page.tsx
import OrderFormClient from "../_client/OrderForm";
import { getVendorList } from "../../vendors/_server/vendor.service";
import { getCustomerList } from "../../customers/_server/customer.service";
import { getServiceCatalogOptions } from "../../services/_server/service_request.service";

export default async function NewOrderPage() {

    // 🟦 Load vendor + customer để đổ dropdown
    //const vendors = await getVendorList();
    const customersRaw = await getCustomerList();
    const services = await getServiceCatalogOptions();

    const customers = customersRaw.map(c => ({
        id: c.id,
        name: c.name,
        shipPhone: c.phone ?? "",
    }));

    return (
        <div className="p-6">
            <OrderFormClient
                //customers={customers}
                services={services}
                mode="create"
                backHref="/admin/orders"
                backLabel="← Danh sách"
            />
        </div>
    );
}
