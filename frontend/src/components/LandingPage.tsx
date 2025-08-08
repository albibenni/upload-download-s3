import { Box, Container, Typography, Paper, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { NavigationMenu } from "./NavigationMenu";

export function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
        <Container maxWidth="lg">
          <NavigationMenu onLogout={handleLogout} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", mb: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom color="primary">
            Upload & Download S3
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            Securely manage your files in the cloud
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Upload, download, and manage your files with our secure S3-powered
            platform. Sign in to get started with your file management
            dashboard.
          </Typography>
        </Paper>

        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ pr: { md: 4 } }}>
              <Typography variant="h4" gutterBottom>
                Features
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  🔒 Secure Storage
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your files are stored securely in AWS S3 with enterprise-grade
                  encryption.
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ⚡ Fast Upload/Download
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Optimized for speed with direct S3 integration and efficient
                  file handling.
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📱 Easy Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Intuitive interface for organizing, sharing, and managing your
                  files.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
