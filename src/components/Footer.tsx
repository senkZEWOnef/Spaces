// src/components/Footer.tsx
"use client";

import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-5"
      style={{ 
        position: "relative", 
        zIndex: 1,
        background: "linear-gradient(135deg, #fdf2f8 0%, #fefce8 100%)",
        borderTop: "1px solid rgba(236, 72, 153, 0.2)"
      }}
    >
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="mb-3" style={{ fontFamily: "Georgia, serif", color: "#be185d" }}>
              Help & Info
            </h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/faq" className="text-decoration-none" style={{ color: "#6b7280" }}>
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-decoration-none" style={{ color: "#6b7280" }}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-decoration-none"
                  style={{ color: "#6b7280" }}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3" style={{ fontFamily: "Georgia, serif", color: "#be185d" }}>
              Social Media
            </h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  style={{ color: "#6b7280" }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://threads.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  style={{ color: "#6b7280" }}
                >
                  Threads
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  style={{ color: "#6b7280" }}
                >
                  Twitter (X)
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  style={{ color: "#6b7280" }}
                >
                  Facebook
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} className="text-md-end mt-4 mt-md-0">
            <p className="small" style={{ color: "#6b7280" }}>
              &copy; {new Date().getFullYear()} Spaces byZewo. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
