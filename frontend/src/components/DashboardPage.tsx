import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, CloudDownload, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_PATHS } from "../api/paths";

export function DashboardPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");
      console.log("Fetching files with token:", token);

      const response = await fetch(API_PATHS.FILES.LIST, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath: string, filename: string) => {
    console.log("Downloading file:", filePath, filename);

    try {
      const token = localStorage.getItem("access_token");

      // First, get the presigned URL
      const presignedResponse = await fetch(API_PATHS.FILES.DOWNLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      if (!presignedResponse.ok) {
        throw new Error("Failed to get download URL");
      }

      const responseText = await presignedResponse.text();
      console.log("Download response:", responseText);
      
      let presignedUrl;
      try {
        // Try to parse as JSON first
        const jsonResponse = JSON.parse(responseText);
        presignedUrl = jsonResponse.presignedUrl || jsonResponse.url || jsonResponse;
      } catch {
        // If not JSON, treat as plain text URL
        presignedUrl = responseText;
      }

      // Then, download the file using the presigned URL
      const downloadResponse = await fetch(presignedUrl);

      if (!downloadResponse.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download file");
    }
  };

  const handleDelete = async (filePath: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(API_PATHS.FILES.DELETE, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setFiles(files.filter((file) => file !== filePath));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
    }
  };

  const getFilenameFromPath = (filePath: string) => {
    return filePath.split('/').pop() || filePath;
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Container maxWidth="lg">
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

        <Typography variant="h3" component="h1" gutterBottom>
          File Dashboard
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          View and manage your uploaded files here.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : files.length === 0 ? (
          <Box
            sx={{
              p: 4,
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
              textAlign: "center",
              bgcolor: "grey.50",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No Files Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload some files to get started.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/upload")}
              sx={{ mt: 2 }}
            >
              Upload Files
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {files.map((filePath) => (
              <Card key={filePath} variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div">
                        {getFilenameFromPath(filePath)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Path: {filePath}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        startIcon={<CloudDownload />}
                        onClick={() =>
                          handleDownload(filePath, getFilenameFromPath(filePath))
                        }
                        variant="outlined"
                        size="small"
                      >
                        Download
                      </Button>
                      <Button
                        startIcon={<Delete />}
                        onClick={() => handleDelete(filePath)}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
