// app/(admin)/admin/orders/new/page.tsx
import NewOrderForm from "../_client/NewOrderForm";
import { getVendorList } from "../../vendors/_server/vendor.service";
import { getCustomerList } from "../../customers/_server/customer.service";

export default async function NewOrderPage() {

    // 🟦 Load vendor + customer để đổ dropdown
    const vendors = await getVendorList();
    const customersRaw = await getCustomerList();

    const customers = customersRaw.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone ?? "",
    }));

    return (
        <div className="p-6">
            <NewOrderForm
                customers={customers}
            />
        </div>
    );
}
