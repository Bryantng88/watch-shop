import React from "react";
import styles from "./page.module.css";

const Products: React.FC = () => {
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

        {/* Filter + Sort */}
        <div className="d-flex justify-content-between align-items-center my-4">
          <div>
            <span className="me-3">Filter:</span>
            <select className="form-select d-inline w-auto me-2">
              <option>Availability</option>
            </select>
            <select className="form-select d-inline w-auto me-2">
              <option>Price</option>
            </select>
            <select className="form-select d-inline w-auto">
              <option>Brand</option>
            </select>
          </div>

          <div>
            <span className="me-2">Sort by:</span>
            <select className="form-select d-inline w-auto">
              <option>Alphabetically, A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col-md-3 mb-4">
              <div className="card h-100">
                <img
                  src="/temp_watch.jpg"
                  className="card-img-top"
                  alt="Watch"
                />
                <div className="card-body">
                  <h6 className="card-title">
                    Blancpain Fifty Fathoms “BUND”
                  </h6>
                  <p className="card-text">$19,950 USD</p>
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
