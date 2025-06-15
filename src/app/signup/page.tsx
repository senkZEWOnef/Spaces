"use client";

import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Signup error: " + error.message);
    } else {
      alert("Signup successful! Please check your email.");
      router.push("/spaces");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Sign Up</h3>
        <Form onSubmit={handleSignUp}>
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

          <Button type="submit" className="w-100 mb-2">
            Sign Up
          </Button>

          <div className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary">
              Log in
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
