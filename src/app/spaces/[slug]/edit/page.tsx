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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setName((data as any).name);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setDescription((data as any).description || "");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setDate((data as any).date || "");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setImageUrl((data as any).image_url);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("spaces")
      .update(updates)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .eq("id", (space as any).id);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any).from("cohosts").insert({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      space_id: (space as any).id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cohost_id: (user as any).id,
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
