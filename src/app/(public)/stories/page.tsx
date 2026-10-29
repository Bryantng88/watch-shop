import Link from "next/link";
import { listArticles, resolveImages } from "@/domains/storefront/content/service";
import { EditorialPhoto } from "@/domains/storefront/content/HomeView";
export const dynamic = "force-dynamic";
export const metadata = { title: "Chuyện đồng hồ" };
export default async function StoriesPage() {
  const articles = await listArticles();
  const items = await Promise.all(
    articles.map(async (a) => ({
      ...a,
      image: (await resolveImages(a.id, "ARTICLE", a.content)).cover,
    })),
  );
  return (
    <div className="vintic-gallery vg-stories">
      <p className="vg-kicker">Vintic Journal</p>
      <h1>Chuyện đồng hồ</h1>
      {!items.length ? (
        <p>
          Những câu chuyện mới đang được chuẩn bị.{" "}
          <Link className="vg-link" href="/products">
            Khám phá đồng hồ ↗
          </Link>
        </p>
      ) : (
        <div className="vg-collections">
          {items.map((a) => (
            <Link className="vg-collection" key={a.id} href={`/stories/${a.content.slug}`}>
              <div className="vg-collection-image">
                <EditorialPhoto image={a.image} />
              </div>
              <h2>{a.content.title}</h2>
              <p>{a.content.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
