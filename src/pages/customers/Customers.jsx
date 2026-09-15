import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiChevronDown, 
  FiEdit2, 
  FiTrash2, 
  FiUsers, 
  FiDollarSign, 
  FiShoppingBag, 
  FiStar, 
  FiSettings,
  FiX 
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './customers.css';

const INITIAL_CUSTOMERS = [
  { id: 1, name: "John Smith", email: "john@example.com", phone: "+1 555-1001", orders: 24, totalSpent: 4820, status: "Active" },
  { id: 2, name: "Sarah Connor", email: "sarah@example.com", phone: "+1 555-1002", orders: 8, totalSpent: 1240, status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 555-1003", orders: 51, totalSpent: 12400, status: "VIP" },
  { id: 4, name: "Emma Watson", email: "emma@example.com", phone: "+1 555-1004", orders: 3, totalSpent: 380, status: "Inactive" },
  { id: 5, name: "Robert Brown", email: "robert@example.com", phone: "+1 555-1005", orders: 16, totalSpent: 3100, status: "Active" },
  { id: 6, name: "Olivia Davis", email: "olivia@example.com", phone: "+1 555-1006", orders: 29, totalSpent: 6750, status: "VIP" },
  { id: 7, name: "Daniel Wilson", email: "daniel@example.com", phone: "+1 555-1007", orders: 11, totalSpent: 2150, status: "Inactive" }
];

const ITEMS_PER_PAGE = 5;

// Circle avatar colors matching initial setup (Purple, Cyan/Blue, Green, Amber, Red)
const AVATAR_COLORS = [
  '#7c3aed', // Purple
  '#0284c7', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber/Yellow
  '#ef4444', // Red
  '#ec4899', // Pink
  '#6366f1'  // Indigo
];

export const Customers = () => {
  const { toggleSettingsPanel } = useTheme();

  // Load state from LocalStorage or Fallback to INITIAL_CUSTOMERS
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('dashboard_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored customers", e);
      }
    }
    return INITIAL_CUSTOMERS;
  });

  // Controls & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orders: 0,
    totalSpent: 0,
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('dashboard_customers', JSON.stringify(customers));
  }, [customers]);

  // Derived Dynamic Statistics
  const totalCustomers = customers.length;
  const totalOrdersSum = useMemo(() => customers.reduce((acc, c) => acc + Number(c.orders || 0), 0), [customers]);
  const totalRevenueSum = useMemo(() => customers.reduce((acc, c) => acc + Number(c.totalSpent || 0), 0), [customers]);
  const vipCount = useMemo(() => customers.filter(c => c.status === 'VIP').length, [customers]);

  // Format Large Currency ($284k or $4,820 style)
  const formatRevenue = (num) => {
    if (num >= 100000) {
      return `$${Math.floor(num / 1000)}k`;
    }
    return `$${num.toLocaleString()}`;
  };

  // Dynamic Filter & Multi-Field Search
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      // Filter dropdown status check
      const matchesFilter = selectedFilter === 'All' ? true : cust.status === selectedFilter;

      // Multi-field Search check
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        cust.name.toLowerCase().includes(term) ||
        cust.email.toLowerCase().includes(term) ||
        cust.phone.toLowerCase().includes(term) ||
        cust.status.toLowerCase().includes(term) ||
        cust.orders.toString().includes(term) ||
        `$${cust.totalSpent}`.toLowerCase().includes(term) ||
        cust.totalSpent.toString().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [customers, searchTerm, selectedFilter]);

  // Adjust pagination if current page becomes empty
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE) || 1;
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredCustomers, totalPages, currentPage]);

  // Active Subset
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      orders: 0,
      totalSpent: 0,
      status: 'Active'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      orders: cust.orders,
      totalSpent: cust.totalSpent,
      status: cust.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Customer Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (isNaN(formData.orders) || formData.orders < 0) errors.orders = "Must be a valid number";
    if (isNaN(formData.totalSpent) || formData.totalSpent < 0) errors.totalSpent = "Must be a valid amount";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { 
        ...c, 
        ...formData,
        orders: Number(formData.orders),
        totalSpent: Number(formData.totalSpent)
      } : c));
    } else {
      const newCust = {
        id: Date.now(),
        ...formData,
        orders: Number(formData.orders),
        totalSpent: Number(formData.totalSpent)
      };
      setCustomers([newCust, ...customers]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    setCustomers(customers.filter(c => c.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  const getAvatarBg = (name, id) => {
    const index = (id || name.charCodeAt(0)) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'VIP': return 'badge-vip';
      case 'Inactive': return 'badge-inactive';
      default: return '';
    }
  };

  const startRecord = filteredCustomers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length);

  return (
    <div className="customers-page-container">
      {/* HEADER SECTION */}
      <div className="customers-header">
        <div className="header-titles">
          <h1 className="customers-title">Customers</h1>
          <p className="customers-subtitle">Manage your customer base and purchase history</p>
        </div>
        <button className="add-customer-btn" onClick={handleOpenAddModal}>
          <FiPlus size={16} /> Add Customer
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper icon-purple">
            <FiUsers size={20} />
          </div>
          <div className="stat-info">
            <h2 className="stat-value">{totalCustomers.toLocaleString()}</h2>
            <p className="stat-label">Total Customers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-green">
            <FiDollarSign size={20} />
          </div>
          <div className="stat-info">
            <h2 className="stat-value">{formatRevenue(totalRevenueSum)}</h2>
            <p className="stat-label">Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-blue">
            <FiShoppingBag size={20} />
          </div>
          <div className="stat-info">
            <h2 className="stat-value">{totalOrdersSum.toLocaleString()}</h2>
            <p className="stat-label">Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-yellow">
            <FiStar size={20} />
          </div>
          <div className="stat-info">
            <h2 className="stat-value">{vipCount.toLocaleString()}</h2>
            <p className="stat-label">VIP Customers</p>
          </div>
        </div>
      </div>

      {/* CUSTOMER TABLE CARD */}
      <div className="table-card">
        {/* CONTROL BAR */}
        <div className="table-card-header">
          <h3 className="table-card-title">Customer List ({filteredCustomers.length})</h3>

          <div className="table-controls">
            {/* SEARCH */}
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" size={14} />
              <input
                type="text"
                className="search-input"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* STATUS FILTER */}
            <div className="filter-dropdown-wrapper">
              <select
                className="filter-dropdown"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                aria-label="Filter Customers"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="VIP">VIP</option>
                <option value="Inactive">Inactive</option>
              </select>
              <FiChevronDown className="dropdown-arrow" size={14} />
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="table-responsive-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>ORDERS</th>
                <th>TOTAL SPENT</th>
                <th>STATUS</th>
                <th className="th-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td>
                      <div className="customer-cell">
                        <div 
                          className="customer-avatar" 
                          style={{ backgroundColor: getAvatarBg(cust.name, cust.id) }}
                        >
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="customer-name">{cust.name}</span>
                      </div>
                    </td>
                    <td className="customer-email">{cust.email}</td>
                    <td className="customer-phone">{cust.phone}</td>
                    <td className="customer-orders">{cust.orders}</td>
                    <td className="customer-spent">${cust.totalSpent.toLocaleString()}</td>
                    <td>
                      <span className={`badge-status ${getStatusBadgeClass(cust.status)}`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="td-actions">
                      <button 
                        className="action-icon-btn edit-btn" 
                        onClick={() => handleOpenEditModal(cust)}
                        aria-label={`Edit ${cust.name}`}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button 
                        className="action-icon-btn delete-btn" 
                        onClick={() => setDeleteTargetId(cust.id)}
                        aria-label={`Delete ${cust.name}`}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data-cell">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="table-footer">
          <span className="pagination-info">
            Showing {startRecord}–{endRecord} of {filteredCustomers.length}
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

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={formErrors.name ? 'input-error' : ''}
                  placeholder="John Smith"
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

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={formErrors.phone ? 'input-error' : ''}
                  placeholder="+1 555-1001"
                />
                {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Orders</label>
                  <input
                    type="number"
                    value={formData.orders}
                    onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                    className={formErrors.orders ? 'input-error' : ''}
                    min="0"
                  />
                  {formErrors.orders && <span className="error-text">{formErrors.orders}</span>}
                </div>

                <div className="form-group">
                  <label>Total Spent ($)</label>
                  <input
                    type="number"
                    value={formData.totalSpent}
                    onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
                    className={formErrors.totalSpent ? 'input-error' : ''}
                    min="0"
                  />
                  {formErrors.totalSpent && <span className="error-text">{formErrors.totalSpent}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
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
            <h3>Delete Customer</h3>
            <p>Are you sure you want to delete this customer?</p>
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

export default Customers;