import Link from "next/link";
import type { CSSProperties } from "react";
import PublicWatchCardView from "../ui/PublicWatchCard";
import type { PublicWatchCard } from "../contracts";
import type { EditorialImage, HomeContent, ArticleContent } from "./contract";

export type DisplayImage = EditorialImage & { url: string };
export function EditorialPhoto({
  image,
  mobile,
  fallback,
  eager = false,
}: {
  image?: DisplayImage;
  mobile?: DisplayImage;
  fallback?: string;
  eager?: boolean;
}) {
  const url = image?.url || fallback;
  if (!url)
    return (
      <div className="vg-image-empty">
        Vintic<span>Vintage & pre-owned</span>
      </div>
    );
  return (
    <div
      className="vg-photo"
      style={
        {
          "--focus": `${image?.focalX ?? 50}% ${image?.focalY ?? 50}%`,
          "--mobile-focus": `${mobile?.focalX ?? image?.focalX ?? 50}% ${mobile?.focalY ?? image?.focalY ?? 50}%`,
        } as CSSProperties
      }
    >
      {/* Editorial media is served by a publication-gated route; no optimizer cache for draft snapshots. */}
      <picture>
        {mobile?.url ? <source media="(max-width: 640px)" srcSet={mobile.url} /> : null}
        <img
          src={url}
          alt={image?.alt || "Đồng hồ tuyển chọn tại Vintic"}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
        />
      </picture>
    </div>
  );
}
export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </>
  );
}
export type HomeViewData = {
  content: HomeContent;
  images: Record<string, DisplayImage>;
  watches: PublicWatchCard[];
  journal: { id: string; content: ArticleContent; image?: DisplayImage } | null;
};
export default function HomeView({ content: c, images, watches, journal }: HomeViewData) {
  const blocks = {
    hero: (
      <section className="vg-hero" aria-label="Giới thiệu Vintic">
        <div className="vg-hero-copy">
          <p className="vg-kicker">Vintage & pre-owned</p>
          <h1>{c.hero.title}</h1>
          <p className="vg-description">{c.hero.description}</p>
          <Link className="vg-button" href={c.hero.href}>
            {c.hero.button}
            <span aria-hidden>↗</span>
          </Link>
        </div>
        <Link className="vg-hero-image" href={c.hero.href}>
          <EditorialPhoto
            image={images.hero}
            mobile={images.mobile}
            fallback={watches[0]?.image.url}
            eager
          />
          {c.hero.caption ? (
            <div className="vg-caption">
              <span>Vintic Selects</span>
              {c.hero.caption}
            </div>
          ) : null}
        </Link>
      </section>
    ),
    featured: watches.length ? (
      <section className="vg-section" id="selection">
        <div className="vg-section-head">
          <div>
            <p className="vg-kicker">Tuyển chọn</p>
            <h2>{c.featured.title}</h2>
          </div>
          <Link className="vg-link" href={c.featured.href}>
            Xem tất cả đồng hồ ↗
          </Link>
        </div>
        <div className="vg-products">
          {watches.map((watch) => (
            <PublicWatchCardView key={watch.productId} watch={watch} />
          ))}
        </div>
      </section>
    ) : null,
    about: (
      <section className="vg-about" id="about">
        <div className="vg-about-image">
          <EditorialPhoto image={images.about} />
        </div>
        <div className="vg-about-copy">
          <p className="vg-kicker">Về Vintic</p>
          <h2>{c.about.title}</h2>
          <Paragraphs text={c.about.body} />
        </div>
      </section>
    ),
    collections: c.collections.length ? (
      <section className="vg-section" id="collections">
        <div className="vg-section-head">
          <div>
            <p className="vg-kicker">Bộ sưu tập</p>
            <h2>Khám phá theo phong cách</h2>
          </div>
        </div>
        <div className="vg-collections">
          {c.collections.map((collection, i) => (
            <Link className="vg-collection" key={collection.id} href={collection.href}>
              <div className="vg-collection-image">
                <EditorialPhoto image={images[`collection-${i}`]} />
              </div>
              <h3>
                {collection.title}
                <span aria-hidden>↗</span>
              </h3>
              <p>{collection.description}</p>
            </Link>
          ))}
        </div>
      </section>
    ) : null,
    journal: journal ? (
      <section className="vg-journal" id="journal">
        <div className="vg-journal-copy">
          <p className="vg-kicker">{c.journal.title}</p>
          <h2>{journal.content.title}</h2>
          <p>{journal.content.excerpt}</p>
          <Link href={`/stories/${journal.content.slug}`} className="vg-link">
            Đọc câu chuyện ↗
          </Link>
        </div>
        <Link className="vg-journal-image" href={`/stories/${journal.content.slug}`}>
          <EditorialPhoto image={journal.image} />
        </Link>
      </section>
    ) : null,
    closing: (
      <section className="vg-closing">
        <h2>{c.closing.title}</h2>
        <Link className="vg-button" href={c.closing.href}>
          {c.closing.button}
          <span aria-hidden>↗</span>
        </Link>
      </section>
    ),
  };
  return (
    <div className="vintic-gallery">
      {c.sections
        .filter((s) => s.enabled)
        .map((s) => (
          <div key={s.id}>{blocks[s.id]}</div>
        ))}
    </div>
  );
}
