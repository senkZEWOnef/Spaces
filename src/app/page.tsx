"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { sampleAlbums } from "@/data/sampleAlbums";

type Space = Database["public"]["Tables"]["spaces"]["Row"];
type FeaturedItem = Space | typeof sampleAlbums[0];

export default function HomePage() {
  const [, setFeatured] = useState<FeaturedItem[]>([]);
  const [, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [stats] = useState({ totalSpaces: 12500, totalPhotos: 89600, totalUsers: 3200 });
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
      if (userLoading) return;
      
      setLoading(true);
      
      try {
        // Show sample albums for demo
        const shuffled = [...sampleAlbums].sort(() => 0.5 - Math.random());
        setFeatured(shuffled.slice(0, 6));
      } catch (error) {
        handleError(error, 'Failed to load homepage data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [handleError, user, userLoading]);

  return (
    <>
      {/* Hero Section - Modern Wedding Theme */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fae8ff 50%, #f3e8ff 75%, #ede9fe 100%)',
          minHeight: '70vh',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
      >
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          fontSize: '4rem',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite',
          color: '#ec4899'
        }}>
          💒
        </div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          fontSize: '3rem',
          opacity: 0.1,
          animation: 'float 8s ease-in-out infinite reverse',
          color: '#8b5cf6'
        }}>
          💐
        </div>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          fontSize: '2.5rem',
          opacity: 0.1,
          animation: 'float 7s ease-in-out infinite',
          color: '#f59e0b'
        }}>
          💍
        </div>

        <Container className="h-100 d-flex align-items-center">
          <Row className="w-100 align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: '800',
                  lineHeight: '1.1',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Your Love Story, 
                  <br />
                  <span style={{ color: '#be185d' }}>Captured Forever</span>
                </h1>
                
                <p style={{
                  fontSize: '1.25rem',
                  color: '#6b7280',
                  marginBottom: '2rem',
                  lineHeight: '1.6'
                }}>
                  Create stunning wedding galleries where your guests can share every magical moment from your special day. No app downloads, just pure joy.
                </p>

                {/* Trust Indicators */}
                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  marginBottom: '2.5rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  justifyContent: 'flex-start'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: '#ec4899'
                    }}>
                      {stats.totalSpaces.toLocaleString()}+
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Happy Couples
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: '#8b5cf6'
                    }}>
                      {stats.totalPhotos.toLocaleString()}+
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Precious Moments
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: '#f59e0b'
                    }}>
                      {stats.totalUsers.toLocaleString()}+
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Wedding Guests
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/create-space">
                    <button style={{
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)',
                      minWidth: '200px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(236, 72, 153, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.3)';
                    }}>
                      ✨ Create Your Gallery
                    </button>
                  </Link>
                  
                  <Link href="/public-spaces">
                    <button style={{
                      background: 'transparent',
                      border: '2px solid #ec4899',
                      borderRadius: '12px',
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#ec4899',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: '200px'
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
                    }}>
                      💕 View Galleries
                    </button>
                  </Link>
                </div>
              </div>
            </Col>

            <Col lg={6} className="text-center mt-5 mt-lg-0">
              <div style={{
                position: 'relative',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                {/* Main Image */}
                <div style={{
                  background: 'linear-gradient(135deg, #fdf2f8, #fae8ff)',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 20px 40px rgba(236, 72, 153, 0.15)',
                  transform: 'rotate(-2deg)',
                  border: '1px solid rgba(236, 72, 153, 0.1)'
                }}>
                  <Image 
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Beautiful wedding moment"
                    width={800}
                    height={300}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      filter: 'brightness(1.1) contrast(1.05)'
                    }}
                  />
                  
                  {/* Floating Stats Cards */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: 'white',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f3f4f6'
                  }}>
                    <div style={{ color: '#ec4899', fontWeight: '700', fontSize: '1.2rem' }}>47</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>Photos</div>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: '-10px',
                    background: 'white',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f3f4f6'
                  }}>
                    <div style={{ color: '#8b5cf6', fontWeight: '700', fontSize: '1.2rem' }}>12</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>Guests</div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                  borderRadius: '50%',
                  opacity: 0.1,
                  animation: 'pulse 4s ease-in-out infinite'
                }} />

                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #ec4899, #be185d)',
                  borderRadius: '50%',
                  opacity: 0.1,
                  animation: 'pulse 3s ease-in-out infinite reverse'
                }} />
              </div>
            </Col>
          </Row>
        </Container>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}>
          <div style={{
            width: '30px',
            height: '50px',
            border: '2px solid #ec4899',
            borderRadius: '25px',
            position: 'relative'
          }}>
            <div style={{
              width: '4px',
              height: '8px',
              background: '#ec4899',
              borderRadius: '2px',
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'scroll 1.5s infinite'
            }} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{
        padding: '6rem 0',
        background: 'white'
      }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Three Simple Steps to Wedding Magic
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              From &ldquo;I do&rdquo; to &ldquo;I love these photos&rdquo; - it&apos;s that easy
            </p>
          </div>

          <Row className="g-5">
            <Col md={4} className="text-center">
              <div style={{
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '3rem',
                boxShadow: '0 15px 35px rgba(245, 158, 11, 0.2)'
              }}>
                💒
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Create Your Gallery
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                Set up your beautiful wedding gallery in under 2 minutes. Add your names, date, and a special message.
              </p>
            </Col>

            <Col md={4} className="text-center">
              <div style={{
                background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '3rem',
                boxShadow: '0 15px 35px rgba(236, 72, 153, 0.2)'
              }}>
                📱
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Share with Guests
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                Share a simple link or QR code. Guests upload photos instantly from any phone - no app needed.
              </p>
            </Col>

            <Col md={4} className="text-center">
              <div style={{
                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '3rem',
                boxShadow: '0 15px 35px rgba(139, 92, 246, 0.2)'
              }}>
                💕
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Relive the Magic
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                All photos instantly appear in your gallery. Download everything or share individual moments forever.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>
                Everything You Need for the Perfect Wedding Gallery
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#6b7280',
                marginBottom: '3rem',
                lineHeight: '1.6'
              }}>
                Built by couples, for couples. Every feature is designed to capture and preserve your most precious moments.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '1.5rem'
                  }}>
                    📸
                  </div>
                  <div>
                    <h4 style={{ color: '#1f2937', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Instant Photo Sharing
                    </h4>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Guests upload photos directly from their phones. No apps to download, no accounts to create.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '1.5rem'
                  }}>
                    🔒
                  </div>
                  <div>
                    <h4 style={{ color: '#1f2937', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Private & Secure
                    </h4>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Your photos are safely stored with enterprise-grade security. Share only with who you choose.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '1.5rem'
                  }}>
                    📥
                  </div>
                  <div>
                    <h4 style={{ color: '#1f2937', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Download Everything
                    </h4>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Get all your photos in full resolution. Perfect for printing, albums, or keeping forever.
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6} className="mt-5 mt-lg-0">
              <div style={{
                position: 'relative',
                textAlign: 'center'
              }}>
                {/* Phone Mockup */}
                <div style={{
                  background: 'linear-gradient(135deg, #1f2937, #374151)',
                  borderRadius: '30px',
                  padding: '1rem',
                  display: 'inline-block',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
                  transform: 'rotate(5deg)'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2rem 1rem',
                    width: '280px',
                    height: '500px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <h4 style={{
                        color: '#ec4899',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem'
                      }}>
                        Sarah & Michael&apos;s Wedding
                      </h4>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.9rem'
                      }}>
                        June 15, 2024
                      </p>
                    </div>

                    {/* Sample Photo Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
                        height: '80px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}>
                        💒
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        height: '80px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}>
                        💐
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                        height: '80px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}>
                        💍
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                        height: '80px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}>
                        🥂
                      </div>
                    </div>

                    {/* Upload Button */}
                    <button style={{
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '1rem',
                      width: '100%',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      📸 Add Photos
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section style={{
        padding: '6rem 0',
        background: 'white'
      }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Loved by Couples Everywhere
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#6b7280'
            }}>
              Real stories from real weddings
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card style={{
                border: 'none',
                borderRadius: '20px',
                padding: '2rem',
                height: '100%',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: '1.5rem'
                  }}>
                    👰
                  </div>
                </div>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#4b5563',
                  fontStyle: 'italic',
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}>
                  &ldquo;We got over 200 photos from our guests! So many moments we would have missed. This made our wedding day even more special.&rdquo;
                </p>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    Emma & Jake
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    Portland, OR
                  </div>
                </div>
              </Card>
            </Col>

            <Col md={4}>
              <Card style={{
                border: 'none',
                borderRadius: '20px',
                padding: '2rem',
                height: '100%',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: '1.5rem'
                  }}>
                    🤵
                  </div>
                </div>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#4b5563',
                  fontStyle: 'italic',
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}>
                  &ldquo;Setup was so easy! Our guests loved being able to share photos instantly. The gallery looked absolutely beautiful.&rdquo;
                </p>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    Maria & Carlos
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    Austin, TX
                  </div>
                </div>
              </Card>
            </Col>

            <Col md={4}>
              <Card style={{
                border: 'none',
                borderRadius: '20px',
                padding: '2rem',
                height: '100%',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                background: 'linear-gradient(135deg, #fefce8, #fef3c7)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: '1.5rem'
                  }}>
                    💕
                  </div>
                </div>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#4b5563',
                  fontStyle: 'italic',
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}>
                  &ldquo;Even our grandparents could use it! Having all our wedding photos in one place is priceless. Best wedding decision ever.&rdquo;
                </p>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    Lily & David
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    Nashville, TN
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          fontSize: '6rem',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite'
        }}>
          💒
        </div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          fontSize: '4rem',
          opacity: 0.1,
          animation: 'float 8s ease-in-out infinite reverse'
        }}>
          💐
        </div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          fontSize: '5rem',
          opacity: 0.1,
          animation: 'float 7s ease-in-out infinite'
        }}>
          💍
        </div>

        <Container style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Ready to Create Magic?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '3rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Join thousands of couples who&apos;ve trusted us with their most precious memories. Start your wedding gallery in under 2 minutes.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/create-space">
              <button style={{
                background: 'white',
                color: '#ec4899',
                border: 'none',
                borderRadius: '12px',
                padding: '1.2rem 3rem',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                minWidth: '250px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
              }}>
                ✨ Start Your Wedding Gallery
              </button>
            </Link>
          </div>

          <p style={{
            marginTop: '2rem',
            opacity: 0.8,
            fontSize: '0.9rem'
          }}>
            Free to start • No credit card required • Takes 2 minutes
          </p>
        </Container>
      </section>

      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scroll {
          0% { top: 8px; }
          50% { top: 16px; }
          100% { top: 8px; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
      `}</style>
    </>
  );
}