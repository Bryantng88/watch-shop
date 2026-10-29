import { notFound } from "next/navigation";
import { getArticle, resolveImages, selectedWatches } from "@/domains/storefront/content/service";
import ArticleView from "@/domains/storefront/content/ArticleView";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getArticle((await params).slug);
  return { title: a?.content.title || "Chuyện đồng hồ", description: a?.content.excerpt };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const [images, watches] = await Promise.all([
    resolveImages(article.id, "ARTICLE", article.content),
    selectedWatches(article.content.productIds),
  ]);
  return <ArticleView content={article.content} images={images} watches={watches} />;
}
