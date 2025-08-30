"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Container, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import Link from "next/link";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const { error, handleError, showSuccess, clearError } = useErrorHandler();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.replace('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkUser();
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      handleError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    clearError();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }
      
      if (data.user) {
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      handleError(error, 'Login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />;
  }

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center" style={{ backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg border-0 bg-dark text-light" style={{ width: "100%", maxWidth: "400px", border: '1px solid #333' }}>
          <Card.Body className="p-5">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="fw-bold text-light mb-2">Welcome Back</h2>
              <p className="text-muted">Sign in to your ShareSpace account</p>
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

            <Form onSubmit={handleSignIn}>
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
                    placeholder="Enter your password"
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
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted">Don&apos;t have an account? </span>
                <Link href="/signup" className="text-decoration-none fw-semibold text-warning">
                  Create Account
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