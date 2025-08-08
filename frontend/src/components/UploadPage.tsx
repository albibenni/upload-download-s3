import { CloudUpload, ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../api/paths";
import { UploadFileSchema, UploadFormData, UploadSchema } from "../types/types";

export function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<UploadFormData>>({});
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setFilename(file.name);
    }
    setErrors({});
    setUploadStatus({ type: null, message: "" });
  };

  const handleUpload = async () => {
    setErrors({});
    setUploadStatus({ type: null, message: "" });

    if (!selectedFile) {
      setUploadStatus({
        type: "error",
        message: "Please select a file to upload",
      });
      return;
    }

    const result = UploadSchema.safeParse({ filename });
    if (!result.success) {
      const fieldErrors: Partial<UploadFormData> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as keyof UploadFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setUploadStatus({
        type: "error",
        message: "Please log in to upload files",
      });
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(API_PATHS.FILES.UPLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: filename.trim(),
          mimetype: selectedFile.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const presignedUrlData = UploadFileSchema.parse(await response.json());
      await fetch(presignedUrlData.presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      setUploadStatus({
        type: "success",
        message: "File uploaded successfully!",
      });

      // Reset form
      setSelectedFile(null);
      setFilename("");
      setErrors({});

      // Reset file input
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
        </Box>
        
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Upload Files
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Select and upload your files to secure S3 storage
        </Typography>

        <Card sx={{ maxWidth: 600, mx: "auto" }}>
          <CardContent sx={{ p: 4 }}>
            {uploadStatus.type && (
              <Alert severity={uploadStatus.type} sx={{ mb: 3 }}>
                {uploadStatus.message}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <input
                accept="*/*"
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ py: 2, mb: 2 }}
                >
                  Choose File
                </Button>
              </label>

              <TextField
                fullWidth
                label="Filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                sx={{ mb: 2 }}
                error={!!errors.filename}
                helperText={
                  errors.filename ||
                  "This will be the name of your file when stored"
                }
              />

              {selectedFile && (
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 1,
                    bgcolor: "grey.50",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Selected file:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              )}
            </Box>

            {uploading && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Uploading file, please wait...
              </Alert>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !filename.trim() || uploading}
              variant="contained"
              fullWidth
              size="large"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
