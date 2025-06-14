"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

export default function AnalyticsPage() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalSpaces, setTotalSpaces] = useState<number | null>(null);
  const [publicSpaces, setPublicSpaces] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);

      // Count total users
      const { count: userCount, error: userError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (userError) console.error("Error fetching users count:", userError);
      else setTotalUsers(userCount || 0);

      // Count total spaces
      const { count: spacesCount, error: spacesError } = await supabase
        .from("spaces")
        .select("*", { count: "exact", head: true });

      if (spacesError)
        console.error("Error fetching spaces count:", spacesError);
      else setTotalSpaces(spacesCount || 0);

      // ✅ Count PUBLIC spaces (where is_public = true)
      const { count: publicCount, error: publicError } = await supabase
        .from("spaces")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true);

      if (publicError)
        console.error("Error fetching public spaces count:", publicError);
      else setPublicSpaces(publicCount || 0);

      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <section className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="light" />
      </section>
    );
  }

  return (
    <section className="bg-dark text-white min-vh-100 py-5">
      <Container>
        <h1 className="text-center mb-5">Admin Analytics</h1>
        <Row className="g-4">
          <Col md={4}>
            <Card className="bg-secondary text-white text-center">
              <Card.Body>
                <h5>Total Users</h5>
                <h2>{totalUsers}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-secondary text-white text-center">
              <Card.Body>
                <h5>Total Spaces</h5>
                <h2>{totalSpaces}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-secondary text-white text-center">
              <Card.Body>
                <h5>Public Spaces</h5>
                <h2>{publicSpaces}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
