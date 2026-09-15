import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiChevronDown, 
  FiEdit2, 
  FiTrash2, 
  FiUsers, 
  FiUserCheck, 
  FiUserX, 
  FiShield, 
  FiSettings,
  FiX 
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './users.css';

const INITIAL_USERS = [
  { id: 1, name: "Alice Martin", email: "alice@example.com", role: "Admin", status: "Active", joined: "2024-01-15" },
  { id: 2, name: "Bob Lee", email: "bob@example.com", role: "User", status: "Active", joined: "2024-03-22" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "Editor", status: "Inactive", joined: "2024-05-10" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "User", status: "Active", joined: "2024-07-01" },
  { id: 5, name: "Eve Turner", email: "eve@example.com", role: "Moderator", status: "Active", joined: "2025-01-18" },
  { id: 6, name: "Frank Wilson", email: "frank@example.com", role: "User", status: "Active", joined: "2025-03-12" },
  { id: 7, name: "Grace Miller", email: "grace@example.com", role: "Editor", status: "Inactive", joined: "2025-06-08" }
];

const ITEMS_PER_PAGE = 5;

// Circle avatar colors matching initial setup
const AVATAR_COLORS = [
  '#8b5cf6', // A - Purple
  '#06b6d4', // B - Cyan
  '#10b981', // C - Green
  '#f59e0b', // D - Amber
  '#ef4444', // E - Red
  '#3b82f6', // F - Blue
  '#ec4899'  // G - Pink
];

export const Users = () => {
  const { toggleSettingsPanel } = useTheme();

  // Load state from LocalStorage or Fallback to INITIAL_USERS
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('dashboard_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored users", e);
      }
    }
    return INITIAL_USERS;
  });

  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
    joined: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});

  // Sync users to LocalStorage
  useEffect(() => {
    localStorage.setItem('dashboard_users', JSON.stringify(users));
  }, [users]);

  // Dynamic Statistics derived from actual users state
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const inactiveUsers = users.filter(u => u.status === 'Inactive').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

  // Filtered Users Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter dropdown check
      const matchesFilter = 
        selectedFilter === 'All' ? true :
        selectedFilter === 'Active' || selectedFilter === 'Inactive' ? user.status === selectedFilter :
        user.role === selectedFilter;

      // Search term check
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        user.status.toLowerCase().includes(term) ||
        user.joined.includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [users, searchTerm, selectedFilter]);

  // Reset to page 1 if current page becomes invalid due to filtering/deleting
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredUsers, totalPages, currentPage]);

  // Paginated Subset
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'User',
      status: 'Active',
      joined: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      joined: user.joined
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.joined) errors.joined = "Joined date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      // Edit User
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      // Add User
      const newUser = {
        id: Date.now(),
        ...formData
      };
      setUsers([newUser, ...users]);
    }
    setIsModalOpen(false);
  };

  // Delete Handlers
  const confirmDelete = () => {
    if (!deleteTargetId) return;
    setUsers(users.filter(u => u.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  // Helper function for badge classes
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin': return 'badge-role-admin';
      case 'User': return 'badge-role-user';
      case 'Editor': return 'badge-role-editor';
      case 'Moderator': return 'badge-role-moderator';
      default: return '';
    }
  };

  const getAvatarBg = (name, id) => {
    const index = (id || name.charCodeAt(0)) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  const startRecord = filteredUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length);

  return (
    <div className="users-page-container">
      {/* PAGE HEADER */}
      <div className="users-header">
        <div className="header-titles">
          <h1 className="users-title">Users</h1>
          <p className="users-subtitle">Manage user accounts and permissions</p>
        </div>
        <button className="add-user-btn" onClick={handleOpenAddModal}>
          <FiPlus size={16} /> Add User
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper icon-purple">
            <FiUsers size={20} />
          </div>
          <div className="stat-info">
            <h2 className="stat-value">{totalUsers.toLocaleString()}</h2>
            <p className="stat-label">Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-green">
            <FiUserCheck size={20} />
          </div>
          <div className="stat-info">
            <h2 className="stat-value">{activeUsers.toLocaleString()}</h2>
            <p className="stat-label">Active Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-red">
            <FiUserX size={20} />
          </div>
          <div className="stat-info">
            <h2 className="stat-value">{inactiveUsers.toLocaleString()}</h2>
            <p className="stat-label">Inactive Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-yellow">
            <FiShield size={20} />
          </div>
          <div className="stat-info">
            <h2 className="stat-value">{adminCount.toLocaleString()}</h2>
            <p className="stat-label">Admins</p>
          </div>
        </div>
      </div>

      {/* TABLE CARD CONTAINER */}
      <div className="table-card">
        {/* CARD TOP CONTROL BAR */}
        <div className="table-card-header">
          <h3 className="table-card-title">All Users ({filteredUsers.length})</h3>
          
          <div className="table-controls">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" size={14} />
              <input
                type="text"
                className="search-input"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="filter-dropdown-wrapper">
              <select
                className="filter-dropdown"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                aria-label="Filter Users"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Editor">Editor</option>
                <option value="Moderator">Moderator</option>
              </select>
              <FiChevronDown className="dropdown-arrow" size={14} />
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="table-responsive-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>JOINED</th>
                <th className="th-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div 
                          className="user-avatar" 
                          style={{ backgroundColor: getAvatarBg(user.name, user.id) }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      <span className={`badge-role ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${user.status === 'Active' ? 'badge-status-active' : 'badge-status-inactive'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="user-joined">{user.joined}</td>
                    <td className="td-actions">
                      <button 
                        className="action-icon-btn edit-btn" 
                        onClick={() => handleOpenEditModal(user)}
                        aria-label={`Edit ${user.name}`}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button 
                        className="action-icon-btn delete-btn" 
                        onClick={() => setDeleteTargetId(user.id)}
                        aria-label={`Delete ${user.name}`}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data-cell">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="table-footer">
          <span className="pagination-info">
            Showing {startRecord}–{endRecord} of {filteredUsers.length}
          </span>

          {totalPages > 0 && (
            <div className="pagination-buttons">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add User'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={formErrors.name ? 'input-error' : ''}
                  placeholder="John Doe"
                />
                {formErrors.name && <span className="error-text">{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={formErrors.email ? 'input-error' : ''}
                  placeholder="john@example.com"
                />
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Editor">Editor</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Joined Date</label>
                <input
                  type="date"
                  value={formData.joined}
                  onChange={(e) => setFormData({ ...formData, joined: e.target.value })}
                  className={formErrors.joined ? 'input-error' : ''}
                />
                {formErrors.joined && <span className="error-text">{formErrors.joined}</span>}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTargetId && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h3>Delete User</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SETTINGS BUTTON */}
      <button 
        className="floating-settings-btn" 
        onClick={toggleSettingsPanel}
        aria-label="Open Settings"
      >
        <FiSettings size={20} />
      </button>
    </div>
  );
};

export default Users;