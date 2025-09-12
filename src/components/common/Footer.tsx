import React from "react";
import EmailIcon from "../icons/EmailIcon";

function Footer() {
  return (
    <footer className="bg-black text-white py-5">
      <div className="container text-center">
        <h5>Subscribe to our monthly watch drop:</h5>
        <form className="d-flex justify-content-center mt-3">
          <input
            type="email"
            className="form-control w-25 me-2"
            placeholder="Email"
          />
          <button type="submit" className="btn btn-light">
            <EmailIcon />
          </button>
        </form>

        <ul className="nav justify-content-center mt-4">
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-white">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-white">
              Available Watches
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-white">
              Recently Sold
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-white">
              FAQ
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-white">
              About Us
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-white">
              Contact
            </a>
          </li>
        </ul>

        <p className="mt-4 mb-0">
          © 2025, The Vintage Watch Collection Powered by Next.js
        </p>
      </div>
    </footer>
  );
};

export default Footer;
