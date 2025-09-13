"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { sampleAlbums } from "@/data/sampleAlbums";

type Space = Database["public"]["Tables"]["spaces"]["Row"];
type FeaturedItem = Space | typeof sampleAlbums[0];

export default function PublicSpacesPage() {
  const [spaces, setSpaces] = useState<FeaturedItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      try {
        // Try to fetch real spaces first
        const { data, error } = await supabase
          .from("spaces")
          .select("*")
          .eq("is_public", true);
        
        if (error) {
          console.error("Error fetching public spaces:", error);
          // Fall back to sample albums
          const shuffled = [...sampleAlbums].sort(() => 0.5 - Math.random());
          setSpaces(shuffled);
        } else if (data && data.length > 0) {
          setSpaces(data);
        } else {
          // If no real spaces, show sample albums
          const shuffled = [...sampleAlbums].sort(() => 0.5 - Math.random());
          setSpaces(shuffled);
        }
      } catch (err) {
        console.error("Failed to fetch spaces:", err);
        // Show sample albums on error
        const shuffled = [...sampleAlbums].sort(() => 0.5 - Math.random());
        setSpaces(shuffled);
      }
      setLoading(false);
    };

    fetchSpaces();
  }, []);

  const filtered = spaces
    .filter((space) => {
      const matchesSearch = space.name?.toLowerCase().includes(search.toLowerCase());
      if (filterBy === "all") return matchesSearch;
      if (filterBy === "recent") {
        const spaceDate = new Date(space.date || space.created_at || Date.now());
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - 6);
        return matchesSearch && spaceDate >= monthsAgo;
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date || b.created_at || 0).getTime() - new Date(a.date || a.created_at || 0).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.date || a.created_at || 0).getTime() - new Date(b.date || b.created_at || 0).getTime();
      }
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fae8ff 50%, #f3e8ff 75%, #ede9fe 100%)',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          fontSize: '3rem',
          opacity: 0.1,
          color: '#ec4899',
          animation: 'float 6s ease-in-out infinite'
        }}>
          💕
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          fontSize: '2.5rem',
          opacity: 0.1,
          color: '#8b5cf6',
          animation: 'float 8s ease-in-out infinite reverse'
        }}>
          🌟
        </div>

        <Container>
          <div className="text-center">
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem'
            }}>
              💕 Explore Wedding Galleries
            </h1>
            <p style={{
              fontSize: '1.3rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Discover beautiful love stories from couples around the world. Get inspired for your own special day.
            </p>
          </div>
        </Container>
      </section>

      {/* Compact Filter & Search Section */}
      <section style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fae8ff 100%)',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(236, 72, 153, 0.1)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <Container>
          <Row className="align-items-center g-3">
            {/* Compact Search Bar */}
            <Col md={4}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '1rem'
                }}>
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Search galleries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 2px rgba(236, 72, 153, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '0.25rem',
                      borderRadius: '50%'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </Col>

            {/* Compact Sort */}
            <Col md={2.5}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.9rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">✨ Newest</option>
                <option value="oldest">⏰ Oldest</option>
                <option value="alphabetical">🔤 A-Z</option>
              </select>
            </Col>

            {/* Compact Filter */}
            <Col md={2.5}>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.9rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">💒 All</option>
                <option value="recent">🆕 Recent</option>
              </select>
            </Col>

            {/* Compact View Toggle */}
            <Col md={2}>
              <div style={{
                display: 'flex',
                background: '#f3f4f6',
                borderRadius: '8px',
                padding: '0.2rem'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    background: viewMode === 'grid' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    background: viewMode === 'list' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                    color: viewMode === 'list' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ☰
                </button>
              </div>
            </Col>

            {/* Compact Results */}
            <Col md={1}>
              <div style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                {loading ? '...' : filtered.length}
              </div>
            </Col>
          </Row>

          {/* Active Filters Row (only show if filters are active) */}
          {(search || filterBy !== 'all') && (
            <Row className="mt-2">
              <Col>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  {search && (
                    <span style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: '#8b5cf6',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      🔍 &quot;{search}&quot;
                    </span>
                  )}
                  
                  {filterBy !== 'all' && (
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: '#f59e0b',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      🗂️ Recent
                    </span>
                  )}
                  
                  <button
                    onClick={() => {
                      setSearch('');
                      setFilterBy('all');
                      setSortBy('newest');
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Clear
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Gallery Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        paddingTop: '3rem',
        paddingBottom: '6rem',
        minHeight: '60vh'
      }}>
        <Container>
          {loading ? (
            <div style={{
              textAlign: 'center',
              paddingTop: '4rem',
              paddingBottom: '4rem'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem 2rem',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid #f3f4f6',
                  borderTop: '3px solid #ec4899',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  Loading beautiful galleries...
                </span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center',
              paddingTop: '4rem',
              paddingBottom: '4rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>
                💕
              </div>
              <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
                No galleries found
              </h3>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Try adjusting your search or filter options
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <Row className="g-4">
              {filtered.map((space) => (
                <Col key={space.id} xs={12} sm={6} md={4} lg={3}>
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}>
                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                      <Image 
                        src={space.image_url || "/sampleimage1.jpg"}
                        alt={space.name}
                        fill
                        style={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        fontSize: '1.2rem'
                      }}>
                        💕
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h4 style={{
                        color: '#1f2937',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        lineHeight: '1.3'
                      }}>
                        {space.name}
                      </h4>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        lineHeight: '1.4'
                      }}>
                        {space.description || "A beautiful wedding celebration filled with love and joy."}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <span style={{
                          color: '#8b5cf6',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          📅 {new Date(space.date || space.created_at || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        href={('id' in space && space.id?.startsWith('sample-')) ? `/demo/${space.slug}` : `/spaces/${space.slug}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <button style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '0.75rem 1rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          💒 View Gallery
                        </button>
                      </Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            /* List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filtered.map((space) => (
                <div key={space.id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}>
                  <Row className="g-0 align-items-center">
                    <Col md={3}>
                      <div style={{ position: 'relative', height: '150px' }}>
                        <Image 
                          src={space.image_url || "/sampleimage1.jpg"}
                          alt={space.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </Col>
                    <Col md={7}>
                      <div style={{ padding: '1.5rem' }}>
                        <h4 style={{
                          color: '#1f2937',
                          fontSize: '1.4rem',
                          fontWeight: '700',
                          marginBottom: '0.5rem'
                        }}>
                          {space.name}
                        </h4>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '1rem',
                          marginBottom: '1rem',
                          lineHeight: '1.5'
                        }}>
                          {space.description || "A beautiful wedding celebration filled with love and joy."}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <span style={{
                            color: '#8b5cf6',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}>
                            📅 {new Date(space.date || space.created_at || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col md={2}>
                      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Link
                          href={('id' in space && space.id?.startsWith('sample-')) ? `/demo/${space.slug}` : `/spaces/${space.slug}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <button style={{
                            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            padding: '1rem 1.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minWidth: '120px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                            View Gallery
                          </button>
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
