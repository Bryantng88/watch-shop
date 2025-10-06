import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={`${styles.page}`}>
      <main className="container my-5">
        <h1 className="mb-3">Available Watches</h1>
        <p className="text-muted">
          Welcome to The Vintage Watch Collection; where each timepiece tells a
          unique story of craftsmanship, history, and design. Whether youre
          seeking a piece to enjoy daily or a grail to finish your collection,
          were here to help you discover your next favorite.
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
                  src="https://via.placeholder.com/400x300?text=Watch+Image"
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
        <div className="text-center bg-light p-5 my-5">
          <h2>Looking for Something Specific?</h2>
          <p>If youre hunting down your grail, we may have a few gems</p>
          <button className="btn btn-dark">Contact Us</button>
        </div>
      </main>
    </div>
  );
}
