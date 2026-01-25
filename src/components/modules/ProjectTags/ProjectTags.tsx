import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnippetProjectRelations } from '../../../shared/hooks/useSnippetProjectRelations';
import styles from './ProjectTags.module.css';

interface ProjectTagsProps {
  snippetId: number;
  maxVisible?: number;
}

const ProjectTags: React.FC<ProjectTagsProps> = ({ 
  snippetId, 
  maxVisible = 3 
}) => {
  const navigate = useNavigate();
  const { getProjectsForSnippet } = useSnippetProjectRelations();
  
  const projects = getProjectsForSnippet(snippetId);
  
  if (projects.length === 0) return null;

  const visibleProjects = projects.slice(0, maxVisible);
  const remainingCount = projects.length - maxVisible;

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className={styles.projectTags}>
      <span className={styles.label}>Projects:</span>
      <div className={styles.tags}>
        {visibleProjects.map(project => (
          <button
            key={project.id}
            className={`${styles.projectTag} ${project.status === 'active' ? styles.active : styles.inactive}`}
            onClick={() => handleProjectClick(project.id)}
            title={`Go to ${project.title} project`}
          >
            {project.title}
          </button>
        ))}
        {remainingCount > 0 && (
          <span className={styles.moreCount} title={`${remainingCount} more projects`}>
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectTags;