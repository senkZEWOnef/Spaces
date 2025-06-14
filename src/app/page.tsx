"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Space = Database["public"]["Tables"]["spaces"]["Row"];

export default function HomePage() {
  const [featured, setFeatured] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("is_public", true);

      if (error) {
        console.error("Error fetching public spaces:", error);
        setFeatured([]);
      } else {
        // Shuffle and pick up to 5
        const shuffled = [...(data || [])].sort(() => 0.5 - Math.random());
        setFeatured(shuffled.slice(0, 5));
      }

      setLoading(false);
    };

    fetchFeatured();
  }, []);

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

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="light" />
            </div>
          ) : (
            <Row className="g-4 justify-content-center">
              {featured.map((album) => (
                <Col xs={12} sm={6} md={4} lg={3} xl={2} key={album.id}>
                  <Card className="border-0 shadow-sm h-100 bg-dark text-light">
                    <Card.Img
                      variant="top"
                      src={album.image_url || "/sampleimage1.jpg"}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{album.name}</Card.Title>
                      <Card.Text>
                        {album.description ||
                          "A few highlights from this event."}
                      </Card.Text>
                      <Link
                        href={`/spaces/${album.slug}`}
                        className="btn btn-gold w-100"
                      >
                        View Album
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
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
    </div>
  );
}
