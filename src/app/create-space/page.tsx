"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Container, Form, Button, Alert } from "react-bootstrap";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CreateSpacePage() {
  const [name, setName] = useState("");
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cohostEmail, setCohostEmail] = useState("");
  const [isPublic, setIsPublic] = useState(true); // Default to public
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to create a wedding gallery.");
      setLoading(false);
      return;
    }

    const slug = slugify(name);
    let imageUrl = "";

    if (imageFile) {
      // Create safe filename by removing invalid characters and getting extension
      const fileExt = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const fileName = `events/${timestamp}-${randomId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError("Failed to upload image: " + uploadError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const { data: insertedSpaces, error: insertError } = await supabase
      .from("spaces")
      .insert([
        {
          name,
          slug,
          date,
          description,
          image_url: imageUrl,
          created_by: user.id,
          is_public: isPublic,
        },
      ])
      .select("id")
      .single();

    if (insertError || !insertedSpaces) {
      setError(insertError?.message || "Error inserting space");
      setLoading(false);
      return;
    }

    if (cohostEmail) {
      const { data: cohostUser, error: userLookupError } = await supabase
        .from("users")
        .select("id")
        .eq("email", cohostEmail)
        .single();

      if (!userLookupError && cohostUser) {
        await supabase.from("cohosts").insert({
          space_id: insertedSpaces.id,
          cohost_id: cohostUser.id,
        });
      }
    }

    setSuccess("Wedding gallery created successfully!");
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <section className="bg-dark text-white min-vh-100 d-flex align-items-center">
      <Container style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">💒 Create Your Wedding Gallery</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Partner 1 Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Sarah"
                  value={partner1Name}
                  onChange={(e) => {
                    setPartner1Name(e.target.value);
                    if (partner2Name) {
                      setName(`${e.target.value} & ${partner2Name}'s Wedding`);
                    }
                  }}
                  className="bg-light text-dark"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Partner 2 Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Michael"
                  value={partner2Name}
                  onChange={(e) => {
                    setPartner2Name(e.target.value);
                    if (partner1Name) {
                      setName(`${partner1Name} & ${e.target.value}'s Wedding`);
                    }
                  }}
                  className="bg-light text-dark"
                />
              </Form.Group>
            </div>
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label>Wedding Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Sarah & Michael's Wedding"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-light text-dark"
            />
            <Form.Text className="text-muted">
              This will be auto-generated from the names above, but you can customize it
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Wedding Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-light text-dark"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Share the story of your special day with your wedding guests..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-light text-dark"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Wedding Photo (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setImageFile(target.files?.[0] || null);
              }}
              className="bg-light text-dark"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Wedding Party Co-Host Email (optional)</Form.Label>
            <Form.Control
              type="email"
              placeholder="maid-of-honor@example.com"
              value={cohostEmail}
              onChange={(e) => setCohostEmail(e.target.value)}
              className="bg-light text-dark"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Privacy Setting</Form.Label>
            <div className="mt-2">
              <Form.Check
                type="radio"
                id="public"
                name="privacy"
                label="💕 Public - Share your wedding with the world"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="text-white mb-2"
              />
              <Form.Check
                type="radio"
                id="private"
                name="privacy"
                label="🔒 Private - Only you and wedding party can view"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="text-white"
              />
            </div>
            <Form.Text className="text-muted">
              {isPublic ? "Public weddings appear in the Featured Wedding Galleries section" : "Private weddings are only visible to you and your wedding party"}
            </Form.Text>
          </Form.Group>

          <Button variant="warning" type="submit" className="w-100" disabled={loading}>
            {loading ? "Creating Wedding Gallery..." : "💒 Create Wedding Gallery"}
          </Button>
        </Form>
      </Container>
    </section>
  );
}
