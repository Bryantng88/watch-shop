import Link from "next/link";
import { EditorialPhoto, Paragraphs, type DisplayImage } from "./HomeView";
import type { ArticleContent } from "./contract";
import type { PublicWatchCard } from "../contracts";
import PublicWatchCardView from "../ui/PublicWatchCard";
export default function ArticleView({
  content,
  images,
  watches,
}: {
  content: ArticleContent;
  images: Record<string, DisplayImage>;
  watches: PublicWatchCard[];
}) {
  return (
    <article className="vintic-gallery vg-article">
      <Link className="vg-link" href="/stories">
        ← Chuyện đồng hồ
      </Link>
      <header>
        <p className="vg-kicker">Vintic Journal</p>
        <h1>{content.title}</h1>
        <p>{content.excerpt}</p>
      </header>
      <div className="vg-article-cover">
        <EditorialPhoto image={images.cover} eager />
      </div>
      <div className="vg-prose">
        <Paragraphs text={content.body} />
      </div>
      {content.images.map((_, i) =>
        images[`image-${i}`]?.url ? (
          <figure className="vg-article-figure" key={i}>
            <EditorialPhoto image={images[`image-${i}`]} />
            {images[`image-${i}`].alt ? <figcaption>{images[`image-${i}`].alt}</figcaption> : null}
          </figure>
        ) : null,
      )}
      {watches.length ? (
        <section>
          <h2>Đồng hồ trong câu chuyện</h2>
          <div className="vg-products">
            {watches.map((watch) => (
              <PublicWatchCardView key={watch.productId} watch={watch} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
