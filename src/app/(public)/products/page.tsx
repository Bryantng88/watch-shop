import { listProducts } from "@/features/catalog/server/queries/products";
import { ProductList } from "@/features/catalog/components/product-list";
import FilterSidebar from "@/features/catalog/components/product-filter";
import { parseFilters } from "@/features/catalog/server/types";
import { listBrands } from "@/features/catalog/server/queries/brands";
import { DEFAULT_PRICE_BOUNDS } from "@/constants/constants";


type SearchParams = Record<string, string | string[] | undefined>;
export default async function ProductsPage(
  { searchParams,
  }: {
    searchParams: Promise<SearchParams>;
  })  // <-- nhận Promise
{
  const sp = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (Array.isArray(value)) urlParams.set(key, value.join(".")); // ví dụ: brand=omega.bulova
    else if (value) urlParams.set(key, value);
  }

  const brandOptions = await listBrands();
  const filters = parseFilters(urlParams);
  const page = filters.page ?? 1;
  const { items, total, pageSize } = await listProducts(filters);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="mb-6 text-xl font-semibold tracking-tight">
        Vintage Watches
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-8">
        <aside className="hidden md:block">
          <FilterSidebar
            brands={brandOptions}
            priceBounds={DEFAULT_PRICE_BOUNDS}
          />
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, total)} of {total} results
            </p>

            <select
              defaultValue={filters.sort}
              className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm"
            >
              <option value="default">Default sorting</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>

          <ProductList products={items} />
        </section>
      </div>
    </main>
  );
}
