import React from 'react';
import { 
  BsTrendingDown, 
  BsShare, 
  BsBroadcast, 
  BsGrid3X3Gap, 
  BsCreditCard, 
  BsCaretUpFill, 
  BsCaretDownFill,
  BsCurrencyDollar,
  BsPerson,
  BsFileEarmarkText
} from 'react-icons/bs';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import './analytics.css';

// Dynamic Data Arrays
const marketShareStats = [
  { id: 1, icon: <FaFacebookF />, value: '+45.36%', type: 'positive' },
  { id: 2, icon: <FaTwitter />, value: '-50.69%', type: 'negative' },
  { id: 3, icon: <FaYoutube />, value: '+16.85%', type: 'positive' }
];

const chartData = [
  { name: 'Point 1', series1: 20, series2: 45, series3: 60 },
  { name: 'Point 2', series1: 45, series2: 85, series3: 35 },
  { name: 'Point 3', series1: 30, series2: 70, series3: 25 },
  { name: 'Point 4', series1: 70, series2: 50, series3: 50 },
  { name: 'Point 5', series1: 40, series2: 30, series3: 75 },
  { name: 'Point 6', series1: 85, series2: 95, series3: 40 },
  { name: 'Point 7', series1: 60, series2: 60, series3: 20 }
];

const customersData = [
  { id: 1, country: 'Germany', flag: '🇦🇺', name: 'Angelina Jolly', average: '56.23%' },
  { id: 2, country: 'USA', flag: '🇧🇷', name: 'John Deo', average: '25.23%' },
  { id: 3, country: 'Australia', flag: '🇩🇪', name: 'Jenifer Vintage', average: '12.45%' },
  { id: 4, country: 'United Kingdom', flag: '🇬🇧', name: 'Lori Moore', average: '8.65%' },
  { id: 5, country: 'Brazil', flag: '🇺🇸', name: 'Allianz Dacron', average: '3.56%' },
  { id: 6, country: 'Australia', flag: '🇦🇺', name: 'Jenifer Vintage', average: '12.45%' }
];

const topStatsGrid = [
  { id: 1, count: '1000', label: 'SHARES', icon: <BsShare /> },
  { id: 2, count: '600', label: 'NETWORK', icon: <BsBroadcast /> },
  { id: 3, count: '3550', label: 'RETURNS', icon: <BsGrid3X3Gap /> },
  { id: 4, count: '100%', label: 'ORDER', icon: <BsCreditCard /> }
];

const revenueItems = [
  { id: 1, name: 'Bitcoin', value: '+ $145.85', type: 'profit' },
  { id: 2, name: 'Ethereum', value: '- $6.368', type: 'loss' },
  { id: 3, name: 'Ripple', value: '+ $458.63', type: 'profit' },
  { id: 4, name: 'Neo', value: '- $5.631', type: 'loss' },
  { id: 5, name: 'Ethereum', value: '- $6.368', type: 'loss' },
  { id: 6, name: 'Ripple', value: '+ $458.63', type: 'profit' },
  { id: 7, name: 'Neo', value: '- $5.631', type: 'loss' }
];

export const Analytics = () => {
  const marketShareTotal = "27,695.65";
  const revenueData = { current: "$42,562", lastMonth: "$50,032 Last Month" };
  const ordersData = { count: "486", percentage: "20% Increase" };
  const dailyUserData = "1,658";
  const dailyPageViewData = "1K";

  return (
    <div className="analytics-container">
      {/* LEFT COLUMN */}
      <div className="analytics-left-col">
        
        {/* Market Share Card */}
        <div className="analytics-card market-share-card">
          <div className="market-share-header">
            <div>
              <h2 className="card-heading">Market Share</h2>
              <p className="card-subheading">Department wise monthly sales report</p>
            </div>
            <div className="market-share-total">
              <BsTrendingDown className="trend-down-icon" />
              <span>{marketShareTotal}</span>
            </div>
          </div>

          <div className="market-share-filters">
            {marketShareStats.map((item) => (
              <div key={item.id} className={`share-filter-badge ${item.type}`}>
                <span className="badge-icon">{item.icon}</span>
                <span className="badge-value">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="market-share-chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111728', 
                    borderColor: '#212946', 
                    borderRadius: '8px', 
                    color: '#fff' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="series1" 
                  stroke="#ef4444" 
                  strokeWidth={2.5} 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="series2" 
                  stroke="#8b5cf6" 
                  strokeWidth={2.5} 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="series3" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue & Orders Received Row */}
        <div className="cards-row">
          <div className="analytics-card banner-card purple-banner">
            <div className="banner-content">
              <span className="banner-title">Revenue</span>
              <h3 className="banner-value">{revenueData.current}</h3>
              <span className="banner-subtext">{revenueData.lastMonth}</span>
            </div>
            <div className="banner-icon-bg">
              <BsCurrencyDollar />
            </div>
          </div>

          <div className="analytics-card banner-card blue-banner">
            <div className="banner-content">
              <span className="banner-title">Orders Received</span>
              <h3 className="banner-value">{ordersData.count}</h3>
              <span className="banner-subtext">{ordersData.percentage}</span>
            </div>
            <div className="banner-icon-bg">
              <BsPerson />
            </div>
          </div>
        </div>

        {/* Latest Customers Table */}
        <div className="analytics-card customers-card">
          <h3 className="card-heading customers-heading">Latest Customers</h3>
          <div className="table-responsive">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Country</th>
                  <th>Name</th>
                  <th className="text-right">Average</th>
                </tr>
              </thead>
              <tbody>
                {customersData.map((customer) => (
                  <tr key={customer.id}>
                    <td className="flag-cell">{customer.flag}</td>
                    <td>{customer.country}</td>
                    <td className="name-cell">{customer.name}</td>
                    <td className="text-right">{customer.average}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="customers-footer">
            <a href="#customers" className="view-all-link">View All Latest Customers</a>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN */}
      <div className="analytics-right-col">
        
        {/* Top 4 Stats Grid */}
        <div className="stats-grid">
          {topStatsGrid.map((stat) => (
            <div key={stat.id} className="analytics-card stat-grid-item">
              <div className="stat-icon-wrapper">{stat.icon}</div>
              <div className="stat-text-info">
                <span className="stat-count">{stat.count}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Revenue Crypto List */}
        <div className="analytics-card total-revenue-card">
          <h3 className="card-heading revenue-heading">Total Revenue</h3>
          <div className="revenue-list">
            {revenueItems.map((item, idx) => (
              <div key={idx} className="revenue-item">
                <div className="revenue-item-name">
                  {item.type === 'profit' ? (
                    <BsCaretUpFill className="caret-icon profit" />
                  ) : (
                    <BsCaretDownFill className="caret-icon loss" />
                  )}
                  <span>{item.name}</span>
                </div>
                <span className={`revenue-item-val ${item.type}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily User Banner */}
        <div className="analytics-card banner-card purple-banner daily-card">
          <div className="banner-content">
            <h3 className="banner-value-large">{dailyUserData}</h3>
            <span className="banner-title-small">Daily user</span>
          </div>
          <div className="banner-icon-bg large-icon">
            <BsPerson />
          </div>
        </div>

        {/* Daily Page View Banner */}
        <div className="analytics-card banner-card blue-banner daily-card">
          <div className="banner-content">
            <h3 className="banner-value-large">{dailyPageViewData}</h3>
            <span className="banner-title-small">Daily page view</span>
          </div>
          <div className="banner-icon-bg large-icon">
            <BsFileEarmarkText />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;