"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/SessionContext";
import Link from "next/link";
import {
  Button,
  ButtonGroup,
  Card,
  Spinner,
  Dropdown,
  DropdownButton,
  Badge,
} from "react-bootstrap";
import type { Database } from "@/types/supabase";

type Space = Database["public"]["Tables"]["spaces"]["Row"];

export default function DashboardPage() {
  const { session, loading: sessionLoading } = useSession();
  const [hostSpaces, setHostSpaces] = useState<Space[]>([]);
  const [cohostSpaces, setCohostSpaces] = useState<Space[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<"host" | "cohost">("host");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const userId = session.user.id;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: userData } = await (supabase as any)
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((userData as any)?.role === "admin") setIsAdmin(true);

      const { data: hostData } = await supabase
        .from("spaces")
        .select("*")
        .eq("created_by", userId);
      setHostSpaces(hostData ?? []);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: cohostLinks } = await (supabase as any)
        .from("cohosts")
        .select("space_id")
        .eq("cohost_id", userId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cohostIds = (cohostLinks ?? []).map((c: any) => c.space_id);
      if (cohostIds.length > 0) {
        const { data: cohostSpacesData } = await supabase
          .from("spaces")
          .select("*")
          .in("id", cohostIds);
        setCohostSpaces(cohostSpacesData ?? []);
      } else {
        setCohostSpaces([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [session, sessionLoading]);

  const displayed = filter === "host" ? hostSpaces : cohostSpaces;

  if (sessionLoading || loading) {
    return (
      <section className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="light" />
      </section>
    );
  }

  if (!session) {
    return (
      <section className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <p>Please sign in to view your dashboard.</p>
      </section>
    );
  }

  return (
    <main className="p-4">
      <h1 className="mb-4">
        My Dashboard {isAdmin && <Badge bg="warning">Admin</Badge>}
      </h1>

      {isAdmin && (
        <DropdownButton variant="dark" title="Admin Tools" className="mb-4">
          <Dropdown.Item as={Link} href="/admin/users">
            Manage Users
          </Dropdown.Item>
          <Dropdown.Item as={Link} href="/admin/analytics">
            View Analytics
          </Dropdown.Item>
          <Dropdown.Item as={Link} href="/moderate">
            Moderate Content
          </Dropdown.Item>
        </DropdownButton>
      )}

      <ButtonGroup className="mb-4">
        <Button
          variant={filter === "host" ? "dark" : "outline-dark"}
          onClick={() => setFilter("host")}
        >
          Host
        </Button>
        <Button
          variant={filter === "cohost" ? "dark" : "outline-dark"}
          onClick={() => setFilter("cohost")}
        >
          Cohost
        </Button>
      </ButtonGroup>

      {displayed.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {displayed.map((space) => (
            <Card key={space.id} style={{ width: "18rem" }}>
              {space.image_url ? (
                <Card.Img
                  variant="top"
                  src={space.image_url}
                  style={{ height: "160px", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    height: "160px",
                    backgroundColor: "#eaeaea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#555",
                  }}
                >
                  No Image
                </div>
              )}
              <Card.Body>
                <Card.Title>{space.name}</Card.Title>
                <Card.Text>{space.description || "No description"}</Card.Text>
                <Link href={`/spaces/${space.slug}`} passHref>
                  <Button variant="dark">View Event</Button>
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
