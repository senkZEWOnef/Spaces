"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Form, Button } from "react-bootstrap";
import Link from "next/link";

export default function CreateSpacePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = generateSlug(name);
    console.log("Creating space:", name, "➡️ Slug:", slug);
    router.push(`/spaces/${slug}`);
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
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 mt-2"
                style={{ backgroundColor: "#ec74f9", border: "none" }}
              >
                Create
              </Button>
            </Form>
          </Card>
        </div>
      </Container>
    </div>
  );
}
