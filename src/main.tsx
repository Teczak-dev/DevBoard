import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./context/ThemeProvider";
import { ProjectsProvider } from "./context/ProjectsProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProjectsProvider>
          <AppRoutes />
        </ProjectsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
