import React, { useEffect, useRef } from 'react';
import { useTheme, ACCENT_COLORS } from '../../context/ThemeContext';
import { FiX, FiCheck, FiSettings } from 'react-icons/fi';
import './settings.css';

export const Settings = () => {
  const { 
    isSettingsOpen, 
    toggleSettings, 
    bgMode, 
    setBgMode, 
    accentColor, 
    setAccentColor 
  } = useTheme();

  const drawerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isSettingsOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        toggleSettings();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSettingsOpen, toggleSettings]);

  return (
    <>
      {/* Floating button - always fixed to body, independent of page/route */}
      <button
        className="settings-fab"
        onClick={toggleSettings}
        aria-label="Open Settings"
      >
        <FiSettings />
      </button>

      {isSettingsOpen && (
        <div className="settings-overlay">
          <div className="settings-drawer" ref={drawerRef}>
            <div className="settings-header">
              <h3>Theme Settings</h3>
              <button className="close-btn" onClick={toggleSettings} aria-label="Close Settings">
                <FiX />
              </button>
            </div>

            <div className="settings-body">
              <div className="settings-section">
                <label className="section-label">SECTION 1 — BACKGROUND COLOR</label>
                <div className="button-group">
                  <button 
                    className={`theme-mode-btn ${bgMode === 'dark' ? 'active' : ''}`}
                    onClick={() => setBgMode('dark')}
                  >
                    Dark
                  </button>
                  <button 
                    className={`theme-mode-btn ${bgMode === 'light' ? 'active' : ''}`}
                    onClick={() => setBgMode('light')}
                  >
                    Light
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <label className="section-label">SECTION 2 — TEXT / ACCENT COLOR</label>
                <div className="color-options-grid">
                  {Object.keys(ACCENT_COLORS).map((key) => {
                    const color = ACCENT_COLORS[key];
                    const isSelected = accentColor === key;
                    return (
                      <button
                        key={key}
                        className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setAccentColor(key)}
                        aria-label={`Select ${color.label} text color`}
                      >
                        {isSelected && <FiCheck className="swatch-check" />}
                        <span>{color.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};