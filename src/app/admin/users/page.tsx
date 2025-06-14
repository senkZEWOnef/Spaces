"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/SessionContext";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";

type UserRow = {
  id: string;
  email: string;
  role: string; // force string only
};

export default function ManageUsersPage() {
  const { session, loading: sessionLoading } = useSession();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) return;

    const loadUsers = async () => {
      setLoading(true);

      const { data: me, error: meError } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (meError || me?.role !== "admin") {
        setAlert("Unauthorized: Admins only");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, email, role");

      if (error) {
        setAlert(`Error loading users: ${error.message}`);
      } else {
        const cleanUsers: UserRow[] = (data ?? []).map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role ?? "user", // force non-null
        }));
        setUsers(cleanUsers);
      }
      setLoading(false);
    };

    loadUsers();
  }, [session, sessionLoading]);

  const toggleRole = async (user: UserRow) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", user.id);

    if (error) {
      setAlert(`Failed to update role: ${error.message}`);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      setAlert(`Updated ${user.email} to ${newRole}`);
    }
  };

  if (sessionLoading || loading) {
    return (
      <section className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="light" />
      </section>
    );
  }

  if (alert) {
    return (
      <Container className="mt-5">
        <Alert variant="info" onClose={() => setAlert("")} dismissible>
          {alert}
        </Alert>
      </Container>
    );
  }

  return (
    <section className="bg-dark text-white py-5 min-vh-100">
      <Container>
        <h1 className="mb-4">Manage Users</h1>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <Button
                    variant={u.role === "admin" ? "danger" : "success"}
                    size="sm"
                    onClick={() => toggleRole(u)}
                  >
                    {u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </section>
  );
}
