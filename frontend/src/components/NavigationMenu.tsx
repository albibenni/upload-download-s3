import { CloudUpload, Dashboard, Logout } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface NavigationMenuProps {
  onLogout: () => void;
}

export function NavigationMenu({ onLogout }: NavigationMenuProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    onLogout();
  };

  const menuItems = [
    {
      title: "Upload Files",
      description: "Upload files to secure S3 storage",
      icon: <CloudUpload fontSize="large" />,
      path: "/upload",
      color: "primary",
    },
    {
      title: "Dashboard",
      description: "View and manage your files",
      icon: <Dashboard fontSize="large" />,
      path: "/dashboard",
      color: "secondary",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h2">
          Welcome to your dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid size={{ xs: 12, md: 6 }} key={item.path}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Box sx={{ mb: 2, color: `${item.color}.main` }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                <Button
                  variant="contained"
                  color={item.color as "primary" | "secondary"}
                  onClick={() => navigate(item.path)}
                  fullWidth
                  sx={{ mx: 2 }}
                >
                  Go to {item.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
