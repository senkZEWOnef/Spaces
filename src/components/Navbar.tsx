"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function SiteNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);

      if (data.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();
        setIsAdmin(userData?.role === "admin");
      }
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
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
            {isAdmin && (
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
                  {user.email?.split("@")[0]}
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
