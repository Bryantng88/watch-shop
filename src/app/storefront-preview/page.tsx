import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import HomeView from "@/domains/storefront/content/HomeView";
import ArticleView from "@/domains/storefront/content/ArticleView";
import { loadHomeView } from "@/domains/storefront/content/load-view";
import {
  getArticle,
  readHome,
  resolveImages,
  selectedWatches,
} from "@/domains/storefront/content/service";
import { StorefrontLocaleProvider } from "@/domains/storefront/ui/StorefrontLocale";
import { PublicFooterContent } from "@/domains/storefront/ui/PublicFooter";
import { getStorefrontUsdRate } from "@/domains/storefront/server/exchange-rate.service";
import "../(public)/storefront.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Xem trước Storefront", robots: { index: false, follow: false } };
export default async function StorefrontPreview({
  searchParams,
}: {
  searchParams: Promise<{ article?: string }>;
}) {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const id = (await searchParams).article;
  const article = id ? await getArticle(id, true) : null;
  if (id && !article) notFound();
  const [home, rate] = await Promise.all([readHome(true), getStorefrontUsdRate()]);
  const brand = (await resolveImages("home", "HOME", home, true)).logo;
  const view = article ? (
    <ArticleView
      content={article.content}
      images={await resolveImages(article.id, "ARTICLE", article.content, true)}
      watches={await selectedWatches(article.content.productIds)}
    />
  ) : (
    <HomeView {...await loadHomeView(true)} />
  );
  return (
    <StorefrontLocaleProvider
      value={{ locale: "vi", vndPerUsd: rate.vndPerUsd, rateSource: rate.source }}
    >
      <div className="storefront-surface bg-white text-black">
        <div className="border-b p-4 text-center text-xs">
          Bản nháp — chỉ hiển thị với người có quyền quản lý Storefront
        </div>
        <header className="vg-header">
          <Link className="vg-logo" href="/">
            {brand.url ? (
              <Image
                src={brand.url}
                alt={brand.alt || "Vintic"}
                width={180}
                height={64}
                unoptimized
                className="h-12 w-auto object-contain"
              />
            ) : (
              <>
                Vintic<span>VINTAGE & PRE-OWNED</span>
              </>
            )}
          </Link>
          <nav aria-label="Điều hướng xem trước">
            <Link href="/products">Đồng hồ</Link>
            <Link href="#collections">Bộ sưu tập</Link>
            <Link href="#about">Về Vintic</Link>
            <Link href="/stories">Chuyện đồng hồ</Link>
          </nav>
        </header>
        {view}
        <PublicFooterContent general={home.general} />
      </div>
    </StorefrontLocaleProvider>
  );
}
