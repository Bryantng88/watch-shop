import OrderFormClient from "../_client/OrderForm";
import { getServiceCatalogOptions } from "../../services/_server/service_request.service";

export default async function NewOrderPage() {
    const services = await getServiceCatalogOptions();

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 pt-6 lg:px-6">
            <OrderFormClient
                mode="create"
                initialData={null}
                services={services}
                backHref="/admin/orders"
                backLabel="← Danh sách"
            />
        </div>
    );
}