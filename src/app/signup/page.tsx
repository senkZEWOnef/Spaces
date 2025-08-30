"use client";

import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { error, handleError, showSuccess, clearError } = useErrorHandler();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      handleError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      handleError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    clearError();
    
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }
      
      showSuccess('Account created successfully! Please check your email to verify your account.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      handleError(error, 'Sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center" style={{ backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg border-0 bg-dark text-light" style={{ width: "100%", maxWidth: "400px", border: '1px solid #333' }}>
          <Card.Body className="p-5">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="fw-bold text-light mb-2">Create Account</h2>
              <p className="text-muted">Join ShareSpace and start sharing memories</p>
            </div>

            {/* Error/Success Alert */}
            {error && (
              <Alert 
                variant={error.type === 'info' ? 'success' : error.type === 'warning' ? 'warning' : 'danger'}
                dismissible
                onClose={clearError}
                className="mb-4"
              >
                {error.message}
              </Alert>
            )}

            <Form onSubmit={handleSignUp}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="fw-semibold text-light">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="py-2 bg-secondary border-secondary text-light"
                  style={{ backgroundColor: '#495057 !important', borderColor: '#6c757d', color: '#fff' }}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label className="fw-semibold text-light">Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="py-2 bg-secondary border-secondary text-light"
                    style={{ backgroundColor: '#495057 !important', borderColor: '#6c757d', color: '#fff' }}
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    style={{ borderColor: '#6c757d', color: '#adb5bd' }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Button>
                </InputGroup>
                <Form.Text className="text-muted small">
                  Must be at least 6 characters long
                </Form.Text>
              </Form.Group>

              <Button 
                type="submit" 
                className="w-100 py-2 mb-3 btn-gold" 
                size="lg"
                disabled={isLoading}
                style={{
                  backgroundColor: '#9a8c58',
                  border: 'none',
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted">Already have an account? </span>
                <Link href="/login" className="text-decoration-none fw-semibold text-warning">
                  Sign In
                </Link>
              </div>
              
              <hr className="my-4 border-secondary" />
              
              <div className="text-center">
                <Link href="/" className="text-muted text-decoration-none small">
                  ← Back to Home
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}