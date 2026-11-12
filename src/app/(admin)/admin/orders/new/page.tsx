import OrderFormClient from "@/domains/order/client/OrderFormClient";
import {
    getQuickOrderProductForOrderForm,
    getServiceCatalogOptions,
} from "@/domains/order/server";

type SearchParams = {
    [key: string]: string | string[] | undefined;
};

function firstValue(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

export default async function NewOrderPage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const sp = (await searchParams) ?? {};
    const mode = firstValue(sp.mode);
    const productId = firstValue(sp.productId);
    const returnTo = firstValue(sp.returnTo);

    const [services, quickProduct] = await Promise.all([
        getServiceCatalogOptions(),
        mode === "quick" && productId
            ? getQuickOrderProductForOrderForm(productId)
            : Promise.resolve(null),
    ]);
    console.log("quick productId", productId);
    console.log("quickProduct", quickProduct);
    return (
        <div className="min-w-0 bg-white">
            <OrderFormClient
                mode="create"
                initialData={null}
                services={services}
                quickProduct={quickProduct}
                backHref={returnTo || "/admin/orders"}
                backLabel="← Danh sách"
            />
        </div>
    );
}
