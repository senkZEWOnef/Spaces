"use client";

import { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/SessionContext";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (sessionLoading) return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    setUser(session.user);
    setEmail(session.user.email || "");
    setFullName(session.user.user_metadata?.full_name || "");
  }, [session, sessionLoading, router]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({text, type});
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      
      showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage(error instanceof Error ? error.message : 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      showMessage('Failed to sign out', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <section className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  if (!session || !user) {
    return (
      <section className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h3>Please log in to view your profile</h3>
          <Button variant="primary" onClick={() => router.push('/login')} className="mt-3">
            Go to Login
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-vh-100 py-5" style={{backgroundColor: '#f8f9fa'}}>
      <Container style={{ maxWidth: "800px" }}>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '80px', height: '80px', fontSize: '32px'}}>
                {(fullName || email).charAt(0).toUpperCase()}
              </div>
              <h1 className="h2 mb-2">My Profile</h1>
              <p className="text-muted">Manage your account settings and preferences</p>
            </div>

            {message && (
              <Alert 
                variant={message.type === 'success' ? 'success' : 'danger'}
                dismissible
                onClose={() => setMessage(null)}
                className="mb-4"
              >
                {message.text}
              </Alert>
            )}

            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h5 className="card-title mb-4">Profile Information</h5>
                
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      disabled
                      className="bg-light"
                    />
                    <Form.Text className="text-muted">
                      Email cannot be changed from this page
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>

                  <div className="d-flex gap-3">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline-danger"
                      onClick={handleSignOut}
                      disabled={loading}
                    >
                      Sign Out
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mt-4">
              <Card.Body className="p-4">
                <h5 className="card-title mb-3">Account Information</h5>
                <Row className="g-3">
                  <Col md={6}>
                    <div>
                      <small className="text-muted d-block">User ID</small>
                      <code className="small">{user.id}</code>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <small className="text-muted d-block">Account Created</small>
                      <span className="small">
                        {new Date(user.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <small className="text-muted d-block">Last Sign In</small>
                      <span className="small">
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <small className="text-muted d-block">Email Confirmed</small>
                      <span className={`badge ${user.email_confirmed_at ? 'bg-success' : 'bg-warning'}`}>
                        {user.email_confirmed_at ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}