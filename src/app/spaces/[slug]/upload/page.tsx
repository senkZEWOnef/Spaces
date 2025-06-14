"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
} from "react-bootstrap";
import { useParams } from "next/navigation";

export default function UploadPage() {
  const { slug } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; date: string; uploader: string }[]
  >([]);
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      setSuccessMsg("Please select at least one file.");
      return;
    }

    const now = new Date().toLocaleString();

    const newUploads = files.map((file) => ({
      name: file.name,
      date: now,
      uploader: "Guest",
    }));

    setUploadedFiles((prev) => [...newUploads, ...prev]);
    setSuccessMsg(`Successfully uploaded ${files.length} photo(s)!`);
    setFiles([]);
  };

  return (
    <section className="bg-dark text-white min-vh-100 py-5">
      <Container>
        <h1 className="text-center mb-4">Upload Photos for: {slug}</h1>

        <Form onSubmit={handleUpload} className="bg-secondary p-4 rounded mb-4">
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Select Photo(s)</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
              className="bg-light text-dark"
            />
          </Form.Group>
          <Button
            variant="warning"
            type="submit"
            className="w-100"
            disabled={files.length === 0}
          >
            Upload
          </Button>
        </Form>

        {successMsg && (
          <Alert
            variant="success"
            onClose={() => setSuccessMsg("")}
            dismissible
          >
            {successMsg}
          </Alert>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3">Uploaded Files</h4>
            <Row xs={1} md={2} lg={3} className="g-4">
              {uploadedFiles.map((file, index) => (
                <Col key={index}>
                  <Card className="bg-light text-dark h-100 shadow-sm rounded-0">
                    <Card.Body>
                      <Card.Title>{file.name}</Card.Title>
                      <Card.Text>
                        <strong>Uploader:</strong> {file.uploader}
                        <br />
                        <strong>Uploaded at:</strong> {file.date}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </section>
  );
}
