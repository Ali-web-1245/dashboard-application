import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ACCENT_COLORS = {
  blue: { hex: '#3b82f6', label: 'Blue', class: 'accent-blue' },
  purple: { hex: '#8b5cf6', label: 'Purple', class: 'accent-purple' },
  green: { hex: '#10b981', label: 'Green', class: 'accent-green' },
  orange: { hex: '#f97316', label: 'Orange', class: 'accent-orange' },
  red: { hex: '#ef4444', label: 'Red', class: 'accent-red' },
};

export const ThemeProvider = ({ children }) => {
  // Theme state persisted in localStorage
  const [bgMode, setBgMode] = useState(() => {
    return localStorage.getItem('berry_bg_mode') || 'dark';
  });
  
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('berry_accent_color') || 'purple';
  });

  // Global UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'profile'

  useEffect(() => {
    localStorage.setItem('berry_bg_mode', bgMode);
    document.documentElement.setAttribute('data-theme', bgMode);
  }, [bgMode]);

  useEffect(() => {
    localStorage.setItem('berry_accent_color', accentColor);
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [accentColor]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        bgMode,
        setBgMode,
        accentColor,
        setAccentColor,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isSettingsOpen,
        setIsSettingsOpen,
        toggleSettings,
        currentLanguage,
        setCurrentLanguage,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};