import React from "react";
import Link from "next/link";
import { EditorialPhoto, type DisplayImage } from "./EditorialPhoto";
import type { HomeContent } from "./contract";
export function HomeHero({hero,image,mobile,fallback}:{hero:HomeContent["hero"];image?:DisplayImage;mobile?:DisplayImage;fallback?:string}) { return (<section
        className={`vg-hero${hero.theme === "charcoal" ? " vg-hero--charcoal" : ""}`}
        aria-label="Giới thiệu Vintic"
      >
        <div className="vg-hero-copy">
          <p className="vg-kicker">Vintage & pre-owned</p>
          <h1>{hero.title}</h1>
          <p className="vg-description">{hero.description}</p>
          <Link className="vg-button" href={hero.href}>
            {hero.button}
            <span aria-hidden>↗</span>
          </Link>
        </div>
        <Link className="vg-hero-image" href={hero.href}>
          <EditorialPhoto
            image={image}
            mobile={mobile}
            fallback={fallback}
            eager
          />
          {hero.caption ? (
            <div className="vg-caption">
              <span>Vintic Selects</span>
              {hero.caption}
            </div>
          ) : null}
        </Link>
      </section>); }
