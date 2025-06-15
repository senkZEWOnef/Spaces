"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Badge } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function SiteNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  // Get user and role from Supabase
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);

      if (data.user) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (error) console.error("Role fetch error:", error);
        setRole(userData?.role ?? null);
      } else {
        setRole(null);
      }
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();
          setRole(userData?.role ?? null);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Spaces
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto gap-3">
            <Nav.Link as={Link} href="/public-spaces">
              Public Spaces
            </Nav.Link>
            <Nav.Link as={Link} href="/create-space">
              Create Space
            </Nav.Link>

            {user && (
              <Nav.Link as={Link} href="/dashboard">
                Dashboard
              </Nav.Link>
            )}

            {role === "admin" && (
              <NavDropdown title="Admin Tools" id="admin-tools">
                <NavDropdown.Item as={Link} href="/admin/users">
                  Manage Users
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/admin/analytics">
                  View Analytics
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/moderate">
                  Moderate Content
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {user ? (
              <>
                <span className="navbar-text text-light me-2">
                  {user.email?.split("@")[0]}{" "}
                  {role === "admin" && (
                    <Badge bg="warning" className="ms-1">
                      Admin
                    </Badge>
                  )}
                </span>
                <Nav.Link onClick={handleLogout} className="text-warning">
                  Sign Out
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} href="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} href="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
