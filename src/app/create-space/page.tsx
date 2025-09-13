"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Container, Form, Alert } from "react-bootstrap";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CreateSpacePage() {
  const [name, setName] = useState("");
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cohostEmail, setCohostEmail] = useState("");
  const [isPublic, setIsPublic] = useState(true); // Default to public
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to create a wedding gallery.");
      setLoading(false);
      return;
    }

    const slug = slugify(name);
    let imageUrl = "";

    if (imageFile) {
      // Create safe filename by removing invalid characters and getting extension
      const fileExt = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const fileName = `events/${timestamp}-${randomId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError("Failed to upload image: " + uploadError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: insertedSpaces, error: insertError } = await (supabase as any)
      .from("spaces")
      .insert([
        {
          name,
          slug,
          date,
          description,
          image_url: imageUrl,
          created_by: user.id,
          is_public: isPublic,
        },
      ])
      .select("id")
      .single();

    if (insertError || !insertedSpaces) {
      setError(insertError?.message || "Error inserting space");
      setLoading(false);
      return;
    }

    if (cohostEmail) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: cohostUser, error: userLookupError } = await (supabase as any)
        .from("users")
        .select("id")
        .eq("email", cohostEmail)
        .single();

      if (!userLookupError && cohostUser) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("cohosts").insert({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          space_id: (insertedSpaces as any).id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cohost_id: (cohostUser as any).id,
        });
      }
    }

    setSuccess("Wedding gallery created successfully!");
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <Container style={{ maxWidth: "700px" }}>
        {/* Header */}
        <div className="text-center mb-5">
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ✨💒✨
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#be185d',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(190, 24, 93, 0.1)'
          }}>
            Create Your Wedding Gallery
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            margin: '0'
          }}>
            Your love story deserves a beautiful gallery
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {error && (
            <Alert 
              variant="danger" 
              style={{
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                color: '#dc2626',
                marginBottom: '2rem'
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              variant="success"
              style={{
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                color: '#059669',
                marginBottom: '2rem'
              }}
            >
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Partner Names */}
            <div style={{
              background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid rgba(236, 72, 153, 0.1)'
            }}>
              <h4 style={{
                color: '#be185d',
                fontSize: '1.3rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                💕 The Happy Couple
              </h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#374151', 
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}>
                      Partner 1 Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Sarah"
                      value={partner1Name}
                      onChange={(e) => {
                        setPartner1Name(e.target.value);
                        if (partner2Name) {
                          setName(`${e.target.value} & ${partner2Name}&apos;s Wedding`);
                        }
                      }}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #f3f4f6',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: '#ffffff'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ec4899';
                        e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#f3f4f6';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#374151', 
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}>
                      Partner 2 Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Michael"
                      value={partner2Name}
                      onChange={(e) => {
                        setPartner2Name(e.target.value);
                        if (partner1Name) {
                          setName(`${partner1Name} & ${e.target.value}&apos;s Wedding`);
                        }
                      }}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #f3f4f6',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: '#ffffff'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ec4899';
                        e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#f3f4f6';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            {/* Wedding Details */}
            <Form.Group className="mb-4">
              <Form.Label style={{ 
                color: '#374151', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                📝 Wedding Title
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Sarah & Michael&apos;s Wedding"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3f4f6',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ec4899';
                  e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f3f4f6';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <Form.Text style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Auto-generated from names above, but feel free to customize it ✨
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ 
                color: '#374151', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                📅 Wedding Date
              </Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3f4f6',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ec4899';
                  e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f3f4f6';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ 
                color: '#374151', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                💝 Share Your Story
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Tell your guests about your magical day... where you met, your favorite memories together, what makes your love special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3f4f6',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#ffffff',
                  resize: 'vertical'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ec4899';
                  e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f3f4f6';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ 
                color: '#374151', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                📸 Cover Photo (optional)
              </Form.Label>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
                transition: 'all 0.3s ease'
              }}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setImageFile(target.files?.[0] || null);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '1rem'
                  }}
                />
                <p style={{ 
                  color: '#6b7280', 
                  marginTop: '0.5rem',
                  marginBottom: '0',
                  fontSize: '0.9rem'
                }}>
                  Choose a beautiful photo that represents your special day 💕
                </p>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ 
                color: '#374151', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                👥 Wedding Party Co-Host (optional)
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="maid-of-honor@example.com"
                value={cohostEmail}
                onChange={(e) => setCohostEmail(e.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3f4f6',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ec4899';
                  e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f3f4f6';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <Form.Text style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Add a best friend or family member to help manage your gallery
              </Form.Text>
            </Form.Group>

            {/* Privacy Settings */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <Form.Group>
                <Form.Label style={{ 
                  color: '#1e40af', 
                  fontWeight: '600',
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  🔐 Privacy Settings
                </Form.Label>
                <div className="d-flex flex-column gap-3">
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${isPublic ? '#ec4899' : '#e5e7eb'}`,
                    background: isPublic ? 'rgba(236, 72, 153, 0.05)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      type="radio"
                      name="privacy"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      style={{ 
                        marginRight: '0.75rem',
                        transform: 'scale(1.2)',
                        accentColor: '#ec4899'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                        🌟 Public Gallery
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        Share your joy with the world - appears in featured galleries
                      </div>
                    </div>
                  </label>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${!isPublic ? '#ec4899' : '#e5e7eb'}`,
                    background: !isPublic ? 'rgba(236, 72, 153, 0.05)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      type="radio"
                      name="privacy"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      style={{ 
                        marginRight: '0.75rem',
                        transform: 'scale(1.2)',
                        accentColor: '#ec4899'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                        🔒 Private Gallery
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        Keep it intimate - only you and your wedding party can view
                      </div>
                    </div>
                  </label>
                </div>
              </Form.Group>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading 
                    ? 'linear-gradient(45deg, #d1d5db, #9ca3af)' 
                    : 'linear-gradient(45deg, #ec4899, #8b5cf6)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1rem 3rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
                  minWidth: '250px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Creating Your Gallery...
                  </>
                ) : (
                  <>✨ Create Wedding Gallery ✨</>
                )}
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}
