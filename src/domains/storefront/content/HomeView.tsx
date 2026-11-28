import { HomeHero } from "./HomeHero";
import { EditorialPhoto, type DisplayImage } from "./EditorialPhoto";
export { EditorialPhoto, type DisplayImage } from "./EditorialPhoto";
import Link from "next/link";
import React from "react";
import PublicWatchCardView from "../ui/PublicWatchCard";
import type { PublicWatchCard, PublicWatchImage } from "../contracts";
import type { HomeContent, ArticleContent } from "./contract";

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
  watches: (PublicWatchCard & {featuredImage?:PublicWatchImage})[];
  journal: { id: string; content: ArticleContent; image?: DisplayImage } | null;
};
export default function HomeView({ content: c, images, watches, journal }: HomeViewData) {
  const blocks = {
    hero: <HomeHero hero={c.hero} image={images.hero} mobile={images.mobile} fallback={watches[0]?.image.url}/>,
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
            <PublicWatchCardView key={watch.productId} watch={watch} featuredImage={watch.featuredImage} framing={c.featured.images?.[watch.productId]} />
          ))}
        </div>
      </section>
    ) : null,
    about: (
      <section className={`vg-about${images.about?.url ? "" : " vg-about--text"}`} id="about">
        {images.about?.url && (
          <div className="vg-about-image">
            <EditorialPhoto image={images.about} />
          </div>
        )}
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
            <Link
              className={`vg-collection${images[`collection-${i}`]?.url ? "" : " vg-collection--text"}`}
              key={collection.id}
              href={collection.href}
            >
              {images[`collection-${i}`]?.url && (
                <div className="vg-collection-image">
                  <EditorialPhoto image={images[`collection-${i}`]} />
                </div>
              )}
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
