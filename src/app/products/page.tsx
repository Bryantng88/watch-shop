import React from "react";
import styles from "./page.module.css";
import { products } from "../../data/products";

const statusOrder: Record<string, number> = {
  "available": 1,   // mặc định nếu không có status
  "on hold": 2,
  "sold": 3,
};

const sortedItems = products.sort((a, b) => {
  const statusA = a.status || "available";
  const statusB = b.status || "available";
  return statusOrder[statusA] - statusOrder[statusB];
});
const Products: React.FC = () => {
  return (
    <>
      <main className={`${styles.container} text-black mx-auto`}>

        {/* Layout 2 cột: trái = filter, phải = sort + grid */}
        <section className="container my05">

          <div className="row">
            {/* Hàng 1: Sort bar full width */}


            {/* Sidebar filter */}
            <aside className="col-lg-2 col-md-4">
              <nav className={styles.simpleSidebar}>
                <h6 className={styles.sidebarTitle}>FILTER</h6>

                <details className={styles.group} open>
                  <summary className={styles.summary}>BRAND</summary>
                  <ul className={styles.list}>
                    {["XS", "S", "M", "L", "XL"].map(s => <li key={s}><label><input type="checkbox" /> {s}</label></li>)}
                  </ul>
                </details>

                <details className={styles.group}>
                  <summary className={styles.summary}>STYLE</summary>
                  <ul className={styles.list}>
                    {["1/4 Zip", "Full Zip", "Hard Shell", "Heavy Duty", "Hooded"].map(s => (
                      <li key={s}><label><input type="checkbox" /> {s}</label></li>
                    ))}
                  </ul>
                </details>

                <details className={styles.group}>
                  <summary className={styles.summary}>SIZE</summary>
                  <ul className={styles.list}>
                    {["Warm", "Cold", "All-season"].map(s => (
                      <li key={s}><label><input type="checkbox" /> {s}</label></li>
                    ))}
                  </ul>
                </details>

                <details className={styles.group}>
                  <summary className={styles.summary}>MATERIAL</summary>
                  <div className={styles.colorRow}>
                    {["#111", "#888", "#c00", "#0a7", "#0af", "#fff"].map(c => (
                      <span key={c} className={styles.dot} style={{ background: c }} />
                    ))}
                  </div>
                </details>

                <details className={styles.group}>
                  <summary className={styles.summary}>Material</summary>
                  <ul className={styles.list}>
                    {["Cotton", "Fleece", "Wool", "Nylon"].map(s => (
                      <li key={s}>
                        <button className={styles.linkBtn} type="button">{s}</button>
                      </li>
                    ))}
                  </ul>
                </details>
              </nav>
            </aside>


            {/* Right content */}
            <div className="col-lg-10 col-md-8">
              {/* Sort bar */}
              <div className={`${styles.topbar} row align-items-center g-3 mb-3`}>
                <div className="col-12 col-md-6 d-flex align-items-center gap-2">
                  <div className={styles.breadcrumb}>
                    <span>HOME</span> / <strong />ĐỒNG HỒ VINTAGE</strong>
                </div>
                <div className="d-none d-md-flex gap-2">
                  <button className={styles.viewBtn} aria-label="grid">▦</button>
                  <button className={styles.viewBtn} aria-label="list">≣</button>
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-md-end">
                <div className={styles.sortBox}>
                  <span className={styles.sortLabel}>Sort by</span>
                  <select className={styles.sortSelect} defaultValue="popular">
                    <option value="popular">Popular</option>
                    <option value="new">Newest</option>
                    <option value="low">Price: Low → High</option>
                    <option value="high">Price: High → Low</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Products Grid */}
            <div className="row g-4">
              {products.map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-4">
                  <div className="card product-card h-100">
                    <div className={`img-wrapper ${item.status === "sold" ? "is-out" : ""}`}>
                      <img
                        src={item.img}
                        className="card-img-top"
                        alt="Watch"
                      />
                      {item.status === "sold" && (
                        <div className="status-band is-sold">OUT OF STOCK</div>
                      )}
                      {item.status === "on hold" && (
                        <div className="status-band is-hold">ON HOLD</div>
                      )}

                    </div>
                    <div className="card-body">
                      <h6 className="card-title product-title">
                        {item.title}
                      </h6>
                      <div className="product-meta">

                        {item.status === 'sold' ? (
                          <p className="product-price">Contact Us</p>
                        ) : (
                          <p className="card-text product-price">{Number(item.price).toLocaleString("en-US")} VND</p>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* /Products Grid */}
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

      {/* Call to Action */}
    </main >
      <div className={`${styles.footer} text-center text-black bg-light py-5`}>
        <div className={`${styles.contactWrap} bg-white py-5 mx-auto`}>
          <h2>Looking for Something Specific?</h2>
          <p>If you're hunting down your grail, we may have a few gems.</p>
          <button className="btn btn-dark">Contact Us</button>
        </div>
      </div>
    </>
  );
};

export default Products;
