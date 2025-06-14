"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { Container, Row, Col, Card, Form, Spinner } from "react-bootstrap";
import Link from "next/link";

type Space = Database["public"]["Tables"]["spaces"]["Row"];

export default function PublicSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("is_public", true); // ✅ CORRECT COLUMN NAME
      if (error) console.error("Error fetching public spaces:", error);
      else setSpaces(data || []);
      setLoading(false);
    };

    fetchSpaces();
  }, []);

  const filtered = spaces
    .filter((space) => space.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
      if (sortBy === "date")
        return (
          new Date(a.created_at || "").getTime() -
          new Date(b.created_at || "").getTime()
        );
      return 0;
    });

  return (
    <section className="bg-dark text-white py-5 min-vh-100">
      <Container>
        <h1 className="text-center mb-4">Public Event Spaces</h1>
        <Row className="mb-5">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search by event name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-light text-dark"
            />
          </Col>
          <Col md={6}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-light text-dark"
            >
              <option value="alphabetical">Sort Alphabetically</option>
              <option value="date">Sort by Date</option>
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filtered.map((space) => (
              <Col key={space.id}>
                <Card
                  bg="secondary"
                  text="white"
                  className="h-100 shadow-sm border-0"
                >
                  <Card.Img
                    variant="top"
                    src={space.image_url || "/sampleimage1.jpg"}
                    style={{ height: "160px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{space.name}</Card.Title>
                    <Card.Text>
                      <strong>Created:</strong>{" "}
                      {new Date(space.created_at || "").toLocaleDateString()}
                    </Card.Text>
                    <Link
                      href={`/spaces/${space.slug}`}
                      className="btn w-100"
                      style={{
                        backgroundColor: "#d4af37",
                        border: "none",
                        color: "#000",
                      }}
                    >
                      View Space
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
}
