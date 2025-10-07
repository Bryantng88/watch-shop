import { listProducts } from "@/features/catalog/server/queries";
import { ProductList } from "@/features/catalog/components/product-list";
import FilterContent from "@/features/catalog/components/product-filter";
const SORTS = ['default', 'low', 'high'] as const;
type Sort = (typeof SORTS)[number];

function parseSort(v: unknown): Sort {
  return (typeof v === 'string' && (SORTS as readonly string[]).includes(v))
    ? (v as Sort)
    : 'default';
}
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page = Number(searchParams.page ?? 1);
  const sort: Sort = parseSort(searchParams.sort);
  const brand = searchParams.brand?.toString(); // ví dụ filter

  const { items, total, pageSize } = await listProducts({ page, sort, brand });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* top breadcrumb / title (optional) */}
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Vintage Watches</h1>

      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-8">
        <aside className="hidden md:block">
          <FilterContent />
        </aside>

        <section className="min-w-0">
          {/* sort bar */}
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} results
            </p>
            <select
              defaultValue={sort}
              className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900/10"
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
