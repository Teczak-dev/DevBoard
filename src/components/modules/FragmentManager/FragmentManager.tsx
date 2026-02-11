/**
 * FragmentManager - Component for managing markdown fragments
 * 
 * Features:
 * - Display fragments by category
 * - Create new custom fragments
 * - Edit existing fragments
 * - Delete custom fragments (built-in protected)
 * - Search and filter functionality
 */

import React, { useState, useCallback } from "react";
import styles from "./FragmentManager.module.css";
import { useFragments } from "../../../shared/hooks/useFragments";
import { FRAGMENT_CATEGORIES, type MarkdownFragment } from "../../../shared/types/fragment";

interface FragmentManagerProps {
  /** Callback when a fragment is selected for insertion */
  onFragmentSelect?: (fragment: MarkdownFragment) => void;
  
  /** Show compact view for sidebar */
  compact?: boolean;
  
  /** Height of the component */
  height?: string;
  
  /** Display mode for the fragment manager */
  mode?: 'readonly' | 'manage' | 'mixed';
}

interface FragmentFormData {
  name: string;
  content: string;
  description: string;
  category: MarkdownFragment['category'];
}

export const FragmentManager: React.FC<FragmentManagerProps> = ({
  onFragmentSelect,
  compact = false,
  height = "400px",
  mode = "mixed",
}) => {
  const { 
    fragments, 
    addFragment, 
    updateFragment, 
    deleteFragment,
    getFragmentsByCategory 
  } = useFragments();

  const [selectedCategory, setSelectedCategory] = useState<MarkdownFragment['category'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingFragment, setEditingFragment] = useState<MarkdownFragment | null>(null);
  const [formData, setFormData] = useState<FragmentFormData>({
    name: '',
    content: '',
    description: '',
    category: 'custom',
  });

  // Filter fragments based on search and category
  const filteredFragments = React.useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? fragments 
      : getFragmentsByCategory(selectedCategory);

    if (searchTerm) {
      filtered = filtered.filter(fragment =>
        fragment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fragment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fragment.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [fragments, selectedCategory, searchTerm, getFragmentsByCategory]);

  // Separate built-in (ready) and custom fragments
  const builtInFragments = filteredFragments.filter(f => f.isBuiltIn);
  const customFragments = filteredFragments.filter(f => !f.isBuiltIn);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      content: '',
      description: '',
      category: 'custom',
    });
    setIsCreating(false);
    setEditingFragment(null);
  }, []);

  /**
   * Handle form submission for creating/editing fragments
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      alert('Name and content are required');
      return;
    }

    try {
      if (editingFragment) {
        // Update existing fragment
        await updateFragment(editingFragment.id, {
          name: formData.name.trim(),
          content: formData.content,
          description: formData.description.trim() || undefined,
          category: formData.category,
        });
      } else {
        // Create new fragment
        await addFragment({
          name: formData.name.trim(),
          content: formData.content,
          description: formData.description.trim() || undefined,
          category: formData.category,
          isBuiltIn: false,
        });
      }

      resetForm();
    } catch (error) {
      console.error('Failed to save fragment:', error);
      alert('Failed to save fragment. Please try again.');
    }
  }, [formData, editingFragment, addFragment, updateFragment, resetForm]);

  /**
   * Start editing a fragment
   */
  const startEdit = useCallback((fragment: MarkdownFragment) => {
    if (fragment.isBuiltIn) return; // Cannot edit built-in fragments
    
    setFormData({
      name: fragment.name,
      content: fragment.content,
      description: fragment.description || '',
      category: fragment.category,
    });
    setEditingFragment(fragment);
    setIsCreating(true);
  }, []);

  /**
   * Delete a fragment with confirmation
   */
  const handleDelete = useCallback(async (fragment: MarkdownFragment) => {
    if (fragment.isBuiltIn) {
      alert('Cannot delete built-in fragments');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${fragment.name}"?`
    );

    if (confirmed) {
      try {
        await deleteFragment(fragment.id);
      } catch (error) {
        console.error('Failed to delete fragment:', error);
        alert('Failed to delete fragment. Please try again.');
      }
    }
  }, [deleteFragment]);

  /**
   * Render fragment list section
   */
  const renderFragmentList = (fragments: MarkdownFragment[], title: string, isBuiltIn: boolean = false) => (
    <div className={styles.fragmentSection}>
      <div className={styles.sectionHeader}>
        <h4>{title}</h4>
        <span className={styles.fragmentCount}>{fragments.length}</span>
      </div>
      <div className={styles.fragmentList}>
        {fragments.length > 0 ? (
          fragments.map((fragment) => (
            <div
              key={fragment.id}
              className={`${styles.fragmentItem} ${compact ? styles.compact : ''} ${isBuiltIn ? styles.builtIn : styles.custom}`}
            >
              <div className={styles.fragmentHeader}>
                <span className={styles.fragmentName}>{fragment.name}</span>
                <span className={styles.fragmentCategory}>
                  {FRAGMENT_CATEGORIES[fragment.category]}
                </span>
              </div>
              
              {!compact && fragment.description && (
                <p className={styles.fragmentDescription}>{fragment.description}</p>
              )}
              
              <div className={styles.fragmentPreview}>
                <code>{fragment.preview || fragment.content.substring(0, 60)}...</code>
              </div>
              
              <div className={styles.fragmentActions}>
                {onFragmentSelect && (
                  <button
                    onClick={() => onFragmentSelect(fragment)}
                    className={styles.useButton}
                    title="Insert fragment"
                  >
                    Use
                  </button>
                )}
                
                {!fragment.isBuiltIn && (
                  <>
                    <button
                      onClick={() => startEdit(fragment)}
                      className={styles.editButton}
                      title="Edit fragment"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fragment)}
                      className={styles.deleteButton}
                      title="Delete fragment"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No {title.toLowerCase()} found</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container} style={{ height }}>
      {/* Header */}
      <div className={styles.header}>
        <h3>Fragments</h3>
        {(mode === 'manage' || mode === 'mixed') && (
          <button
            className={styles.addButton}
            onClick={() => setIsCreating(!isCreating)}
            title="Add new fragment"
          >
            {isCreating ? '✕' : '+'}
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(mode === 'manage' || mode === 'mixed') && isCreating && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Fragment name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={styles.input}
            required
          />
          
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as MarkdownFragment['category'] }))}
            className={styles.select}
          >
            {Object.entries(FRAGMENT_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Markdown content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className={styles.textarea}
            rows={4}
            required
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={styles.input}
          />

          <div className={styles.formButtons}>
            <button type="submit" className={styles.saveButton}>
              {editingFragment ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      {!compact && (
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search fragments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MarkdownFragment['category'] | 'all')}
            className={styles.categorySelect}
          >
            <option value="all">All Categories</option>
            {Object.entries(FRAGMENT_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Fragment Lists */}
      <div className={styles.fragmentLists}>
        {/* Built-in (Ready) Fragments */}
        {renderFragmentList(builtInFragments, "Ready Fragments", true)}
        
        {/* Custom Fragments */}
        {(mode === 'manage' || mode === 'mixed') && renderFragmentList(customFragments, "Custom Fragments", false)}
        
        {/* Show search results message */}
        {filteredFragments.length === 0 && searchTerm && (
          <div className={styles.emptyState}>
            <p>No fragments found matching "{searchTerm}"</p>
            <button onClick={() => setSearchTerm('')} className={styles.clearButton}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};