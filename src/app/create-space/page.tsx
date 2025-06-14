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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to create a space.");
      return;
    }

    const slug = slugify(name);
    let imageUrl = "";

    if (imageFile) {
      const fileName = `events/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("space-images")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError("Failed to upload image: " + uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("space-images").getPublicUrl(fileName);

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
        },
      ])
      .select("id")
      .single();

    if (insertError || !insertedSpaces) {
      setError(insertError?.message || "Error inserting space");
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

          <Form.Group className="mb-4">
            <Form.Label>Optional Cohost Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="someone@example.com"
              value={cohostEmail}
              onChange={(e) => setCohostEmail(e.target.value)}
              className="bg-light text-dark"
            />
          </Form.Group>

          <Button variant="warning" type="submit" className="w-100">
            Create Space
          </Button>
        </Form>
      </Container>
    </section>
  );
}
