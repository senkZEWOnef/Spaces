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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setRole((userData as any)?.role ?? null);
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setRole((userData as any)?.role ?? null);
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
      className="shadow-lg" 
      expand="lg" 
      fixed="top"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: isDarkMode 
          ? '1px solid rgba(236, 72, 153, 0.2)' 
          : '1px solid rgba(236, 72, 153, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <Container>
        <Navbar.Brand as={Link} href="/" style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          ✨ ShareSpace
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-2">
            
            {/* Public Navigation */}
            <Nav.Link 
              as={Link} 
              href="/public-spaces" 
              style={{
                fontWeight: '600',
                padding: '0.5rem 1rem',
                margin: '0 0.25rem',
                borderRadius: '8px',
                color: isDarkMode ? '#e5e7eb' : '#374151',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899, #8b5cf6)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = isDarkMode ? '#e5e7eb' : '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💕 Explore Galleries
            </Nav.Link>
            
            {user && (
              <>
                <Nav.Link 
                  as={Link} 
                  href="/create-space" 
                  style={{
                    fontWeight: '600',
                    padding: '0.5rem 1rem',
                    margin: '0 0.25rem',
                    borderRadius: '8px',
                    color: isDarkMode ? '#e5e7eb' : '#374151',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #eab308)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isDarkMode ? '#e5e7eb' : '#374151';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ✨ Create Gallery
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  href="/dashboard" 
                  style={{
                    fontWeight: '600',
                    padding: '0.5rem 1rem',
                    margin: '0 0.25rem',
                    borderRadius: '8px',
                    color: isDarkMode ? '#e5e7eb' : '#374151',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isDarkMode ? '#e5e7eb' : '#374151';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
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
              <div className="d-flex gap-3 ms-2">
                {!isLoading ? (
                  <>
                    <Link href="/login">
                      <button
                        style={{
                          background: 'transparent',
                          border: '2px solid #ec4899',
                          borderRadius: '12px',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#ec4899',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ec4899';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#ec4899';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Sign In
                      </button>
                    </Link>
                    <Link href="/signup">
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)';
                        }}
                      >
                        ✨ Sign Up
                      </button>
                    </Link>
                  </>
                ) : (
                  <div className="spinner-border spinner-border-sm" style={{ color: '#ec4899' }} role="status">
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