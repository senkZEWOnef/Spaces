"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Card,
  ProgressBar,
} from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function UploadPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [spaceExists, setSpaceExists] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push('/login');
        return;
      }
    };
    
    const checkSpace = async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('id')
        .eq('slug', String(slug))
        .single();
        
      if (error || !data) {
        setSpaceExists(false);
      }
    };
    
    getUser();
    checkSpace();
  }, [slug, router]);

  const showMessage = useCallback((text: string, type: 'success' | 'error') => {
    setMessage({text, type});
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const validFiles: UploadFile[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    Array.from(fileList).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        showMessage(`${file.name} is not a supported image format`, 'error');
        return;
      }
      
      if (file.size > maxSize) {
        showMessage(`${file.name} is too large (max 10MB)`, 'error');
        return;
      }
      
      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'pending'
      });
    });
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  }, [showMessage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index]?.preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const handleUpload = async () => {
    if (!user || files.length === 0 || isUploading) return;
    
    setIsUploading(true);
    let successCount = 0;
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    // Get space ID once
    let spaceId: string;
    try {
      const { data: spaceData, error: spaceError } = await supabase
        .from('spaces')
        .select('id')
        .eq('slug', String(slug))
        .single();
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (spaceError || !(spaceData as any)?.id) {
        throw new Error('Space not found');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spaceId = (spaceData as any).id;
    } catch (error) {
      console.error('Space lookup error:', error);
      showMessage('Could not find the space. Please try again.', 'error');
      setIsUploading(false);
      return;
    }
    
    // Process files one by one
    for (let i = 0; i < files.length; i++) {
      const uploadFile = files[i];
      if (uploadFile.status !== 'pending') continue;
      
      try {
        // Update status to uploading
        setFiles(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], status: 'uploading', progress: 10 };
          return updated;
        });
        
        // Create unique filename
        const fileExt = uploadFile.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `spaces/${slug}/${fileName}`;
        
        // Update progress
        setFiles(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], progress: 30 };
          return updated;
        });
        
        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, uploadFile.file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        
        // Update progress
        setFiles(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], progress: 70 };
          return updated;
        });
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);
        
        // Update progress
        setFiles(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], progress: 90 };
          return updated;
        });

        // Save photo record to database
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbError } = await (supabase as any)
          .from('photos')
          .insert({
            space_id: spaceId,
            url: publicUrl,
            filename: uploadFile.file.name,
            uploader_id: user.id,
            is_approved: false
          });
          
        if (dbError) {
          console.error('Database insert error:', dbError);
          throw new Error(`Database error: ${dbError.message}`);
        }
        
        // Mark as success
        setFiles(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], status: 'success', progress: 100 };
          return updated;
        });
        
        successCount++;
        
        // Small delay between uploads to prevent overwhelming
        if (i < pendingFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error: unknown) {
        console.error('Upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setFiles(prev => {
          const updated = [...prev];
          updated[i] = { 
            ...updated[i], 
            status: 'error', 
            error: errorMessage
          };
          return updated;
        });
      }
    }
    
    setIsUploading(false);
    
    if (successCount > 0) {
      showMessage(`Successfully uploaded ${successCount} photo(s)! They will appear after moderation.`, 'success');
      // Clean up successful uploads after a delay
      setTimeout(() => {
        setFiles(prev => prev.filter(f => f.status !== 'success'));
      }, 3000);
    } else if (pendingFiles.length > 0) {
      showMessage('All uploads failed. Please check your internet connection and try again.', 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h3>Please log in to upload photos</h3>
          <Link href="/login" className="btn btn-primary mt-3">Login</Link>
        </div>
      </div>
    );
  }
  
  if (!spaceExists) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h3>Space not found</h3>
          <Link href="/" className="btn btn-primary mt-3">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-vh-100 py-5" style={{backgroundColor: '#f8f9fa'}}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark mb-3">Share Your Memories</h1>
          <p className="lead text-muted">Upload photos to the <strong>{slug}</strong> space</p>
          <Link href={`/spaces/${slug}`} className="btn btn-outline-primary">
            ← Back to Gallery
          </Link>
        </div>

        {/* Message Alert */}
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

        {/* Upload Area */}
        <Card className="shadow-sm mb-4">
          <Card.Body className="p-4">
            <div 
              className={`upload-area p-5 border-2 border-dashed rounded-3 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{ minHeight: '200px', cursor: 'pointer' }}
            >
              <div className="mb-3">
                <i className="bi bi-cloud-upload display-1 text-muted"></i>
              </div>
              <h4 className="mb-3">Drag & drop your photos here</h4>
              <p className="text-muted mb-4">or click to browse your files</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="position-absolute w-100 h-100 opacity-0"
                style={{ top: 0, left: 0, cursor: 'pointer' }}
              />
              <Button variant="primary" size="lg">
                Choose Files
              </Button>
              <div className="mt-3 small text-muted">
                Supports: JPG, PNG, WebP, GIF (Max 10MB each)
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* File Preview */}
        {files.length > 0 && (
          <Card className="shadow-sm mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Selected Photos ({files.length})</h5>
              <Button 
                variant="primary" 
                onClick={handleUpload}
                disabled={isUploading || files.every(f => f.status !== 'pending')}
              >
                {isUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Uploading...
                  </>
                ) : (
                  'Upload All'
                )}
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {files.map((uploadFile, index) => (
                  <Col key={index} md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <div className="position-relative">
                        <div 
                          className="card-img-top"
                          style={{ 
                            height: '200px', 
                            backgroundImage: `url(${uploadFile.preview})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        {uploadFile.status === 'pending' && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-2"
                            onClick={() => removeFile(index)}
                          >
                            ×
                          </Button>
                        )}
                        {uploadFile.status === 'success' && (
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-success">✓</span>
                          </div>
                        )}
                        {uploadFile.status === 'error' && (
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-danger">✗</span>
                          </div>
                        )}
                      </div>
                      <Card.Body>
                        <Card.Title className="small text-truncate">
                          {uploadFile.file.name}
                        </Card.Title>
                        <div className="small text-muted mb-2">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                        
                        {uploadFile.status === 'uploading' && (
                          <ProgressBar 
                            now={uploadFile.progress} 
                            label={`${uploadFile.progress}%`}
                            className="mb-2"
                          />
                        )}
                        
                        {uploadFile.status === 'error' && uploadFile.error && (
                          <div className="small text-danger">{uploadFile.error}</div>
                        )}
                        
                        {uploadFile.status === 'success' && (
                          <div className="small text-success">Upload complete!</div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}
        
        {/* Info Card */}
        <Card className="border-0 bg-light">
          <Card.Body className="text-center py-4">
            <h5 className="text-primary mb-3">📸 Photo Guidelines</h5>
            <Row className="g-3">
              <Col md={4}>
                <div className="h6 mb-2">Quality</div>
                <div className="small text-muted">Upload high-resolution photos for the best experience</div>
              </Col>
              <Col md={4}>
                <div className="h6 mb-2">Moderation</div>
                <div className="small text-muted">All photos are reviewed before appearing in the gallery</div>
              </Col>
              <Col md={4}>
                <div className="h6 mb-2">Privacy</div>
                <div className="small text-muted">Only approved photos will be visible to other guests</div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}
