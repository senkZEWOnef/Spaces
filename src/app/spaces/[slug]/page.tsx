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
  slug: string;
  date: string;
  description: string | null;
  image_url: string | null;
  views: number | null;
  uploads: number | null;
}

function sanitizeSlug(slug: string): string {
  return decodeURIComponent(slug).replace(/[^a-zA-Z0-9\-]/g, "");
}

export default function EventDetailsPage() {
  const { slug } = useParams();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [cohosts, setCohosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const cleanSlug = sanitizeSlug(slug as string);

      // ✅ Fetch the space
      const { data: spaceData, error: spaceError } = await supabase
        .from("spaces")
        .select("*")
        .eq("slug", cleanSlug)
        .single();

      if (spaceError || !spaceData) {
        console.error("Error fetching space:", spaceError);
        setLoading(false);
        return;
      }

      setSpace({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(spaceData as any),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        slug: (spaceData as any).slug || "",
      });

      // ✅ Fetch cohost emails from view, filter out nulls safely
      const { data: cohostData, error: cohostError } = await supabase
        .from("cohosts_with_email")
        .select("cohost_email")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .eq("space_id", (spaceData as any).id);

      if (cohostError) {
        console.error("Error fetching cohosts:", cohostError);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const emails = (cohostData as any[])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((c: any) => c.cohost_email)
          .filter((e): e is string => e !== null);
        setCohosts(emails);
      }

      setLoading(false);
    };

    if (slug) fetchData();
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

  const fallbackImage = "/sampleimage1.jpg";

  return (
    <section className="bg-dark text-white py-5 min-vh-100">
      <Container>
        <Row className="mb-4">
          <Col md={6}>
            <Card className="bg-secondary border-0 shadow-sm">
              <Card.Img
                src={space.image_url || fallbackImage}
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
            {cohosts.length > 0 ? (
              <ul>
                {cohosts.map((email, idx) => (
                  <li key={idx}>{email}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No cohosts added.</p>
            )}

            <Button
              href={`/spaces/${space.slug}/upload`}
              variant="warning"
              className="mt-3 me-2"
            >
              Upload Photos
            </Button>

            <Button
              href={`/spaces/${space.slug}/gallery`}
              variant="outline-light"
              className="mt-3 me-2"
            >
              View Gallery
            </Button>

            <Button
              variant="outline-warning"
              className="mt-3"
              href={`/spaces/${space.slug}/moderate`}
            >
              Moderate Content
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
