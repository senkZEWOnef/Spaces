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
      setError("You must be logged in to create a space.");
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

    setSuccess("Space created successfully!");
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <section className="bg-dark text-white min-vh-100 d-flex align-items-center">
      <Container style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">Create a New Space</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wedding in San Juan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-light text-dark"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Event Date</Form.Label>
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
              placeholder="Tell guests what to expect..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-light text-dark"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image (optional)</Form.Label>
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
            <Form.Label>Optional Cohost Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="someone@example.com"
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
                label="🌐 Public - Anyone can view this space"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="text-white mb-2"
              />
              <Form.Check
                type="radio"
                id="private"
                name="privacy"
                label="🔒 Private - Only you and co-hosts can view"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="text-white"
              />
            </div>
            <Form.Text className="text-muted">
              {isPublic ? "Public spaces appear in the Featured Albums section" : "Private spaces are only visible to you and co-hosts"}
            </Form.Text>
          </Form.Group>

          <Button variant="warning" type="submit" className="w-100" disabled={loading}>
            {loading ? "Creating Space..." : "Create Space"}
          </Button>
        </Form>
      </Container>
    </section>
  );
}
