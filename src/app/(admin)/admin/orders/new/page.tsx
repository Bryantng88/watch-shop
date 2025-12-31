// app/(admin)/admin/orders/new/page.tsx
import NewOrderForm from "../_client/NewOrderForm";
import { getVendorList } from "../../vendors/_server/vendor.service";
import { getCustomerList } from "../../customers/_server/customer.service";
import { getServiceCatalogList } from "../../services/_server/service_request.service";

export default async function NewOrderPage() {

    // 🟦 Load vendor + customer để đổ dropdown
    //const vendors = await getVendorList();
    const customersRaw = await getCustomerList();
    const services = await getServiceCatalogList();

    const customers = customersRaw.map(c => ({
        id: c.id,
        name: c.name,
        shipPhone: c.phone ?? "",
    }));

    return (
        <div className="p-6">
            <NewOrderForm
                customers={customers}
                services={services}
            />
        </div>
    );
}
