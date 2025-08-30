"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CreateSpacePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setError("You must be logged in to create a space");
        setLoading(false);
        return;
      }

      const slug = generateSlug(name);
      
      // Check if slug already exists
      const { data: existingSpace } = await supabase
        .from('spaces')
        .select('slug')
        .eq('slug', slug)
        .single();
        
      if (existingSpace) {
        setError("A space with this name already exists. Please choose a different name.");
        setLoading(false);
        return;
      }
      
      // Create the space
      const { data: newSpace, error: insertError } = await supabase
        .from('spaces')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          date: date || new Date().toISOString().split('T')[0],
          slug,
          created_by: user.id,
          is_public: true,
          uploads: 0,
          views: 0
        })
        .select()
        .single();
        
      if (insertError) {
        console.error('Insert error:', insertError);
        setError("Failed to create space. Please try again.");
        setLoading(false);
        return;
      }
      
      // Redirect to the new space
      router.push(`/spaces/${slug}`);
      
    } catch (err) {
      console.error('Create space error:', err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-light px-4 py-5" style={{ width: "220px" }}>
        <h5 className="text-muted fw-bold mb-4">
          Share<span className="text-danger">Space</span>
        </h5>
        <div className="text-uppercase small text-muted mb-3">Menu</div>
        <div className="d-flex flex-column gap-3">
          <Link
            href="/spaces"
            className="text-decoration-none fw-bold text-primary"
          >
            📁 Spaces
          </Link>
          <Link href="/settings" className="text-decoration-none text-muted">
            ⚙️ Settings
          </Link>
        </div>
      </div>

      {/* Main content */}
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ flex: 1 }}
      >
        <div>
          <h2 className="text-center fw-semibold mb-4">Spaces</h2>
          <Card className="p-4 shadow-sm" style={{ minWidth: "400px" }}>
            <h4 className="fw-bold text-center mb-4">Create Space</h4>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleCreate}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Bachelor in Cancun"
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell people what this space is about..."
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Event Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 mt-2"
                style={{ backgroundColor: "#ec74f9", border: "none" }}
                disabled={loading || !name.trim()}
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            </Form>
          </Card>
        </div>
      </Container>
    </div>
  );
}
