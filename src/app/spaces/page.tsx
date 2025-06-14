"use client";

import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-dark text-light">
      {/* Hero Section */}
      <section
        className="d-flex justify-content-center align-items-center text-center text-white py-5"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "2rem",
            borderRadius: "10px",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <h2
            className="display-5 fw-bold"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Your memories, shared beautifully
          </h2>
          <p className="lead mb-3">
            Effortless photo sharing for weddings and events
          </p>
          <Link href="/create-space">
            <Button
              style={{
                backgroundColor: "#9a8c58",
                border: "none",
                padding: "10px 24px",
                fontWeight: "bold",
              }}
            >
              Create Space
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Albums */}
      <section className="py-5" style={{ backgroundColor: "#121212" }}>
        <Container>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "Georgia, serif", color: "#f8f9fa" }}
          >
            Featured Albums
          </h2>
          <Row className="g-4 justify-content-center">
            {[1, 2, 3].map((album) => (
              <Col md={4} key={album}>
                <Card className="border-0 shadow-sm h-100 bg-dark text-light">
                  <Card.Img variant="top" src={`/sampleimage${album}.jpg`} />
                  <Card.Body>
                    <Card.Title>Album {album}</Card.Title>
                    <Card.Text>
                      A few highlights from our favorite memories.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Quick Actions */}
      <section className="py-5" style={{ backgroundColor: "#1e1e1e" }}>
        <Container>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Quick Actions
          </h2>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="p-4 border-0 shadow-sm h-100 bg-dark text-light">
                <Card.Body>
                  <h5 className="fw-bold">Create Your Event Space</h5>
                  <p>Start collecting photos from your guests.</p>
                  <Link href="/create-space">
                    <Button className="btn-gold w-100">Create</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-4 border-0 shadow-sm h-100 bg-dark text-light">
                <Card.Body>
                  <h5 className="fw-bold">Recommend Us</h5>
                  <p>Know someone getting married? Let them know we exist.</p>
                  <Link href="/recommend">
                    <Button className="btn-gold w-100">Recommend</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-4 border-0 shadow-sm h-100 bg-dark text-light">
                <Card.Body>
                  <h5 className="fw-bold">Explore Public Albums</h5>
                  <p>View albums shared by others.</p>
                  <Link href="/public-spaces">
                    <Button className="btn-gold w-100">Browse</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Social Media Section */}
      <section className="py-5 bg-black text-white">
        <Container>
          <h2
            className="text-center mb-5"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Connect with Us
          </h2>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="bg-dark border-0 h-100 text-light">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Latest Instagram Post</h5>
                  <div className="ratio ratio-4x3 bg-secondary rounded"></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-dark border-0 h-100 text-light">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Latest Thread</h5>
                  <div className="ratio ratio-4x3 bg-secondary rounded"></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-dark border-0 h-100 text-light">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Latest Tweet</h5>
                  <div className="ratio ratio-4x3 bg-secondary rounded"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
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
                  <Link
                    href="/help"
                    className="text-white text-decoration-none"
                  >
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
    </div>
  );
}
