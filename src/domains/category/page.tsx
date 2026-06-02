
import { getTechnicalCatalogPageData } from "./server/technical.catalog.service";
import TechnicalCatalogManagerClient from "./client/TechincalCatalogManagerClient";

export default async function TechnicalCatalogPage() {
    const data = await getTechnicalCatalogPageData();

    return (
        <TechnicalCatalogManagerClient
            initialData={JSON.parse(JSON.stringify(data))}
        />
    );
}