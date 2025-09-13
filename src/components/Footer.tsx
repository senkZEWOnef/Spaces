// src/components/Footer.tsx
"use client";

import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-dark text-white py-5"
      style={{ position: "relative", zIndex: 1 }}
    >
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="mb-3" style={{ fontFamily: "Georgia, serif" }}>
              Help & Info
            </h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/faq" className="text-white text-decoration-none">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-white text-decoration-none">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white text-decoration-none"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3" style={{ fontFamily: "Georgia, serif" }}>
              Social Media
            </h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://threads.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                >
                  Threads
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                >
                  Twitter (X)
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} className="text-md-end mt-4 mt-md-0">
            <p className="text-muted small">
              &copy; {new Date().getFullYear()} Spaces. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}