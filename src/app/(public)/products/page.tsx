
import { products } from "../../../data/products";
import { ProductList } from "@/features/catalog/components/product-list";
import FilterContent from "@/features/catalog/components/product-filter";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page = Number(searchParams.page ?? 1);
  const sort = String(searchParams.sort ?? "default");
  const brand = searchParams.brand?.toString(); // ví dụ filter

  const { items, total, pageSize } = await products({ page, sort, brand });

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 text-black">
      {/* Banner/Promo */}
      {/* <PromoBanner2 /> */}

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar (ẩn trên mobile nếu muốn) */}
        <aside className="hidden md:block">
          <FilterContent />
        </aside>

        <section>
          {/* Sort bar */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, total)} of {total} results
            </span>
            {/* component Select có thể là shared UI */}
            {/* <SortSelect defaultValue={sort} /> */}
          </div>

          {/* Grid sản phẩm */}
          <ProductList products={items} />

          {/* Pagination (server-rendered) */}
          {/* <Pagination total={total} page={page} pageSize={pageSize} /> */}
        </section>
      </div>

      {/* Off-canvas filter cho mobile (client) → đặt trong FilterContent hoặc một Drawer riêng */}
    </main>
  );
}