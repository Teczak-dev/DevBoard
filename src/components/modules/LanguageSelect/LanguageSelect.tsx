import React from 'react';
import { FormControl, Select, MenuItem, Chip } from '@mui/material';
import { SUPPORTED_LANGUAGES, POPULAR_LANGUAGES, type LanguageOption } from '../../../shared/constants/languages';

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  autoDetectedLanguage?: string;
  autoDetectedConfidence?: number;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  autoDetectedLanguage,
  autoDetectedConfidence
}) => {
  // Separate popular and other languages
  const popularLanguages = SUPPORTED_LANGUAGES.filter(lang => 
    POPULAR_LANGUAGES.includes(lang.value) || lang.value === 'auto'
  );
  
  const otherLanguages = SUPPORTED_LANGUAGES.filter(lang => 
    !POPULAR_LANGUAGES.includes(lang.value) && lang.value !== 'auto'
  );

  const handleChange = (event: { target: { value: string } }) => {
    onChange(event.target.value);
  };

  const renderLanguageOption = (lang: LanguageOption) => {
    const isAutoDetected = autoDetectedLanguage === lang.value && autoDetectedConfidence && autoDetectedConfidence > 60;
    
    return (
      <MenuItem key={lang.value} value={lang.value}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
          <span>{lang.label}</span>
          {isAutoDetected && (
            <Chip 
              label="Auto-detected" 
              size="small" 
              variant="outlined"
              sx={{ 
                ml: 'auto',
                fontSize: '0.7rem',
                height: '20px',
                color: 'var(--primary)',
                borderColor: 'var(--primary)'
              }}
            />
          )}
        </div>
      </MenuItem>
    );
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        sx={{
          '& .MuiSelect-select': {
            backgroundColor: 'transparent',
            color: 'var(--text)',
            borderRadius: '8px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary)',
            boxShadow: '0 0 0 3px var(--primary-soft)',
          },
          '& .MuiSelect-icon': {
            color: 'var(--muted)',
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              '& .MuiMenuItem-root': {
                backgroundColor: 'transparent',
                color: 'var(--text)',
                fontSize: '0.9rem',
                '&:hover': {
                  backgroundColor: 'var(--hover-bg)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--primary-soft)',
                  color: 'var(--primary)',
                  '&:hover': {
                    backgroundColor: 'var(--primary-soft)',
                  }
                },
                '&.Mui-disabled': {
                  color: 'var(--muted)',
                  opacity: 0.7,
                }
              }
            }
          }
        }}
      >
        {/* Auto-detect option */}
        <MenuItem value="auto">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Auto-detect</span>
            {autoDetectedLanguage && autoDetectedConfidence && (
              <Chip 
                label={`${autoDetectedLanguage} (${Math.round(autoDetectedConfidence)}%)`}
                size="small"
                variant="filled"
                sx={{ 
                  ml: 'auto',
                  fontSize: '0.7rem',
                  height: '20px',
                  backgroundColor: 'var(--primary-soft)',
                  color: 'var(--primary)'
                }}
              />
            )}
          </div>
        </MenuItem>
        
        {/* Separator */}
        <MenuItem disabled sx={{ opacity: 0.5, fontSize: '0.8rem', fontWeight: 'bold' }}>
          Popular Languages
        </MenuItem>
        
        {/* Popular languages */}
        {popularLanguages.filter(lang => lang.value !== 'auto').map(renderLanguageOption)}
        
        {/* Separator */}
        <MenuItem disabled sx={{ opacity: 0.5, fontSize: '0.8rem', fontWeight: 'bold' }}>
          Other Languages
        </MenuItem>
        
        {/* Other languages */}
        {otherLanguages.map(renderLanguageOption)}
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
