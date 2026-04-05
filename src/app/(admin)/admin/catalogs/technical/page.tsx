
import { getTechnicalCatalogPageData } from "./_server/technical.catalog.service";
import TechnicalCatalogManagerClient from "./_client/TechincalCatalogManagerClient";

export default async function TechnicalCatalogPage() {
    const data = await getTechnicalCatalogPageData();

    return (
        <TechnicalCatalogManagerClient
            initialData={JSON.parse(JSON.stringify(data))}
        />
    );
}