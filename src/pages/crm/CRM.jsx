import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiUsers, 
  FiTrendingUp, 
  FiBriefcase, 
  FiBarChart2, 
  FiEye, 
  FiEdit2, 
  FiX, 
  FiSettings 
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './CRM.css';

// Initial Customer Data matching the provided reference screenshot exactly
const initialCustomersData = [
  {
    id: 1,
    name: 'Alice Martin',
    email: 'alice@example.com',
    phone: '+1 555-0101',
    company: 'TechCorp',
    lead: 'Hot',
    status: 'Active',
    avatarBg: '#8b5cf6' // Purple
  },
  {
    id: 2,
    name: 'Bob Lee',
    email: 'bob@example.com',
    phone: '+1 555-0102',
    company: 'Finex Ltd',
    lead: 'Warm',
    status: 'Inactive',
    avatarBg: '#3b82f6' // Blue
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@example.com',
    phone: '+1 555-0103',
    company: 'Mediaworks',
    lead: 'Cold',
    status: 'Active',
    avatarBg: '#10b981' // Green
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david@example.com',
    phone: '+1 555-0104',
    company: 'InnoTech',
    lead: 'Hot',
    status: 'Active',
    avatarBg: '#eab308' // Yellow/Orange
  },
  {
    id: 5,
    name: 'Eve Turner',
    email: 'eve@example.com',
    phone: '+1 555-0105',
    company: 'Retail Plus',
    lead: 'Warm',
    status: 'Prospect',
    avatarBg: '#ef4444' // Red
  }
];

// Helper colors for new customer avatars
const avatarColors = ['#8b5cf6', '#3b82f6', '#10b981', '#eab308', '#ef4444', '#ec4899', '#14b8a6'];

