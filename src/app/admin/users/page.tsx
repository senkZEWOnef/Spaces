"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container, Table, Button, Spinner } from "react-bootstrap";

interface UserRow {
  id: string;
  email: string;
  role: string | null;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role");
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = (await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId)) as { error: null | { message: string } };

    if (error) {
      console.error("Role update failed:", error.message);
      alert("Role update failed.");
    } else {
      // ✅ Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      alert(`Role updated to ${newRole}!`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <section className="bg-dark text-white py-5 min-vh-100">
      <Container>
        <h1 className="mb-4">Manage Users</h1>
        {loading ? (
          <Spinner animation="border" variant="light" />
        ) : (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role === "admin" ? (
                      <Button
                        variant="warning"
                        onClick={() => handleRoleChange(user.id, "user")}
                      >
                        Demote to User
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => handleRoleChange(user.id, "admin")}
                      >
                        Promote to Admin
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </section>
  );
}
