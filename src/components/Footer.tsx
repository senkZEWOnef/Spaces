// src/components/Footer.tsx
"use client";

import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{ 
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
        position: "relative", 
        zIndex: 1,
        paddingTop: '4rem',
        paddingBottom: '2rem'
      }}
    >
      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '8%',
        fontSize: '3rem',
        opacity: 0.1,
        color: '#ec4899'
      }}>
        💕
      </div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        fontSize: '2.5rem',
        opacity: 0.1,
        color: '#8b5cf6'
      }}>
        ✨
      </div>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="mb-4">
          {/* Brand Section */}
          <Col lg={4} className="mb-4">
            <div style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem'
            }}>
              ✨ ShareSpace
            </div>
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '1.1rem', 
              lineHeight: '1.6',
              marginBottom: '1.5rem' 
            }}>
              Creating beautiful wedding galleries where love stories come alive through shared moments.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📸
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                💕
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                💍
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={6} lg={2} className="mb-4">
            <h5 style={{ 
              color: '#f3f4f6', 
              fontSize: '1.2rem', 
              fontWeight: '600',
              marginBottom: '1.5rem' 
            }}>
              💒 For Couples
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link 
                  href="/create-space" 
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ec4899';
                    e.currentTarget.style.paddingLeft = '0.5rem';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  Create Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  href="/public-spaces" 
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b5cf6';
                    e.currentTarget.style.paddingLeft = '0.5rem';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  Browse Galleries
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  href="/signup" 
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#f59e0b';
                    e.currentTarget.style.paddingLeft = '0.5rem';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  Sign Up Free
                </Link>
              </li>
            </ul>
          </Col>

          {/* Support */}
          <Col md={6} lg={2} className="mb-4">
            <h5 style={{ 
              color: '#f3f4f6', 
              fontSize: '1.2rem', 
              fontWeight: '600',
              marginBottom: '1.5rem' 
            }}>
              💝 Support
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link 
                  href="/help" 
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ec4899';
                    e.currentTarget.style.paddingLeft = '0.5rem';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  Help Center
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  href="/faq" 
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b5cf6';
                    e.currentTarget.style.paddingLeft = '0.5rem';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  href="/contact" 
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#f59e0b';
                    e.currentTarget.style.paddingLeft = '0.5rem';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={4} className="mb-4">
            <h5 style={{ 
              color: '#f3f4f6', 
              fontSize: '1.2rem', 
              fontWeight: '600',
              marginBottom: '1.5rem' 
            }}>
              💌 Wedding Tips & Inspiration
            </h5>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Get the latest wedding photography tips and gallery inspiration delivered to your inbox.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="email"
                placeholder="Enter your email..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #6b7280',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
              <button
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Subscribe ✨
              </button>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <Row className="pt-4" style={{ borderTop: '1px solid #4b5563' }}>
          <Col md={6}>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
              &copy; {new Date().getFullYear()} ShareSpace. Made with 💕 for couples everywhere.
            </p>
          </Col>
          <Col md={6} className="text-md-end mt-2 mt-md-0">
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Link 
                href="/privacy" 
                style={{ 
                  color: '#9ca3af', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                style={{ 
                  color: '#9ca3af', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Terms of Service
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}