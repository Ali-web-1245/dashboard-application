import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiBarChart2,
  FiFileText,
  FiUsers as FiCrm,
  FiEdit3,
  FiPieChart,
  FiDatabase,
  FiActivity,
  FiUsers,
  FiShoppingBag,
  FiClipboard
} from 'react-icons/fi';
import './sidebar.css';

const navGroups = [
  {
    title: 'Dashboard',
    items: [
      { to: '/dashboard', label: 'Default', icon: <FiGrid /> },
      { to: '/invoice', label: 'Invoice', icon: <FiFileText /> },
      { to: '/crm', label: 'CRM', icon: <FiCrm /> },
      { to: '/blog', label: 'Blog', icon: <FiEdit3 /> },
    ],
  },
  {
    title: 'Widget',
    items: [
      { to: '/statistics', label: 'Statistics', icon: <FiPieChart /> },
      { to: '/data', label: 'Data', icon: <FiDatabase /> },
      { to: '/charts', label: 'Chart', icon: <FiActivity /> },
    ],
  },
  {
    title: 'Application',
    items: [
      { to: '/users', label: 'Users', icon: <FiUsers /> },
      { to: '/customers', label: 'Customer', icon: <FiShoppingBag /> }
    ],
  },
];

export const Sidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-nav">
        {navGroups.map((group) => (
          <div className="sidebar-group" key={group.title}>
            <p className="sidebar-group-title">{group.title}</p>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;