"use client";
import React from "react";
import styles from "./page.module.css";
import { products } from "../../data/products";
import PromoBanner from "@/components/product/PromoBanner/PromoBanner";
import PromoBanner2 from "@/components/product/PromoBanner/PromoBanner2";

import Link from "next/link";
import ProductCard from "@/components/product/ProductCard/ProductCard";;

// helper slugify giống bên trang detail
function slugify(input: string) {
  return input
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}


// ----- sort status: available → on hold → sold -----
const statusOrder: Record<string, number> = {
  "available": 1,
  "on hold": 2,
  "sold": 3,
};
const sortedItems = [...products].sort((a, b) => {
  const statusA = (a.status || "available") as keyof typeof statusOrder;
  const statusB = (b.status || "available") as keyof typeof statusOrder;
  return statusOrder[statusA] - statusOrder[statusB];
});

// ----- tách nội dung Filter để tái sử dụng cho sidebar + offcanvas -----
const FilterContent: React.FC = () => {
  return (

    <nav className={styles.simpleSidebar}>

      {/* Price */}
      <div className={styles.priceBlock}>
        <div className={styles.priceHeader}>
          <span>Price Range</span>
          <i className={styles.priceRule} />
        </div>
        <input
          type="range"
          min={0}
          max={50_000_000}
          step={100_000}
          className={styles.rangeInput}
        />
        <div className={styles.priceBottomRow}>
          <button className={styles.filterBtn} type="button">
            FILTER
          </button>
          <span className={styles.priceValue}>0 VND — 50,000,000 VND</span>
        </div>
      </div>

      <details className={styles.group} open>
        <summary className={styles.summary}>Brand</summary>
        <ul className={styles.list}>
          {["Cartier", "Bulova", "Omega", "Longines"].map((s) => (
            <li key={s}>
              <label>
                <input type="checkbox" /> {s}
              </label>
            </li>
          ))}
        </ul>
      </details>

      <details className={styles.group}>
        <summary className={styles.summary}>Style</summary>
        <ul className={styles.list}>
          {["Dress", "Sport", "Diver", "Pilot"].map((s) => (
            <li key={s}>
              <label>
                <input type="checkbox" /> {s}
              </label>
            </li>
          ))}
        </ul>
      </details>

      <details className={styles.group}>
        <summary className={styles.summary}>Case size</summary>
        <ul className={styles.list}>
          {["<34mm", "34–36mm", "37–39mm", "≥40mm"].map((s) => (
            <li key={s}>
              <label>
                <input type="checkbox" /> {s}
              </label>
            </li>
          ))}
        </ul>
      </details>

      <details className={styles.group}>
        <summary className={styles.summary}>Dial Color</summary>
        <div className={styles.colorRow}>
          {["#111", "#888", "#c00", "#0a7", "#0af", "#fff"].map((c) => (
            <span key={c} className={styles.dot} style={{ background: c }} />
          ))}
        </div>
      </details>

      <details className={styles.group}>
        <summary className={styles.summary}>Material</summary>
        <ul className={styles.list}>
          {["Steel", "Gold", "Two-tone", "Titanium"].map((s) => (
            <li key={s}>
              <button className={styles.linkBtn} type="button">
                {s}
              </button>
            </li>
          ))}
        </ul>
      </details>

      <details className={styles.group}>
        <summary className={styles.summary}>Complication</summary>
        <ul className={styles.list}>
          {["Date", "Chronograph", "Moonphase"].map((s) => (
            <li key={s}>
              <button className={styles.linkBtn} type="button">
                {s}
              </button>
            </li>
          ))}
        </ul>
      </details>
      <details className={styles.group}>
        <summary className={styles.summary}>Category</summary>
        <ul className={styles.list}>
          {["Pre-Owned", "Vintage", "New"].map((s) => (
            <li key={s}>
              <button className={styles.linkBtn} type="button">
                {s}
              </button>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
};

const Products: React.FC = () => {
  return (
    <>
      <main className={`${styles.container} text-black mx-auto`}>


        <section className="container my-0 pt-2">
          <div className="row mb-4">
            <div className="col-12">
              <PromoBanner2 />
            </div>
          </div>

          <div className="row">
            {/* ====== MOBILE: nút Lọc (chỉ hiện < md) ====== */}
            <div className="col-12 d-md-none d-flex justify-content-end mb-3">
              <button
                className="btn btn-outline-dark"
                data-bs-toggle="offcanvas"
                data-bs-target="#filterOffcanvas"
              >
                ☰ Lọc
              </button>
            </div>

            {/* ====== DESKTOP SIDEBAR (ẩn trên mobile) ====== */}
            <aside className="col-lg-3 col-md-4 d-none d-md-block">
              <FilterContent />
            </aside>

            {/* ====== Sort Select ====== */}

            <div className="col-lg-9 col-md-8">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className={styles.sortBarText}>Showing 1–12 of 98 results</span>

                <div className={styles.sortSelectWrapper}>
                  <select className={styles.sortSelect} defaultValue="default">
                    <option value="default">Default sorting</option>
                    <option value="new">Newest</option>
                    <option value="low">Price: Low → High</option>
                    <option value="high">Price: High → Low</option>
                  </select>
                </div>
              </div>

              {/* ====== Product Grid ====== */}

              <div className="row g-4">
                {sortedItems.map((item, index) => (
                  <div key={index} className="col-12 col-sm-6 col-lg-4">
                    <ProductCard item={item} />
                  </div>
                ))}
              </div>
            </div>
            {/* ====== OFFCANVAS FILTER (Mobile) ====== */}
            <div
              className={`offcanvas offcanvas-start ${styles.offcanvasFilter}`}
              tabIndex={-1}
              id="filterOffcanvas"
              aria-labelledby="filterOffcanvasLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="filterOffcanvasLabel">
                  Bộ lọc
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                />
              </div>
              <div className="offcanvas-body">
                <FilterContent />
                <button
                  className="btn btn-dark w-100 mt-3"
                  data-bs-dismiss="offcanvas"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pagination */}
        <div className="d-flex justify-content-center my-5">
          <nav>
            <ul className="pagination">
              <li className="page-item active">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  &gt;
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </main>

      <div className={`${styles.footer} text-center text-black bg-light py-5`}>
        <div className={`${styles.contactWrap} bg-white py-5 mx-auto`}>
          <h2>Looking for Something Specific?</h2>
          <p>{`If you're hunting down your grail, we may have a few gems.`}</p>
          <button className="btn btn-dark">Contact Us</button>
        </div>
      </div>
    </>
  );
};

export default Products;
