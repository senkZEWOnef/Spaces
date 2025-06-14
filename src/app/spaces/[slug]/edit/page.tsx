"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { Button, Form } from "react-bootstrap";
import Image from "next/image";

// Type aliases

type Space = Database["public"]["Tables"]["spaces"]["Row"];
type UpdateSpace = Database["public"]["Tables"]["spaces"]["Update"];

export default function EditSpacePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [space, setSpace] = useState<Space | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cohostEmail, setCohostEmail] = useState("");

  useEffect(() => {
    async function fetchSpace() {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching space:", error);
      } else if (data) {
        setSpace(data);
        setName(data.name);
        setDescription(data.description || "");
        setDate(data.date || "");
        setImageUrl(data.image_url);
      }
    }
    if (slug) fetchSpace();
  }, [slug]);

  async function handleUpdate() {
    if (!space) return;

    const updates: UpdateSpace = {
      name,
      description,
      date,
    };

    const { error } = await supabase
      .from("spaces")
      .update(updates)
      .eq("id", space.id);

    if (error) {
      console.error("Update error:", error);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleAddCohost() {
    if (!space || !cohostEmail) return;

    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", cohostEmail)
      .single();

    if (error || !user) {
      alert("User not found or cannot add cohost");
      return;
    }

    const { error: insertError } = await supabase.from("cohosts").insert({
      space_id: space.id,
      cohost_id: user.id,
    });

    if (insertError) {
      alert("Failed to add cohost");
      console.error(insertError);
    } else {
      alert("Cohost added!");
      setCohostEmail("");
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Event</h2>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>

        {imageUrl && (
          <div className="mb-3">
            <Image
              src={imageUrl}
              alt="Event Image"
              width={400}
              height={250}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        <Button variant="primary" onClick={handleUpdate} className="me-2">
          Save Changes
        </Button>
      </Form>

      <h4 className="mt-4">Add Cohost</h4>
      <Form className="d-flex align-items-center gap-2 mt-2">
        <Form.Control
          type="email"
          placeholder="Enter cohost email"
          value={cohostEmail}
          onChange={(e) => setCohostEmail(e.target.value)}
        />
        <Button variant="secondary" onClick={handleAddCohost}>
          Add Cohost
        </Button>
      </Form>
    </div>
  );
}
