import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import SnippetsPage from "./pages/SnippetsPage";
import MarkdownPage from "./pages/MarkdownPage";
import TODOPage from "./pages/TODOPage";
import ProjectPage from "./pages/ProjectPage";
import AddProject from "./pages/AddProject";

/**
 * DevBoard - Application routing configuration
 *
 * This component defines all routes available in the application
 * and maps them to corresponding page components.
 *
 * Routing structure:
 * - "/" - main page (Dashboard) with application layout
 * - "/add-project" - new project creation form
 * - "/project/:id" - specific project details (dynamic ID)
 * - "/snippets" - code snippet management
 * - "/markdown-editor" - Markdown document editor
 * - "/projects-todo" - project task list
 *
 * All pages use shared layout (AppLayout) which contains:
 * - Side navigation
 * - Application header
 * - Main content area
 */

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main route with application layout */}
      <Route
        path="/"
        element={<AppLayout />}
        errorElement={<div>An error occurred while loading the page</div>}
      >
        {/* Home page - Dashboard with project overview */}
        <Route index element={<DashboardPage />} />

        {/* New project creation form */}
        <Route path="add-project" element={<AddProject />} />

        {/* Specific project details - :id is dynamic parameter */}
        <Route path="/project/:id" element={<ProjectPage />} />

        {/* Code snippet management */}
        <Route path="/snippets" element={<SnippetsPage />} />

        {/* Markdown document editor */}
        <Route path="/markdown-editor" element={<MarkdownPage />} />

        {/* Project task list */}
        <Route path="/projects-todo" element={<TODOPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
