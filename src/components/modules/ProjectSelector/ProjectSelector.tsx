import React, { useState } from 'react';
import { FormControl, Select, MenuItem, Button, IconButton } from '@mui/material';
import { useSnippetProjectRelations } from '../../../shared/hooks/useSnippetProjectRelations';
import styles from './ProjectSelector.module.css';

interface ProjectSelectorProps {
  snippetId: number;
  onClose?: () => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  snippetId, 
  onClose 
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const {
    getProjectsForSnippet,
    getAvailableProjectsForSnippet,
    addSnippetToProject,
    removeSnippetFromProject
  } = useSnippetProjectRelations();
  
  const currentProjects = getProjectsForSnippet(snippetId);
  const availableProjects = getAvailableProjectsForSnippet(snippetId);

  const handleAddProject = async () => {
    if (selectedProjectId && typeof selectedProjectId === 'number') {
      try {
        await addSnippetToProject(snippetId, selectedProjectId);
        setSelectedProjectId('');
      } catch (error) {
        console.error("Failed to add snippet to project:", error);
      }
    }
  };

  const handleRemoveProject = async (projectId: number) => {
    try {
      await removeSnippetFromProject(snippetId, projectId);
    } catch (error) {
      console.error("Failed to remove snippet from project:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>Manage Projects</h4>
        {onClose && (
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ color: 'var(--muted)' }}
          >
            ✕
          </IconButton>
        )}
      </div>

      {/* Current Projects */}
      {currentProjects.length > 0 && (
        <div className={styles.section}>
          <h5 className={styles.sectionTitle}>Current Projects</h5>
          <div className={styles.projectList}>
            {currentProjects.map(project => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectInfo}>
                  <span className={`${styles.projectName} ${project.status === 'active' ? styles.active : styles.inactive}`}>
                    {project.title}
                  </span>
                  <span className={styles.projectStatus}>
                    {project.status}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveProject(project.id)}
                  className={styles.removeButton}
                  title="Remove from project"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Project */}
      {availableProjects.length > 0 && (
        <div className={styles.section}>
          <h5 className={styles.sectionTitle}>Add to Project</h5>
          <div className={styles.addSection}>
            <FormControl size="small" className={styles.select}>
              <Select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value as number)}
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--primary)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--primary)',
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      '& .MuiMenuItem-root': {
                        color: 'var(--text)',
                        '&:hover': {
                          backgroundColor: 'var(--hover-bg)',
                        },
                      }
                    }
                  }
                }}
              >
                <MenuItem value="">Select a project...</MenuItem>
                {availableProjects.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    <div className={styles.menuItemContent}>
                      <span>{project.title}</span>
                      <span className={`${styles.menuStatus} ${project.status === 'active' ? styles.active : styles.inactive}`}>
                        {project.status}
                      </span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={handleAddProject}
              disabled={!selectedProjectId}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--accent)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'var(--muted)',
                  opacity: 0.6,
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {availableProjects.length === 0 && currentProjects.length === 0 && (
        <div className={styles.emptyState}>
          <p>No projects available. Create a project first to organize your snippets.</p>
        </div>
      )}

      {availableProjects.length === 0 && currentProjects.length > 0 && (
        <div className={styles.emptyState}>
          <p>This snippet is in all available projects.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;