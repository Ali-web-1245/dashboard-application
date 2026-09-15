import React from 'react';
import { Navbar } from '/src/components/navbar/Navbar';
import { Sidebar } from '/src/components/sidebar/Sidebar';
import { Settings } from '/src/components/settings/Settings';
import './layout.css';

export const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Settings />
    </div>
  );
};

export default Layout;