"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { supabase } from "@/lib/supabase";

interface Space {
  id: string;
  name: string;
  date: string;
  description: string | null;
  image_url: string | null;
  slug: string | null;
  views?: number | null;
  uploads?: number | null;
  cohosts?: string[];
}

export default function EventDetailsPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpace = async () => {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error) setSpace(data);
      setLoading(false);
    };

    fetchSpace();
  }, [slug]);

  if (loading) {
    return (
      <section className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="light" />
      </section>
    );
  }

  if (!space) {
    return (
      <section className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <p>Event not found.</p>
      </section>
    );
  }

  return (
    <section className="bg-dark text-white py-5 min-vh-100">
      <Container>
        <Row className="mb-4">
          <Col md={6}>
            <Card className="bg-secondary border-0 shadow-sm">
              <Card.Img
                src={space.image_url}
                alt={space.name}
                style={{ height: "300px", objectFit: "cover" }}
              />
            </Card>
          </Col>
          <Col md={6}>
            <h2>{space.name}</h2>
            <p className="text-muted">{space.date}</p>
            <p>{space.description}</p>

            <div className="my-3">
              <Badge bg="info" className="me-2">
                {space.views ?? 0} Views
              </Badge>
              <Badge bg="success">{space.uploads ?? 0} Uploads</Badge>
            </div>

            <h5 className="mt-4">Cohosts:</h5>
            <ul>
              {(space.cohosts ?? []).map((email, idx) => (
                <li key={idx}>{email}</li>
              ))}
            </ul>

            <Button
              href={`/spaces/${slug}/upload`}
              variant="warning"
              className="mt-3 me-2"
            >
              Upload Photos
            </Button>

            <Button
              href={`/spaces/${slug}/gallery`}
              variant="outline-light"
              className="mt-3 me-2"
            >
              View Gallery
            </Button>

            <Button
              variant="outline-warning"
              className="mt-3"
              href={`/spaces/${slug}/moderate`}
            >
              Moderate Content
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
