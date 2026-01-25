import mainStyles from "../styles/Pages/MainPages.module.css";
import styles from "../styles/Pages/SnippetsPage.module.css";
import { useSnippets } from "../shared/hooks/useSnippets";
import { useProjects } from "../shared/hooks/useProjects";
import { useSnippetProjectRelations } from "../shared/hooks/useSnippetProjectRelations";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { FormControl, Select, MenuItem } from '@mui/material';
import SnippetCard from "../components/modules/SnippetCard/SnippetCard";
import { SUPPORTED_LANGUAGES } from "../shared/constants/languages";
import { SnippetExpandContext } from "../shared/contexts/SnippetExpandContext";

const SnippetsPage = () => {
  const { snippets } = useSnippets();
  const { projects } = useProjects();
  const { getProjectsForSnippet } = useSnippetProjectRelations();
  const navigate = useNavigate();
  
  const [filterType, setFilterType] = useState<'all' | 'language' | 'project'>('all');
  const [filterValue, setFilterValue] = useState<string>('');
  const [expandedSnippets, setExpandedSnippets] = useState<Set<number>>(new Set());

  // Get unique languages and projects from snippets
  const availableLanguages = useMemo(() => {
    const languages = [...new Set(snippets.map(s => s.language))];
    return languages.sort();
  }, [snippets]);

  const availableProjects = useMemo(() => {
    const projectIds = new Set<number>();
    snippets.forEach(snippet => {
      const snippetProjects = getProjectsForSnippet(snippet.id);
      snippetProjects.forEach(project => projectIds.add(project.id));
    });
    return projects.filter(p => projectIds.has(p.id)).sort((a, b) => a.title.localeCompare(b.title));
  }, [snippets, projects, getProjectsForSnippet]);

  // Filter snippets based on current filter
  const filteredSnippets = useMemo(() => {
    if (filterType === 'all' || !filterValue) return snippets;
    
    if (filterType === 'language') {
      return snippets.filter(snippet => snippet.language === filterValue);
    }
    
    if (filterType === 'project') {
      const projectId = parseInt(filterValue);
      return snippets.filter(snippet => {
        const snippetProjects = getProjectsForSnippet(snippet.id);
        return snippetProjects.some(p => p.id === projectId);
      });
    }
    
    return snippets;
  }, [snippets, filterType, filterValue, getProjectsForSnippet]);

  const handleFilterTypeChange = (value: 'all' | 'language' | 'project') => {
    setFilterType(value);
    setFilterValue('');
  };

  const handleExpandAll = () => {
    const allIds = new Set(filteredSnippets.map(s => s.id));
    setExpandedSnippets(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedSnippets(new Set());
  };

  const getLanguageLabel = (language: string) => {
    const langOption = SUPPORTED_LANGUAGES.find(l => l.value === language);
    return langOption?.label || language;
  };

  return (
    <SnippetExpandContext.Provider value={{ expandedSnippets, setExpandedSnippets }}>
      <div className={mainStyles.container}>
        <div className={mainStyles.title}>
          <h1>Snippets</h1>
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => navigate("/add-snippet")}
            >
              Create Snippet
            </button>
          </div>
        </div>
        
        <p className={mainStyles.description}>
          {filteredSnippets.length} of {snippets.length} snippets
          {filterType !== 'all' && filterValue && (
            <span> • Filtered by {filterType}: {
              filterType === 'language' ? getLanguageLabel(filterValue) :
              filterType === 'project' ? projects.find(p => p.id === parseInt(filterValue))?.title :
              filterValue
            }</span>
          )}
        </p>

        {/* Filters and Controls */}
        <div className={styles.controls}>
          <div className={styles.filters}>
            <FormControl size="small" className={styles.filterControl}>
              <Select
                value={filterType}
                onChange={(e) => handleFilterTypeChange(e.target.value as 'all' | 'language' | 'project')}
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
                  }
                }}
              >
                <MenuItem value="all">All Snippets</MenuItem>
                <MenuItem value="language">By Language</MenuItem>
                <MenuItem value="project">By Project</MenuItem>
              </Select>
            </FormControl>

            {filterType === 'language' && (
              <FormControl size="small" className={styles.filterControl}>
                <Select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border)',
                    }
                  }}
                >
                  <MenuItem value="">Select Language</MenuItem>
                  {availableLanguages.map(lang => (
                    <MenuItem key={lang} value={lang}>
                      {getLanguageLabel(lang)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {filterType === 'project' && (
              <FormControl size="small" className={styles.filterControl}>
                <Select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border)',
                    }
                  }}
                >
                  <MenuItem value="">Select Project</MenuItem>
                  {availableProjects.map(project => (
                    <MenuItem key={project.id} value={project.id.toString()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{project.title}</span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: project.status === 'active' ? '#4caf50' : 'var(--muted)',
                          textTransform: 'capitalize'
                        }}>
                          {project.status}
                        </span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {filterType !== 'all' && filterValue && (
              <button
                className={styles.clearFilter}
                onClick={() => setFilterValue('')}
                title="Clear filter"
              >
                Clear
              </button>
            )}
          </div>

          {filteredSnippets.length > 0 && (
            <div className={styles.expandControls}>
              <button
                className={styles.expandButton}
                onClick={handleExpandAll}
              >
                Expand All
              </button>
              <button
                className={styles.expandButton}
                onClick={handleCollapseAll}
              >
                Collapse All
              </button>
            </div>
          )}
        </div>

        <div className={styles.content}>
          {filteredSnippets.length === 0 ? (
            filterType === 'all' ? (
              <p className={mainStyles.description}>
                No snippets created yet.
                <br />
                Create one now by clicking the Create Snippet button.
              </p>
            ) : (
              <div className={styles.noResults}>
                <p>No snippets found for the selected filter.</p>
                <button 
                  className={styles.clearFilter}
                  onClick={() => {
                    setFilterType('all');
                    setFilterValue('');
                  }}
                >
                  Show All Snippets
                </button>
              </div>
            )
          ) : (
            filteredSnippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))
          )}
        </div>
      </div>
    </SnippetExpandContext.Provider>
  );
};

export default SnippetsPage;
