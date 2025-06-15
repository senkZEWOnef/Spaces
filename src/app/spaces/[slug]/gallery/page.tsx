"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useParams } from "next/navigation";

type Photo = Database["public"]["Tables"]["photos"]["Row"];
type Space = Database["public"]["Tables"]["spaces"]["Row"];

export default function GalleryPage() {
  const { slug } = useParams();
  const [space, setSpace] = useState<Space | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof slug !== "string") return; // ✅ ensure it’s a string

      setLoading(true);

      // Fetch the space
      const { data: spaceData, error: spaceError } = await supabase
        .from("spaces")
        .select("*")
        .eq("slug", slug)
        .single();
      if (spaceError) {
        console.error(spaceError);
        setLoading(false);
        return;
      }
      setSpace(spaceData);

      // Fetch approved photos
      const { data: photoData, error: photoError } = await supabase
        .from("photos")
        .select("*")
        .eq("space_id", spaceData.id)
        .eq("approved", true);
      if (photoError) {
        console.error(photoError);
      } else {
        setPhotos(photoData || []);
      }

      setLoading(false);
    };

    fetchData();
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
        <p>Space not found.</p>
      </section>
    );
  }

  return (
    <section className="bg-dark text-white py-5 min-vh-100">
      <Container>
        <h1 className="text-center mb-4">{space.name} — Gallery</h1>
        {photos.length === 0 ? (
          <p className="text-center">No approved photos yet.</p>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {photos.map((photo) => (
              <Col key={photo.id}>
                <Card
                  bg="secondary"
                  text="white"
                  className="h-100 border-0 shadow-sm"
                >
                  <Card.Img
                    src={photo.image_url || "/placeholder.jpg"}
                    alt={space.name}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Text>
                      Uploaded:{" "}
                      {photo.created_at
                        ? new Date(photo.created_at).toLocaleDateString()
                        : "Unknown"}
                    </Card.Text>
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
