"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner, Card, Button } from "react-bootstrap";
import { supabase } from "@/lib/supabase";

type Photo = {
  id: string;
  image_url: string | null;
  approved: boolean | null;
  created_at: string | null;
  space_id: string | null;
  uploaded_by: string | null;
  caption: string | null; // ✅ If you don’t have this in DB, remove or handle null.
};

export default function ModeratePage() {
  const params = useParams();
  const slug = params.slug as string; // ✅ Always cast to string to fix TS error

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("space_slug", slug) // ✅ matches your DB field
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching photos:", error);
      } else {
        setPhotos(data as Photo[]); // ✅ ensure cast matches Photo[]
      }

      setLoading(false);
    };

    fetchPhotos();
  }, [slug]);

  const toggleApproval = async (photoId: string, approve: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("photos")
      .update({ approved: approve })
      .eq("id", photoId);

    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, approved: approve } : p))
    );
  };

  if (loading) {
    return (
      <section className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="light" />
      </section>
    );
  }

  return (
    <section className="bg-dark text-white min-vh-100 p-5">
      <h1 className="mb-4">Moderate Photos for Space: {slug}</h1>
      <div className="d-flex flex-wrap gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={photo.image_url || "/sampleimage1.jpg"}
              style={{ height: "160px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{photo.caption || "No caption"}</Card.Title>
              <Card.Text>
                Uploaded by: {photo.uploaded_by || "Unknown"}
              </Card.Text>
              {photo.approved ? (
                <Button
                  variant="danger"
                  onClick={() => toggleApproval(photo.id, false)}
                >
                  Disapprove
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() => toggleApproval(photo.id, true)}
                >
                  Approve
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </section>
  );
}
