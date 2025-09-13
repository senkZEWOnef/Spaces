"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Navbar, Container, Nav, NavDropdown, Badge, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function SiteNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-bs-theme', newMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Get user and role from Supabase
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user || null);

        if (data.user) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error("Role fetch error:", error);
          }
          setRole(userData?.role ?? null);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          try {
            const { data: userData } = await supabase
              .from("users")
              .select("role")
              .eq("id", session.user.id)
              .single();
            setRole(userData?.role ?? null);
          } catch (error) {
            console.error('Role fetch failed:', error);
            setRole(null);
          }
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
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserDisplayName = (user: User) => {
    return user.user_metadata?.full_name || 
           user.email?.split('@')[0] || 
           'User';
  };

  // Apply theme on load and change
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <Navbar 
      className={`shadow-sm ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'}`} 
      expand="lg" 
      fixed="top"
    >
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold fs-4">
          📸 ShareSpace
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-2">
            
            {/* Public Navigation */}
            <Nav.Link as={Link} href="/public-spaces" className="fw-semibold px-3">
              🌐 Explore
            </Nav.Link>
            
            {user && (
              <>
                <Nav.Link as={Link} href="/create-space" className="fw-semibold px-3">
                  ➕ Create
                </Nav.Link>
                <Nav.Link as={Link} href="/dashboard" className="fw-semibold px-3">
                  📊 Dashboard
                </Nav.Link>
              </>
            )}

            {/* Admin Tools */}
            {role === "admin" && (
              <NavDropdown 
                title={
                  <span className="fw-semibold">
                    ⚙️ Admin
                    <Badge bg="warning" text="dark" className="ms-2">Admin</Badge>
                  </span>
                } 
                id="admin-tools"
                className="px-2"
              >
                <NavDropdown.Item as={Link} href="/admin/users">
                  👥 Manage Users
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/admin/analytics">
                  📈 Analytics
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/moderate">
                  🛡️ Moderate Content
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item className="text-muted small">
                  Admin Panel
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {/* Theme Toggle */}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={toggleDarkMode}
              className="border-0 mx-2"
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>

            {/* User Section */}
            {user ? (
              <NavDropdown
                title={
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                         style={{width: '32px', height: '32px', fontSize: '14px'}}>
                      {getUserDisplayName(user).charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-semibold">
                      {getUserDisplayName(user)}
                    </span>
                  </div>
                }
                id="user-dropdown"
                align="end"
                className="px-2"
              >
                <div className="px-3 py-2 border-bottom">
                  <div className="fw-semibold">{getUserDisplayName(user)}</div>
                  <small className="text-muted">{user.email}</small>
                  {role === "admin" && (
                    <div>
                      <Badge bg="warning" text="dark" className="mt-1">Administrator</Badge>
                    </div>
                  )}
                </div>
                
                <NavDropdown.Item as={Link} href="/dashboard">
                  📊 Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/profile">
                  👤 Profile
                </NavDropdown.Item>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Item 
                  onClick={handleLogout}
                  className="text-danger"
                >
                  🚪 Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2 ms-2">
                {!isLoading ? (
                  <>
                    <Link href="/login">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="px-3"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button 
                        variant="primary" 
                        size="sm"
                        className="px-3"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}