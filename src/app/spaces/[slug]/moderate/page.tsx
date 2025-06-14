"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { Photo } from "@/types";

export default function ModeratePage() {
  const { slug } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("space_slug", slug)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching photos:", error);
    else setPhotos(data as Photo[]);

    setLoading(false);
  };

  const updateApproval = async (id: string, approved: boolean) => {
    setSubmitting(true);
    const { error } = await supabase
      .from("photos")
      .update({ approved })
      .eq("id", id);

    if (error) {
      console.error("Approval error:", error);
    } else {
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, approved } : p))
      );
    }

    setSubmitting(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, [slug]);

  return (
    <section className="bg-dark text-white py-5 min-vh-100">
      <Container>
        <h2 className="mb-4 text-center">Moderate Photos</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
          </div>
        ) : photos.length === 0 ? (
          <p className="text-center text-muted">No photos submitted yet.</p>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {photos.map((photo) => (
              <Col key={photo.id}>
                <Card className="bg-secondary text-white border-0 shadow-sm h-100">
                  <Card.Img
                    src={photo.url}
                    alt="Submitted"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <p>
                      <strong>Status:</strong>{" "}
                      {photo.approved ? (
                        <span className="text-success">Approved</span>
                      ) : (
                        <span className="text-warning">Pending</span>
                      )}
                    </p>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        disabled={submitting}
                        onClick={() => updateApproval(photo.id, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={submitting}
                        onClick={() => updateApproval(photo.id, false)}
                      >
                        Reject
                      </Button>
                    </div>
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
