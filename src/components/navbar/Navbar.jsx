import React, { useState, useEffect, useRef } from 'react';
import { 
  FiMenu, 
  FiSearch, 
  FiSliders, 
  FiGlobe, 
  FiBell, 
  FiMaximize, 
  FiMinimize, 
  FiUser, 
  FiSettings, 
  FiRadio,
  FiLogOut,
  FiCheck
} from 'react-icons/fi';
import { LuFlaskConical } from 'react-icons/lu';
import { useTheme } from '../../context/ThemeContext';
import './navbar.css';

export const Navbar = () => {
  const { 
    toggleSidebar, 
    toggleSettings, 
    currentLanguage, 
    setCurrentLanguage, 
    searchQuery, 
    setSearchQuery,
    setCurrentPage
  } = useTheme();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Sales Order', time: '2 mins ago', unread: true },
    { id: 2, title: 'Server Upgrade Completed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Monthly Report Ready', time: '4 hours ago', unread: false },
  ]);

  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="navbar-container" ref={navRef}>
      <div className="navbar-left">
        <div className="navbar-brand" onClick={() => setCurrentPage('dashboard')}>
          <div className="brand-icon-wrapper">
            <LuFlaskConical className="brand-icon" />
          </div>
          <span className="brand-text">BERRY</span>
        </div>

        <button 
          className="icon-btn sidebar-toggle-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FiMenu />
        </button>

        <div className="search-bar-wrapper">
          <FiSearch className="search-icon-left" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-filter-btn" aria-label="Search Settings">
            <FiSliders />
          </button>
        </div>
      </div>

      <div className="navbar-right">
        {/* Broadcast Connection */}
        <div className="dropdown-relative">
          <button 
            className={`icon-btn ${activeDropdown === 'broadcast' ? 'active' : ''}`}
            onClick={() => toggleDropdown('broadcast')}
            aria-label="Broadcast Connections"
          >
            <FiRadio />
          </button>
          {activeDropdown === 'broadcast' && (
            <div className="dropdown-menu animate-fade-in">
              <div className="dropdown-header">Live Server Nodes</div>
              <div className="dropdown-item">
                <span className="status-dot online"></span> US-East Server (Active)
              </div>
              <div className="dropdown-item">
                <span className="status-dot online"></span> EU-Central Server (Active)
              </div>
              <div className="dropdown-item">
                <span className="status-dot offline"></span> AP-South Server (Maintenance)
              </div>
            </div>
          )}
        </div>

        {/* Language Dropdown */}
        <div className="dropdown-relative">
          <button 
            className={`icon-btn ${activeDropdown === 'lang' ? 'active' : ''}`}
            onClick={() => toggleDropdown('lang')}
            aria-label="Select Language"
          >
            <FiGlobe />
          </button>
          {activeDropdown === 'lang' && (
            <div className="dropdown-menu dropdown-menu-right animate-fade-in">
              <div className="dropdown-header">Select Language</div>
              {['English', 'Urdu', 'Arabic'].map((lang) => (
                <button
                  key={lang}
                  className={`dropdown-item select-item ${currentLanguage === lang ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentLanguage(lang);
                    setActiveDropdown(null);
                  }}
                >
                  <span>{lang}</span>
                  {currentLanguage === lang && <FiCheck className="check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="dropdown-relative">
          <button 
            className={`icon-btn notification-btn ${activeDropdown === 'notif' ? 'active' : ''}`}
            onClick={() => toggleDropdown('notif')}
            aria-label="Notifications"
          >
            <FiBell className="bell-icon" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          {activeDropdown === 'notif' && (
            <div className="dropdown-menu dropdown-menu-right notif-dropdown animate-fade-in">
              <div className="dropdown-header flex-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className="text-action-btn" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen API Toggle */}
        <button 
          className="icon-btn" 
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <FiMinimize /> : <FiMaximize />}
        </button>

        {/* Profile Pill */}
        <div className="dropdown-relative">
          <div className="profile-pill-wrapper">
            <button 
              className={`profile-avatar-btn ${activeDropdown === 'profile' ? 'active' : ''}`}
              onClick={() => toggleDropdown('profile')}
              aria-label="User Menu"
            >
              <FiUser />
            </button>
            <button 
              className="settings-gear-btn"
              onClick={toggleSettings}
              aria-label="Open Settings"
            >
              <FiSettings />
            </button>
          </div>

          {activeDropdown === 'profile' && (
            <div className="dropdown-menu dropdown-menu-right animate-fade-in">
              <div className="profile-info-header">
                <strong>Muhammad Ali</strong>
                <span className="profile-role">Administrator</span>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item"
                onClick={() => {
                  setCurrentPage('profile');
                  setActiveDropdown(null);
                }}
              >
                <FiUser style={{ marginRight: '8px' }} /> View Profile
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  toggleSettings();
                  setActiveDropdown(null);
                }}
              >
                <FiSettings style={{ marginRight: '8px' }} /> Account Settings
              </button>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item text-danger"
                onClick={() => {
                  alert('Logged out successfully!');
                  setActiveDropdown(null);
                }}
              >
                <FiLogOut style={{ marginRight: '8px' }} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};