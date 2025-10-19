import { listProducts } from "@/features/catalog/server/product.repo";
import { ProductList } from "@/features/catalog/components/gallery/product-list";
import FilterSidebar from "@/features/catalog/components/filter/product-filter";
import { parseFilters } from "@/features/catalog/types";
import { listBrands } from "@/features/catalog/server/brands.repo";
import { DEFAULT_PRICE_BOUNDS } from "@/constants/constants";
import { listComplications } from "@/features/catalog/server/complications.repo";
import { listSize } from "@/features/catalog/server/case-size.repo";


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
  const complicationOptions = await listComplications();
  const sizeOptions = await listSize();
  const filters = parseFilters(urlParams);
  const page = filters.page ?? 1;
  const { items, total, pageSize } = await listProducts(filters);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]  gap-8 items-start">
        <aside className="hidden md:block">
          <FilterSidebar
            complications={complicationOptions}
            brands={brandOptions}
            priceBounds={DEFAULT_PRICE_BOUNDS}
            sizes={sizeOptions}
          />
        </aside>

        <section className="min-w-0">
          <div className="py-4 mb-3 flex items-center justify-between md:pl-4">
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
