import { Box, Container, Typography, Button, Card, CardContent, CircularProgress, Alert } from "@mui/material";
import { ArrowBack, CloudDownload, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_PATHS } from "../api/paths";

interface FileItem {
  id: string;
  filename: string;
  size: number;
  uploadedAt: string;
  contentType?: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      console.log("Fetching files with token:", token);
      
      const response = await fetch(API_PATHS.FILES.LIST, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status}`);
      }

      const data = await response.json();
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_PATHS.FILES.DOWNLOAD(fileId), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file');
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_PATHS.FILES.DELETE(fileId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setFiles(files.filter(file => file.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : files.length === 0 ? (
          <Box sx={{ 
            p: 4, 
            border: "2px dashed", 
            borderColor: "grey.300",
            borderRadius: 2,
            textAlign: "center",
            bgcolor: "grey.50"
          }}>
            <Typography variant="h6" gutterBottom>
              No Files Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload some files to get started.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/upload')}
              sx={{ mt: 2 }}
            >
              Upload Files
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {files.map((file) => (
              <Card key={file.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div">
                        {file.filename}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {formatFileSize(file.size)} • Uploaded: {formatDate(file.uploadedAt)}
                      </Typography>
                      {file.contentType && (
                        <Typography variant="body2" color="text.secondary">
                          Type: {file.contentType}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<CloudDownload />}
                        onClick={() => handleDownload(file.id, file.filename)}
                        variant="outlined"
                        size="small"
                      >
                        Download
                      </Button>
                      <Button
                        startIcon={<Delete />}
                        onClick={() => handleDelete(file.id)}
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