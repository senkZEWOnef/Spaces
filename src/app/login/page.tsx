"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Container, Card, Form, Button } from "react-bootstrap";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
      console.error("Login error:", error);
    } else {
      console.log("Login success:", data.session);
      alert("Login successful!");
      router.push("/dashboard");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Log In</h3>
        <Form onSubmit={handleSignIn}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-2" variant="dark">
            Log In
          </Button>

          <div className="text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-primary">
              Sign up
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
