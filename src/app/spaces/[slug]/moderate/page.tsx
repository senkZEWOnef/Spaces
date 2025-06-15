"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useParams } from "next/navigation";
import { Card, Button, Spinner } from "react-bootstrap";

// ✅ caption is optional
type Photo = Database["public"]["Tables"]["photos"]["Row"] & {
  caption?: string | null;
};

export default function ModeratePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPhotos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("space_slug", slug)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching photos:", error);
      else setPhotos(data ?? []);
      setLoading(false);
    };

    fetchPhotos();
  }, [slug]);

  const handleApproval = async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from("photos")
      .update({ approved })
      .eq("id", id);

    if (error) {
      console.error("Error updating approval:", error);
      return;
    }

    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, approved } : p))
    );
  };

  if (loading) {
    return (
      <section className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="dark" />
      </section>
    );
  }

  return (
    <main className="p-4">
      <h1 className="mb-4">Moderate Photos for &quot;{slug}&quot;</h1>

      <div className="d-flex flex-wrap gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} style={{ width: "18rem" }}>
            <Card.Img
              src={photo.image_url || ""}
              alt={photo.caption || ""}
              style={{ height: "300px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{photo.caption || "No caption"}</Card.Title>
              <Button
                variant={photo.approved ? "danger" : "success"}
                onClick={() => handleApproval(photo.id, !photo.approved)}
              >
                {photo.approved ? "Reject" : "Approve"}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </main>
  );
}
