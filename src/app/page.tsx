"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { sampleAlbums } from "@/data/sampleAlbums";

type Space = Database["public"]["Tables"]["spaces"]["Row"];
type FeaturedItem = Space | typeof sampleAlbums[0];

export default function HomePage() {
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [stats, setStats] = useState({ totalSpaces: 0, totalPhotos: 0, totalUsers: 0 });
  const { handleError } = useErrorHandler();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setUserLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userLoading) return; // Wait for auth check
      
      setLoading(true);
      
      try {
        // Show demo albums for logged-out users, real spaces for logged-in users
        if (!user) {
          console.log('User not logged in, showing demo albums');
          const shuffled = [...sampleAlbums].sort(() => 0.5 - Math.random());
          setFeatured(shuffled.slice(0, 5));
        } else {
          // Fetch featured public spaces for logged-in users
          try {
            const { data: spacesData, error: spacesError } = await supabase
              .from("spaces")
              .select("*")
              .eq("is_public", true)
              .order("created_at", { ascending: false })
              .limit(6);

            console.log('Spaces data for logged-in user:', { spacesData, spacesError, count: spacesData?.length });

            if (spacesError) {
              console.warn('Failed to load spaces:', spacesError);
              console.log('Setting sample albums due to error');
              // Show sample albums when there's an error
              const shuffled = [...sampleAlbums].sort(() => 0.5 - Math.random());
              setFeatured(shuffled.slice(0, 5));
            } else {
              if (spacesData && spacesData.length > 0) {
                console.log('Setting real spaces for logged-in user:', spacesData.length);
                // Shuffle and pick up to 5 real spaces
                const shuffled = [...spacesData].sort(() => 0.5 - Math.random());
                setFeatured(shuffled.slice(0, 5));
              } else {
                console.log('No real spaces found for logged-in user, setting sample albums');
                // Show sample albums when no real spaces exist
                const shuffled = [...sampleAlbums].sort(() => 0.5 - Math.random());
                setFeatured(shuffled.slice(0, 5));
              }
            }
          } catch (spacesLoadError) {
            console.warn('Spaces query failed:', spacesLoadError);
            console.log('Setting sample albums due to catch error');
            // Show sample albums when spaces query fails
            const shuffled = [...sampleAlbums].sort(() => 0.5 - Math.random());
            setFeatured(shuffled.slice(0, 5));
          }
        }

        // Fetch stats for hero section with error handling
        try {
          const statsPromises = [
            supabase.from("spaces").select("id", { count: "exact", head: true }),
            supabase.from("photos").select("id", { count: "exact", head: true }),
            supabase.from("users").select("id", { count: "exact", head: true })
          ];

          const results = await Promise.allSettled(statsPromises);
          
          const spacesCount = results[0].status === 'fulfilled' ? results[0].value.count : 0;
          const photosCount = results[1].status === 'fulfilled' ? results[1].value.count : 0;
          const usersCount = results[2].status === 'fulfilled' ? results[2].value.count : 0;

          setStats({
            totalSpaces: spacesCount || 0,
            totalPhotos: photosCount || 0,
            totalUsers: usersCount || 0
          });
        } catch (statsError) {
          console.warn('Failed to load stats:', statsError);
          // Set default stats if database queries fail
          setStats({
            totalSpaces: 0,
            totalPhotos: 0,
            totalUsers: 0
          });
        }

      } catch (error) {
        handleError(error, 'Failed to load homepage data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [handleError, user, userLoading]);

  return (
    <div className="bg-dark text-light">
      {/* Hero Section - Your Original Style Enhanced */}
      <section
        className="d-flex justify-content-center align-items-center text-center text-white py-5 position-relative"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        />
        
        <div
          className="position-relative"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "2rem",
            borderRadius: "15px",
            width: "90%",
            maxWidth: "600px",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            className="display-5 fw-bold mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Your memories, shared beautifully
          </h2>
          <p className="lead mb-4">
            Effortless photo sharing for weddings and events
          </p>
          
          {/* Modern stats integration */}
          {!loading && stats.totalSpaces > 0 && (
            <div className="row g-3 mb-4">
              <div className="col-4">
                <div className="bg-light bg-opacity-10 rounded-3 p-2">
                  <div className="fw-bold">{stats.totalSpaces}+</div>
                  <small>Events</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-light bg-opacity-10 rounded-3 p-2">
                  <div className="fw-bold">{stats.totalPhotos}+</div>
                  <small>Photos</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-light bg-opacity-10 rounded-3 p-2">
                  <div className="fw-bold">{stats.totalUsers}+</div>
                  <small>Users</small>
                </div>
              </div>
            </div>
          )}
          
          <Link href="/create-space">
            <Button
              size="lg"
              style={{
                backgroundColor: "#9a8c58",
                border: "none",
                padding: "12px 30px",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(154, 140, 88, 0.3)",
                transition: "all 0.3s ease",
              }}
              className="hover-lift"
            >
              Create Space
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Albums - Your Original Dark Style */}
      <section className="py-5" style={{ backgroundColor: "#121212" }}>
        <Container>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "Georgia, serif", color: "#f8f9fa" }}
          >
            Featured Albums
          </h2>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {featured.length > 0 ? (
                <Row className="g-4 justify-content-center">
                  {featured.map((album) => (
                    <Col xs={12} sm={6} md={4} lg={3} xl={2} key={album.id}>
                      <Card className="border-0 shadow-lg h-100 bg-dark text-light hover-lift">
                        <div className="position-relative overflow-hidden">
                          <Card.Img
                            variant="top"
                            src={album.image_url || "/sampleimage1.jpg"}
                            style={{ 
                              height: "180px", 
                              objectFit: "cover",
                              transition: "transform 0.3s ease"
                            }}
                            className="hover-scale"
                          />
                          <div 
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{ 
                              background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))",
                              opacity: 0.8
                            }}
                          />
                        </div>
                        <Card.Body className="p-3">
                          <Card.Title className="h6 mb-2">{album.name}</Card.Title>
                          <Card.Text className="small text-light opacity-75 mb-3">
                            {album.description || "A few highlights from this event."}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="text-muted">
                              📅 {new Date(album.date || album.created_at || Date.now()).toLocaleDateString()}
                            </small>
                            <small className="text-success">✓ Public</small>
                          </div>
                          <Link
                            href={('id' in album && album.id?.startsWith('sample-')) ? `/demo/${album.slug}` : `/spaces/${album.slug}`}
                            className="btn btn-gold w-100 btn-sm"
                          >
                            View Album
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <div className="display-1 mb-3" style={{ opacity: 0.3 }}>📸</div>
                  <h4 className="mb-3 text-light">No Featured Albums Yet</h4>
                  <p className="text-muted mb-4">Be the first to create a beautiful photo space!</p>
                  <Link href="/create-space">
                    <Button variant="outline-light" size="lg">
                      Create First Space
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Quick Actions - Your Original Dark Style Enhanced */}
      <section className="py-5" style={{ backgroundColor: "#1e1e1e" }}>
        <Container>
          <h2
            className="text-center mb-5"
            style={{ fontFamily: "Georgia, serif", color: "#f8f9fa" }}
          >
            Quick Actions
          </h2>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="p-4 border-0 shadow-lg h-100 bg-dark text-light hover-lift">
                <Card.Body>
                  <div className="mb-3">
                    <i className="bi bi-plus-circle display-4 text-warning"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Create Your Event Space</h5>
                  <p className="mb-4">Start collecting photos from your guests in minutes.</p>
                  <Link href="/create-space">
                    <Button className="btn-gold w-100">Create Space</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-4 border-0 shadow-lg h-100 bg-dark text-light hover-lift">
                <Card.Body>
                  <div className="mb-3">
                    <i className="bi bi-globe display-4 text-primary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Explore Public Albums</h5>
                  <p className="mb-4">View beautiful albums shared by others in the community.</p>
                  <Link href="/public-spaces">
                    <Button className="btn-gold w-100">Browse Albums</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-4 border-0 shadow-lg h-100 bg-dark text-light hover-lift">
                <Card.Body>
                  <div className="mb-3">
                    <i className="bi bi-heart display-4 text-danger"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Share the Love</h5>
                  <p className="mb-4">Know someone getting married? Let them know about us.</p>
                  <Link href="/signup">
                    <Button className="btn-gold w-100">Get Started</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-5" style={{ backgroundColor: "#2d3748" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-light mb-3" style={{ fontFamily: "Georgia, serif" }}>
              Choose Your Perfect Plan
            </h2>
            <p className="lead text-light opacity-75 mb-4">
              Start free and upgrade as your events grow
            </p>
          </div>

          <Row className="justify-content-center g-4">
            {/* Free Plan */}
            <Col lg={4} md={6}>
              <Card className="border-0 shadow-lg h-100 position-relative" style={{ backgroundColor: "#1a202c" }}>
                <Card.Body className="p-4 text-center text-light">
                  <div className="mb-3">
                    <h4 className="fw-bold text-light">Starter</h4>
                    <div className="mb-2">
                      <span className="display-4 fw-bold">Free</span>
                    </div>
                    <p className="text-muted mb-0">Perfect for small gatherings</p>
                  </div>

                  <hr className="border-secondary my-4" />

                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Up to 5 guests can upload
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      20 photos per guest max
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Basic photo gallery
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Public/private spaces
                    </li>
                    <li className="mb-2 text-muted">
                      <i className="bi bi-x-circle me-2"></i>
                      No co-hosts
                    </li>
                    <li className="mb-2 text-muted">
                      <i className="bi bi-x-circle me-2"></i>
                      Community support only
                    </li>
                  </ul>

                  <Link href="/create-space">
                    <Button 
                      variant="outline-light" 
                      className="w-100"
                      size="lg"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            {/* Pro Plan */}
            <Col lg={4} md={6}>
              <Card className="border-0 shadow-lg h-100 position-relative bg-primary">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
                    Most Popular
                  </span>
                </div>
                <Card.Body className="p-4 text-center text-light mt-3">
                  <div className="mb-3">
                    <h4 className="fw-bold">Pro</h4>
                    <div className="mb-2">
                      <span className="display-4 fw-bold">$10</span>
                      <span className="fs-6 opacity-75">/month</span>
                    </div>
                    <p className="opacity-75 mb-0">Great for medium events</p>
                    <div className="badge bg-success mb-2">Free Trial: 1 Event</div>
                  </div>

                  <hr className="border-light border-opacity-25 my-4" />

                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Unlimited guests
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Unlimited photos per guest
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      1 co-host allowed
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Advanced photo moderation
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Download all photos
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Email support
                    </li>
                  </ul>

                  <Link href="/create-space">
                    <Button 
                      variant="light" 
                      className="w-100 fw-bold"
                      size="lg"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            {/* Premium Plan */}
            <Col lg={4} md={6}>
              <Card className="border-0 shadow-lg h-100" style={{ backgroundColor: "#1a202c", border: "2px solid #9a8c58" }}>
                <Card.Body className="p-4 text-center text-light">
                  <div className="mb-3">
                    <h4 className="fw-bold" style={{ color: "#9a8c58" }}>Premium</h4>
                    <div className="mb-2">
                      <span className="display-4 fw-bold">$20</span>
                      <span className="fs-6 opacity-75">/month</span>
                    </div>
                    <p className="text-muted mb-0">Perfect for large events</p>
                  </div>

                  <hr className="border-secondary my-4" />

                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Everything in Pro
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Unlimited co-hosts
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Priority photo processing
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Custom branding options
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Advanced analytics
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      24/7 priority support
                    </li>
                  </ul>

                  <Link href="/create-space">
                    <Button 
                      className="w-100 fw-bold"
                      size="lg"
                      style={{ 
                        backgroundColor: "#9a8c58", 
                        border: "none",
                        color: "white"
                      }}
                    >
                      Go Premium
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* FAQ or Additional Info */}
          <div className="text-center mt-5">
            <p className="text-light opacity-75">
              🔒 All plans include secure photo storage and privacy controls
            </p>
            <p className="text-muted small">
              Cancel anytime • No setup fees • 30-day money back guarantee
            </p>
          </div>
        </Container>
      </section>

      {/* Modern CTA Section with Dark Theme */}
      <section className="py-5" style={{ backgroundColor: "#0d1117" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="text-center text-lg-start">
              <h2 className="display-6 fw-bold mb-3 text-light">Ready to Create Something Beautiful?</h2>
              <p className="lead mb-0 text-muted">Join couples worldwide who trust Spaces with their precious memories.</p>
            </Col>
            <Col lg={4} className="text-center text-lg-end mt-4 mt-lg-0">
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end justify-content-center">
                <Link href="/create-space">
                  <Button 
                    className="btn-gold"
                    size="lg"
                  >
                    🚀 Start Free
                  </Button>
                </Link>
                <Link href="/public-spaces">
                  <Button 
                    variant="outline-light" 
                    size="lg"
                  >
                    👀 View Examples
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}