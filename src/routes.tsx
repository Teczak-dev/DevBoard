import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import SnippetsPage from "./pages/SnippetsPage";
import MarkdownPage from "./pages/MarkdownPage";
import TODOPage from "./pages/TODOPage";
import ProjectPage from "./pages/ProjectPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />} errorElement={<div>Error</div>}>
        <Route index element={<DashboardPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/markdown-editor" element={<MarkdownPage />} />
        <Route path="/projects-todo" element={<TODOPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
