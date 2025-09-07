"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { useParams } from "next/navigation";
import { sampleAlbums, SampleAlbum } from "@/data/sampleAlbums";
import Link from "next/link";

export default function DemoAlbumPage() {
  const { slug } = useParams();
  const [album, setAlbum] = useState<SampleAlbum | null>(null);

  useEffect(() => {
    const foundAlbum = sampleAlbums.find(a => a.slug === slug);
    setAlbum(foundAlbum || null);
  }, [slug]);

  if (!album) {
    return (
      <section className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <Container>
          <div className="text-center">
            <h2>Album Not Found</h2>
            <p className="text-muted">This demo album doesn&apos;t exist.</p>
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <div className="bg-dark text-white min-vh-100">
      {/* Album Header */}
      <section className="py-5" style={{ backgroundColor: "#121212" }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="mb-3">
                <Badge bg="info" className="mb-2">Demo Album</Badge>
                <h1 className="display-5 fw-bold mb-3">{album.name}</h1>
                <p className="lead text-muted mb-3">{album.description}</p>
                <div className="d-flex gap-3 text-sm">
                  <span>📅 {new Date(album.date).toLocaleDateString()}</span>
                  <span>📸 {album.photos.length} Photos</span>
                  <span>👥 Demo Event</span>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-center">
              <div className="bg-primary text-white rounded p-3">
                <h6 className="mb-2">✨ This is a demo album</h6>
                <p className="small mb-0">
                  Create your own space to collect real photos from your guests!
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Photo Gallery */}
      <section className="py-5">
        <Container>
          <div className="mb-4">
            <h3 className="fw-bold mb-3">Photo Gallery</h3>
          </div>

          {album.photos.length > 0 ? (
            <Row className="g-4">
              {album.photos.map((photo, index) => (
                <Col lg={4} md={6} key={index}>
                  <Card className="border-0 shadow-lg bg-dark text-light hover-lift">
                    <div className="position-relative overflow-hidden">
                      <Card.Img
                        variant="top"
                        src={photo}
                        style={{ 
                          height: "250px", 
                          objectFit: "cover",
                          transition: "transform 0.3s ease"
                        }}
                        className="hover-scale"
                        alt={`Photo ${index + 1} from ${album.name}`}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <Badge bg="dark" className="bg-opacity-75">
                          {index + 1}/{album.photos.length}
                        </Badge>
                      </div>
                    </div>
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Demo Photo {index + 1}</small>
                        <small className="text-muted">📷 Unsplash</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <div className="display-1 mb-3" style={{ opacity: 0.3 }}>📸</div>
              <h4>No photos yet</h4>
              <p className="text-muted">Photos will appear here when guests start uploading.</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-5 py-5">
            <Card className="bg-primary text-white border-0">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-3">Love what you see?</h4>
                <p className="mb-4">
                  Create your own space and start collecting photos from your guests at your next event!
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link href="/create-space">
                    <button className="btn btn-light btn-lg fw-bold">
                      🚀 Create Your Space
                    </button>
                  </Link>
                  <Link href="/">
                    <button className="btn btn-outline-light btn-lg">
                      ← Back to Home
                    </button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </section>

      {/* Additional Styling */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-8px);
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}