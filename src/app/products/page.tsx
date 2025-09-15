import React from "react";
import styles from "./page.module.css";

const Products: React.FC = () => {

  const items = [
    {
      "img": "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF2829(edited).JPG?ssid=a542fdaca32644f9a27029e028a33d81&openfolder=normal&ep=&_dc=1757771851392&fid=a542fdaca32644f9a27029e028a33d81",
      "title": "Cartier Solo 1011 Galaxy Dial Date 2000s Stainless Steel ",
      "price": "1000000"
    },
    {
      "img": "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF2844(edited).JPG?ssid=a4c57bd64bb5498bbfef871276bb58ce&openfolder=normal&ep=&_dc=1757906042035&fid=a4c57bd64bb5498bbfef871276bb58ce",
      "title": "Bulova Submariner Black Dial Date 1990s",
      "price": "2000000"
    },
    {
      "img": "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF2577(edited)-Copy(1).JPG?ssid=96a1fbb533374dcea8e2cfda6dd7c4e4&openfolder=normal&ep=&_dc=1757907465040&fid=96a1fbb533374dcea8e2cfda6dd7c4e4",
      "title": "Cartier",

      "price": "1000000",
      "status": "sold"
    },
    {
      "img": "http://www.myqnapcloud.com/smartshare/788g66h27p84o21su68w2984_%252Fbrsw%252Fwbujqtq%252Fga%252FVvKvfk",
      "title": "Bulova",

      "price": "2000000"
    },
    {
      "img": "http://www.myqnapcloud.com/smartshare/788g66h27p84o21su68w2984_%252Fbrsw%252Fwbujqtq%252Fga%252FtBbhnL",
      "title": "Cartier",

      "price": "1000000"
    },
    {
      "img": "http://www.myqnapcloud.com/smartshare/788g66h27p84o21su68w2984_%252Fbrsw%252Fwbujqtq%252Fga%252FVvKvfk",
      "title": "Bulova",

      "price": "2000000"
    }, {
      "img": "http://www.myqnapcloud.com/smartshare/788g66h27p84o21su68w2984_%252Fbrsw%252Fwbujqtq%252Fga%252FtBbhnL",
      "title": "Cartier",

      "price": "1000000",
      "status": "on hold"
    },
    {
      "img": "http://www.myqnapcloud.com/smartshare/788g66h27p84o21su68w2984_%252Fbrsw%252Fwbujqtq%252Fga%252FVvKvfk",
      "title": "Bulova",

      "price": "2000000",
      "status": "sold"
    }

  ]

  return (
    <>
      <main className={`${styles.container} text-black mx-auto`}>
        <h1 className="mb-3">Available Watches</h1>
        <p className="text-muted">
          Welcome to The Vintage Watch Collection; where each timepiece tells a
          unique story of craftsmanship, history, and design. Whether you're
          seeking a piece to enjoy daily or a grail to finish your collection,
          we're here to help you discover your next favorite.
        </p>


        <section className="container">
          <div className="row g-4">
            {/* Sidebar filter (left) */}
            <aside className="col-lg-3 col-md-4">
              <div className={styles.filterCard}>
                <div className={styles.filterHeader}>Filter</div>

                <div className="mb-3">
                  <div className={styles.filterLabel}>Availability</div>
                  <div className="d-grid gap-2">
                    <button className={styles.chip}>In stock</button>
                    <button className={styles.chip}>Pre-order</button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className={styles.filterLabel}>Price</div>
                  <div className="d-grid gap-2">
                    <button className={styles.chip}>Under 50k</button>
                    <button className={styles.chip}>50k – 200k</button>
                  </div>
                </div>

                <div className="mb-2">
                  <div className={styles.filterLabel}>Brand</div>
                  <div className="d-grid gap-2">
                    <button className={styles.chip}>Cartier</button>
                    <button className={styles.chip}>Bulova</button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right content (sort + products) */}
            <main className="col-lg-9 col-md-8">
              <div className={styles.sortBar}>
                <span className={styles.sortLabel}>Sort by:</span>
                <button className={styles.chip}>Alphabetically, A–Z ▾</button>
              </div>

              <div className="row g-4">
                {/* ...map cards ở đây... */}
              </div>
            </main>
          </div>
        </section>

        {/* Products Grid */}
        <div className="row">
          {items.map((item, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="card product-card h-100">
                <div className={`img-wrapper ${item.status === "sold" ? "is-out" : ""}`}>
                  <img
                    src={item.img}
                    className="card-img-top"
                    alt="Watch"
                  />
                  {item.status === "sold" && (
                    <div className="status-band">OUT OF STOCK</div>
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
      </main>
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
