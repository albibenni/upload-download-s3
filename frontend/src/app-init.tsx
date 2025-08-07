import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import theme from "./theme";
import { LandingPage } from "./components/LandingPage";

function App() {
  const handleLogin = async (username: string, password: string) => {
    console.log("Login attempt:", { username, password });
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LandingPage onLogin={handleLogin} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