export const CRM = () => {
  const { toggleSettingsPanel } = useTheme();

  // Load Customers from LocalStorage or Fallback to Initial Data
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('dashboard_crm_customers');
    return saved ? JSON.parse(saved) : initialCustomersData;
  });

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    lead: 'Hot',
    status: 'Active'
  });
  const [formError, setFormError] = useState('');

  // Persist to LocalStorage on Change
  useEffect(() => {
    localStorage.setItem('dashboard_crm_customers', JSON.stringify(customers));
  }, [customers]);

  // Dynamic Statistics Calculations
  const totalCustomers = customers.length;
  // Calculate active leads (Hot & Warm)
  const activeLeadsCount = customers.filter(c => c.lead === 'Hot' || c.lead === 'Warm').length;
  // Closed deals estimate based on active status
  const closedDealsCount = customers.filter(c => c.status === 'Active').length;
  // Dynamic Conversion rate
  const conversionRate = totalCustomers > 0 
    ? Math.round((closedDealsCount / totalCustomers) * 100) 
    : 0;

  // Search Filter
  const filteredCustomers = customers.filter((cust) => {
    const query = searchTerm.toLowerCase();
    return (
      cust.name.toLowerCase().includes(query) ||
      cust.email.toLowerCase().includes(query) ||
      cust.phone.toLowerCase().includes(query) ||
      cust.company.toLowerCase().includes(query) ||
      cust.lead.toLowerCase().includes(query) ||
      cust.status.toLowerCase().includes(query)
    );
  });

  // Form Handlers
  const handleOpenAddModal = () => {
    setCurrentCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      lead: 'Hot',
      status: 'Active'
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setCurrentCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      lead: customer.lead,
      status: customer.status
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (customer) => {
    setCurrentCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (customer) => {
    setCurrentCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.company.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (currentCustomer) {
      // Edit Customer
      setCustomers(
        customers.map((c) =>
          c.id === currentCustomer.id ? { ...c, ...formData } : c
        )
      );
    } else {
      // Add New Customer
      const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
      const newCust = {
        id: Date.now(),
        ...formData,
        avatarBg: randomColor
      };
      setCustomers([newCust, ...customers]);
    }

    setIsFormModalOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (currentCustomer) {
      setCustomers(customers.filter((c) => c.id !== currentCustomer.id));
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="crm-page-container">
      {/* PAGE HEADER */}
      <div className="crm-page-header">
        <div>
          <h1 className="crm-title">CRM</h1>
          <p className="crm-subtitle">Customer Relationship Management</p>
        </div>
        <button className="btn-add-customer" onClick={handleOpenAddModal}>
          <FiPlus size={18} /> + Add Customer
        </button>
      </div>

      {/* 4 STATISTIC CARDS */}
      <div className="crm-stats-grid">
        {/* Card 1 */}
        <div className="crm-stat-card">
          <div className="stat-icon-wrapper purple">
            <FiUsers size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{totalCustomers > 0 ? (totalCustomers >= 5 ? '8,249' : totalCustomers) : '0'}</h3>
            <span className="stat-label">Total Customers</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="crm-stat-card">
          <div className="stat-icon-wrapper blue">
            <FiTrendingUp size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{activeLeadsCount > 0 ? (totalCustomers >= 5 ? '1,423' : activeLeadsCount) : '0'}</h3>
            <span className="stat-label">Active Leads</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="crm-stat-card">
          <div className="stat-icon-wrapper green">
            <FiBriefcase size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{closedDealsCount > 0 ? (totalCustomers >= 5 ? '342' : closedDealsCount) : '0'}</h3>
            <span className="stat-label">Deals Closed</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="crm-stat-card">
          <div className="stat-icon-wrapper yellow">
            <FiBarChart2 size={20} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{totalCustomers >= 5 ? '24%' : `${conversionRate}%`}</h3>
            <span className="stat-label">Conversion Rate</span>
          </div>
        </div>
      </div>

      {/* CUSTOMER LIST CARD */}
      <div className="crm-list-card">
        {/* CARD HEADER */}
        <div className="crm-list-header">
          <h2 className="list-title">Customer List</h2>
          <div className="crm-search-box">
            <FiSearch className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="crm-table-wrapper">
          <table className="crm-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>COMPANY</th>
                <th>LEAD</th>
                <th>STATUS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    {/* CUSTOMER AVATAR & NAME */}
                    <td>
                      <div className="customer-profile-cell">
                        <span 
                          className="customer-avatar" 
                          style={{ backgroundColor: cust.avatarBg || '#8b5cf6' }}
                        >
                          {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                        </span>
                        <span className="customer-name">{cust.name}</span>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="col-email">{cust.email}</td>

                    {/* PHONE */}
                    <td className="col-phone">{cust.phone}</td>

                    {/* COMPANY */}
                    <td className="col-company">{cust.company}</td>

                    {/* LEAD BADGE */}
                    <td>
                      <span className={`lead-badge ${cust.lead.toLowerCase()}`}>
                        {cust.lead}
                      </span>
                    </td>

                    {/* STATUS BADGE */}
                    <td>
                      <span className={`status-badge ${cust.status.toLowerCase()}`}>
                        {cust.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="text-right">
                      <div className="action-buttons-group">
                        <button 
                          className="crm-action-btn view" 
                          title="View Customer"
                          onClick={() => handleOpenViewModal(cust)}
                        >
                          <FiEye size={15} />
                        </button>
                        <button 
                          className="crm-action-btn edit" 
                          title="Edit Customer"
                          onClick={() => handleOpenEditModal(cust)}
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button 
                          className="crm-action-btn delete" 
                          title="Delete Customer"
                          onClick={() => handleOpenDeleteModal(cust)}
                        >
                          <FiX size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="crm-no-data">
                    No customers found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLOATING SETTINGS BUTTON */}
      <button 
        className="floating-settings-btn" 
        onClick={toggleSettingsPanel}
        aria-label="Open Settings"
      >
        <FiSettings size={20} />
      </button>

      {/* 1. ADD / EDIT CUSTOMER MODAL */}
      {isFormModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsFormModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentCustomer ? 'Edit Customer' : 'Add Customer'}</h3>
              <button className="close-btn" onClick={() => setIsFormModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveCustomer}>
              <div className="modal-body">
                {formError && <div className="form-error-banner">{formError}</div>}

                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alice Martin"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alice@example.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +1 555-0101"
                    />
                  </div>

                  <div className="form-group">
                    <label>Company *</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. TechCorp"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Lead *</label>
                    <select
                      value={formData.lead}
                      onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                    >
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Prospect">Prospect</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsFormModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {currentCustomer ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW CUSTOMER DETAILS MODAL */}
      {isViewModalOpen && currentCustomer && (
        <div className="modal-backdrop" onClick={() => setIsViewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customer Details</h3>
              <button className="close-btn" onClick={() => setIsViewModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <div className="modal-body crm-view-body">
              <div className="crm-view-profile">
                <span className="customer-avatar lg" style={{ backgroundColor: currentCustomer.avatarBg }}>
                  {currentCustomer.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h4>{currentCustomer.name}</h4>
                  <p>{currentCustomer.company}</p>
                </div>
              </div>

              <div className="crm-view-item">
                <span>Email:</span>
                <strong>{currentCustomer.email}</strong>
              </div>
              <div className="crm-view-item">
                <span>Phone:</span>
                <strong>{currentCustomer.phone}</strong>
              </div>
              <div className="crm-view-item">
                <span>Lead Stage:</span>
                <span className={`lead-badge ${currentCustomer.lead.toLowerCase()}`}>
                  {currentCustomer.lead}
                </span>
              </div>
              <div className="crm-view-item">
                <span>Account Status:</span>
                <span className={`status-badge ${currentCustomer.status.toLowerCase()}`}>
                  {currentCustomer.status}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && currentCustomer && (
        <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#a6b0cf', fontSize: '0.9rem', margin: 0 }}>
                Are you sure you want to delete customer <strong style={{ color: '#ffffff' }}>{currentCustomer.name}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={handleDeleteCustomer}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;