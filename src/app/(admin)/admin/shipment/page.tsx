import { getAdminShipmentList } from "./_server/shipment.service";
import ShipmentsClient from "./_client/ListShipment";

type PageProps = {
    searchParams?: {
        page?: string;
        pageSize?: string;
    };
};

export default async function ShipmentListPage({ searchParams }: PageProps) {
    const page = Number(searchParams?.page ?? 1);
    const pageSize = Number(searchParams?.pageSize ?? 20);

    const data = await getAdminShipmentList({
        page,
        pageSize,
    });

    return (
        <ShipmentsClient
            data={data}
        />
    );
}
