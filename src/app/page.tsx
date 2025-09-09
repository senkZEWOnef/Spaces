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

  // Wedding background images for slideshow
  const heroImages = [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2086&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow effect for hero background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

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
    <div style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fefce8 100%)', minHeight: '100vh' }}>
      {/* Hero Section - Wedding Slideshow */}
      <section
        className="d-flex justify-content-center align-items-center text-center text-white py-5 position-relative"
        style={{
          backgroundImage: `url('${heroImages[currentImageIndex]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          transition: "background-image 1s ease-in-out",
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
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "2rem",
            borderRadius: "15px",
            width: "90%",
            maxWidth: "600px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(219, 112, 147, 0.3)",
            border: "2px solid rgba(219, 112, 147, 0.2)",
          }}
        >
          <h2
            className="display-5 fw-bold mb-3"
            style={{ fontFamily: "Georgia, serif", color: "#be185d" }}
          >
            Your wedding memories, shared beautifully
          </h2>
          <p className="lead mb-4" style={{ color: "#881337" }}>
            Let your guests capture and share every magical moment of your special day
          </p>
          
          {/* Modern stats integration */}
          {!loading && stats.totalSpaces > 0 && (
            <div className="row g-3 mb-4">
              <div className="col-4">
                <div className="rounded-3 p-2" style={{ backgroundColor: "rgba(219, 112, 147, 0.3)" }}>
                  <div className="fw-bold" style={{ color: "#be185d" }}>{stats.totalSpaces}+</div>
                  <small style={{ color: "#be185d" }}>Weddings</small>
                </div>
              </div>
              <div className="col-4">
                <div className="rounded-3 p-2" style={{ backgroundColor: "rgba(255, 215, 0, 0.3)" }}>
                  <div className="fw-bold" style={{ color: "#a16207" }}>{stats.totalPhotos}+</div>
                  <small style={{ color: "#a16207" }}>Photos</small>
                </div>
              </div>
              <div className="col-4">
                <div className="rounded-3 p-2" style={{ backgroundColor: "rgba(219, 112, 147, 0.3)" }}>
                  <div className="fw-bold" style={{ color: "#be185d" }}>{stats.totalUsers}+</div>
                  <small style={{ color: "#be185d" }}>Couples</small>
                </div>
              </div>
            </div>
          )}
          
          <Link href="/create-space">
            <Button
              size="lg"
              style={{
                background: "linear-gradient(45deg, #ec4899, #f59e0b)",
                border: "none",
                padding: "12px 30px",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(236, 72, 153, 0.4)",
                transition: "all 0.3s ease",
                color: "white",
              }}
              className="hover-lift"
            >
              Create Wedding Gallery
            </Button>
          </Link>
        </div>

        {/* Slideshow indicators */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="d-flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`rounded-circle border-0 ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                style={{
                  width: '12px',
                  height: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Albums - Wedding Style */}
      <section className="py-5" style={{ backgroundColor: "white" }}>
        <Container>
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "Georgia, serif", color: "#be185d" }}
          >
            Featured Wedding Galleries
          </h2>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status" style={{ color: "#ec4899" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {featured.length > 0 ? (
                <Row className="g-4 justify-content-center">
                  {featured.map((album) => (
                    <Col xs={12} sm={6} md={4} lg={3} xl={2} key={album.id}>
                      <Card className="border-0 shadow-lg h-100 hover-lift" style={{ backgroundColor: "white", border: "1px solid #f3f4f6" }}>
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
                          <Card.Title className="h6 mb-2" style={{ color: "#111827" }}>{album.name}</Card.Title>
                          <Card.Text className="small mb-3" style={{ color: "#6b7280" }}>
                            {album.description || "Beautiful moments from their special day."}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <small style={{ color: "#f59e0b" }}>
                              💒 {new Date(album.date || album.created_at || Date.now()).toLocaleDateString()}
                            </small>
                            <small style={{ color: "#ec4899" }}>💕 Shared</small>
                          </div>
                          <Link
                            href={('id' in album && album.id?.startsWith('sample-')) ? `/demo/${album.slug}` : `/spaces/${album.slug}`}
                            className="w-100 btn-sm"
                            style={{ 
                              background: "linear-gradient(45deg, #ec4899, #f59e0b)",
                              border: "none",
                              color: "white",
                              borderRadius: "6px",
                              padding: "8px 16px",
                              textDecoration: "none",
                              display: "inline-block",
                              textAlign: "center"
                            }}
                          >
                            View Wedding
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <div className="display-1 mb-3" style={{ opacity: 0.3 }}>💒</div>
                  <h4 className="mb-3" style={{ color: "#be185d" }}>No Wedding Galleries Yet</h4>
                  <p className="mb-4" style={{ color: "#6b7280" }}>Be the first to create a beautiful wedding photo gallery!</p>
                  <Link href="/create-space">
                    <Button 
                      size="lg"
                      style={{ 
                        background: "linear-gradient(45deg, #ec4899, #f59e0b)",
                        border: "none",
                        color: "white"
                      }}
                    >
                      Create First Wedding
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Quick Actions - Wedding Style */}
      <section className="py-5" style={{ backgroundColor: "#f9fafb" }}>
        <Container>
          <h2
            className="text-center mb-5"
            style={{ fontFamily: "Georgia, serif", color: "#be185d" }}
          >
            Quick Actions
          </h2>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="p-4 border-0 shadow-lg h-100 hover-lift" style={{ backgroundColor: "white" }}>
                <Card.Body>
                  <div className="mb-3">
                    <i className="bi bi-heart-fill display-4" style={{ color: "#ec4899" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: "#be185d" }}>Create Your Wedding Gallery</h5>
                  <p className="mb-4" style={{ color: "#6b7280" }}>Let your wedding guests share photos from your special day.</p>
                  <Link href="/create-space">
                    <Button 
                      className="w-100"
                      style={{ 
                        background: "linear-gradient(45deg, #ec4899, #f59e0b)",
                        border: "none",
                        color: "white"
                      }}
                    >
                      Start Your Wedding
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-4 border-0 shadow-lg h-100 hover-lift" style={{ backgroundColor: "white" }}>
                <Card.Body>
                  <div className="mb-3">
                    <i className="bi bi-images display-4" style={{ color: "#f59e0b" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: "#be185d" }}>Browse Wedding Inspiration</h5>
                  <p className="mb-4" style={{ color: "#6b7280" }}>Get inspired by beautiful wedding galleries from other couples.</p>
                  <Link href="/public-spaces">
                    <Button 
                      className="w-100"
                      style={{ 
                        background: "linear-gradient(45deg, #ec4899, #f59e0b)",
                        border: "none",
                        color: "white"
                      }}
                    >
                      View Weddings
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-4 border-0 shadow-lg h-100 hover-lift" style={{ backgroundColor: "white" }}>
                <Card.Body>
                  <div className="mb-3">
                    <i className="bi bi-gift display-4" style={{ color: "#ec4899" }}></i>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: "#be185d" }}>Perfect Wedding Gift</h5>
                  <p className="mb-4" style={{ color: "#6b7280" }}>Know a couple getting married? Give them the gift of memories.</p>
                  <Link href="/signup">
                    <Button 
                      className="w-100"
                      style={{ 
                        background: "linear-gradient(45deg, #ec4899, #f59e0b)",
                        border: "none",
                        color: "white"
                      }}
                    >
                      Gift a Wedding
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-5" style={{ backgroundColor: "white" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ fontFamily: "Georgia, serif", color: "#be185d" }}>
              Choose Your Lifetime Wedding Package
            </h2>
            <p className="lead mb-4" style={{ color: "#6b7280" }}>
              One-time payment, lifetime access - no recurring fees ever
            </p>
          </div>

          <Row className="justify-content-center g-4">
            {/* Free Plan */}
            <Col lg={4} md={6}>
              <Card className="border-0 shadow-lg h-100 position-relative" style={{ backgroundColor: "#f0fdf4", border: "2px solid #22c55e" }}>
                <Card.Body className="p-4 text-center">
                  <div className="mb-3">
                    <h4 className="fw-bold" style={{ color: "#15803d" }}>Intimate Ceremony</h4>
                    <div className="mb-2">
                      <span className="display-4 fw-bold" style={{ color: "#16a34a" }}>Free</span>
                    </div>
                    <p className="mb-0" style={{ color: "#166534" }}>Perfect for intimate weddings</p>
                  </div>

                  <hr className="border-secondary my-4" />

                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2" style={{ color: "#166534" }}>
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#16a34a" }}></i>
                      Up to 5 wedding guests can upload
                    </li>
                    <li className="mb-2" style={{ color: "#166534" }}>
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#16a34a" }}></i>
                      20 photos per guest max
                    </li>
                    <li className="mb-2" style={{ color: "#166534" }}>
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#16a34a" }}></i>
                      Beautiful wedding gallery
                    </li>
                    <li className="mb-2" style={{ color: "#166534" }}>
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#16a34a" }}></i>
                      Public/private wedding albums
                    </li>
                    <li className="mb-2" style={{ color: "#6b7280" }}>
                      <i className="bi bi-x-circle me-2" style={{ color: "#9ca3af" }}></i>
                      No wedding party co-hosts
                    </li>
                    <li className="mb-2" style={{ color: "#6b7280" }}>
                      <i className="bi bi-x-circle me-2" style={{ color: "#9ca3af" }}></i>
                      Community support only
                    </li>
                  </ul>

                  <Link href="/create-space">
                    <Button 
                      className="w-100"
                      size="lg"
                      style={{
                        backgroundColor: "#16a34a",
                        border: "none",
                        color: "white"
                      }}
                    >
                      Start Wedding Planning
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
                    <h4 className="fw-bold">Pro Wedding</h4>
                    <div className="mb-2">
                      <span className="display-4 fw-bold">$100</span>
                      <span className="fs-6 opacity-75">one-time</span>
                    </div>
                    <p className="opacity-75 mb-0">Lifetime access for all your events</p>
                    <div className="badge bg-success mb-2">Up to 50 Events</div>
                  </div>

                  <hr className="border-light border-opacity-25 my-4" />

                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Up to 50 lifetime events
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Unlimited wedding guests per event
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Unlimited photos per guest
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Multiple wedding party co-hosts
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Advanced photo moderation
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Download all photos & bulk export
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-warning me-2"></i>
                      Priority email support
                    </li>
                  </ul>

                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      At 50 events, delete one to add another
                    </small>
                  </div>
                  <Link href="/create-space">
                    <Button 
                      variant="light" 
                      className="w-100 fw-bold"
                      size="lg"
                    >
                      Get Pro Lifetime Access
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
                    <h4 className="fw-bold" style={{ color: "#9a8c58" }}>Premium Unlimited</h4>
                    <div className="mb-2">
                      <span className="display-4 fw-bold">$500</span>
                      <span className="fs-6 opacity-75">one-time</span>
                    </div>
                    <p className="text-muted mb-0">Unlimited everything, forever</p>
                  </div>

                  <hr className="border-secondary my-4" />

                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Unlimited lifetime events
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Unlimited wedding guests & photos
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Unlimited wedding party co-hosts
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Priority photo processing & storage
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Custom branding & white-label options
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      Advanced analytics & insights
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#9a8c58" }}></i>
                      24/7 priority support & phone support
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
                      Get Premium Unlimited
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* FAQ or Additional Info */}
          <div className="text-center mt-5">
            <p className="text-light opacity-75">
              💒 All wedding packages include secure photo storage and privacy controls
            </p>
            <p className="text-muted small">
              One-time payment • No recurring fees • 30-day money back guarantee • Lifetime access
            </p>
          </div>
        </Container>
      </section>

      {/* Modern CTA Section with Wedding Theme */}
      <section className="py-5" style={{ backgroundColor: "#fdf2f8" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="text-center text-lg-start">
              <h2 className="display-6 fw-bold mb-3" style={{ color: "#be185d" }}>Ready to Capture Your Wedding Magic?</h2>
              <p className="lead mb-0" style={{ color: "#6b7280" }}>Join thousands of couples who've trusted us with their most precious wedding memories.</p>
            </Col>
            <Col lg={4} className="text-center text-lg-end mt-4 mt-lg-0">
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end justify-content-center">
                <Link href="/create-space">
                  <Button 
                    size="lg"
                    style={{ 
                      background: "linear-gradient(45deg, #db7093, #ffd700)",
                      border: "none",
                      color: "white"
                    }}
                  >
                    💒 Start Wedding
                  </Button>
                </Link>
                <Link href="/public-spaces">
                  <Button 
                    size="lg"
                    style={{
                      border: "2px solid #ec4899",
                      backgroundColor: "transparent",
                      color: "#be185d"
                    }}
                  >
                    💕 Wedding Inspiration
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