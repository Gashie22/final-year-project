import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import "../styles.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 w-full mt-auto">
      <div className="container">
        <div className="row">
          {/* Quick Links Column */}
          <div className="col-md-4 mb-3">
            <h5 className="border-bottom pb-2 mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/about" className="text-white text-decoration-none hover-link">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="/features" className="text-white text-decoration-none hover-link">
                  Features
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-white text-decoration-none hover-link">
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a href="/faq" className="text-white text-decoration-none hover-link">
                  FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="text-white text-decoration-none hover-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div className="col-md-4 mb-3">
            <h5 className="border-bottom pb-2 mb-3">About SecureTitleZW</h5>
            <p className="text-light">
              Zimbabwe's blockchain-powered land registry ensuring secure, transparent property ownership and transfers.
            </p>
            <div className="mt-2">
              <FaEnvelope className="me-2" />
              <a href="mailto:masogashie@gmail.com" className="text-white text-decoration-none">
                masogashie@gmail.com
              </a>
            </div>
            <div className="mt-2">
              <span className="text-light">Harare, Zimbabwe</span>
            </div>
          </div>

          {/* Social Media Column */}
          <div className="col-md-4 text-center">
            <h5 className="border-bottom pb-2 mb-3">Connect With Us</h5>
            <p className="text-light mb-3">
              Follow us for updates on Zimbabwe's land registry innovations.
            </p>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" className="text-white me-3 social-icon">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" className="text-white me-3 social-icon">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" className="text-white me-3 social-icon">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <hr className="border-light my-3" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} SecureTitleZW. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 