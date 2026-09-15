import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { FiChevronDown, FiSettings } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './Charts.css';

// Datasets for Time Range Filter
const chartDataByPeriod = {
  "This Month": {
    salesReturns: [
      { month: 'Jan', returns: 400, sales: 4100 },
      { month: 'Feb', returns: 500, sales: 3000 },
      { month: 'Mar', returns: 600, sales: 5000 },
      { month: 'Apr', returns: 550, sales: 4600 },
      { month: 'May', returns: 700, sales: 6900 },
      { month: 'Jun', returns: 800, sales: 6200 },
      { month: 'Jul', returns: 900, sales: 8100 },
      { month: 'Aug', returns: 850, sales: 7400 }
    ],
    dailyOrders: [
      { day: 'Mon', orders: 120 },
      { day: 'Tue', orders: 210 },
      { day: 'Wed', orders: 180 },
      { day: 'Thu', orders: 260 },
      { day: 'Fri', orders: 310 },
      { day: 'Sat', orders: 200 },
      { day: 'Sun', orders: 150 }
    ],
    revenueCost: [
      { quarter: 'Q1', cost: 15000, revenue: 24000 },
      { quarter: 'Q2', cost: 18000, revenue: 31000 },
      { quarter: 'Q3', cost: 17000, revenue: 29000 },
      { quarter: 'Q4', cost: 21000, revenue: 42000 }
    ],
    revenueCategory: [
      { name: 'Software', value: 42, color: '#8b5cf6' },
      { name: 'Hardware', value: 28, color: '#06b6d4' },
      { name: 'Services', value: 18, color: '#10b981' },
      { name: 'Other', value: 12, color: '#f59e0b' }
    ]
  },
  "Last Month": {
    salesReturns: [
      { month: 'Jan', returns: 350, sales: 3800 },
      { month: 'Feb', returns: 450, sales: 3200 },
      { month: 'Mar', returns: 500, sales: 4500 },
      { month: 'Apr', returns: 600, sales: 4200 },
      { month: 'May', returns: 650, sales: 5800 },
      { month: 'Jun', returns: 700, sales: 5900 },
      { month: 'Jul', returns: 750, sales: 7100 },
      { month: 'Aug', returns: 800, sales: 6900 }
    ],
    dailyOrders: [
      { day: 'Mon', orders: 100 },
      { day: 'Tue', orders: 190 },
      { day: 'Wed', orders: 160 },
      { day: 'Thu', orders: 230 },
      { day: 'Fri', orders: 280 },
      { day: 'Sat', orders: 180 },
      { day: 'Sun', orders: 130 }
    ],
    revenueCost: [
      { quarter: 'Q1', cost: 13000, revenue: 21000 },
      { quarter: 'Q2', cost: 16000, revenue: 28000 },
      { quarter: 'Q3', cost: 15000, revenue: 26000 },
      { quarter: 'Q4', cost: 19000, revenue: 38000 }
    ],
    revenueCategory: [
      { name: 'Software', value: 40, color: '#8b5cf6' },
      { name: 'Hardware', value: 30, color: '#06b6d4' },
      { name: 'Services', value: 15, color: '#10b981' },
      { name: 'Other', value: 15, color: '#f59e0b' }
    ]
  },
  "This Quarter": {
    salesReturns: [
      { month: 'Jan', returns: 1200, sales: 12000 },
      { month: 'Feb', returns: 1400, sales: 11000 },
      { month: 'Mar', returns: 1600, sales: 15000 },
      { month: 'Apr', returns: 1500, sales: 14000 },
      { month: 'May', returns: 1800, sales: 19000 },
      { month: 'Jun', returns: 2000, sales: 18000 },
      { month: 'Jul', returns: 2200, sales: 23000 },
      { month: 'Aug', returns: 2100, sales: 21000 }
    ],
    dailyOrders: [
      { day: 'Mon', orders: 400 },
      { day: 'Tue', orders: 650 },
      { day: 'Wed', orders: 580 },
      { day: 'Thu', orders: 820 },
      { day: 'Fri', orders: 950 },
      { day: 'Sat', orders: 600 },
      { day: 'Sun', orders: 480 }
    ],
    revenueCost: [
      { quarter: 'Q1', cost: 45000, revenue: 75000 },
      { quarter: 'Q2', cost: 52000, revenue: 92000 },
      { quarter: 'Q3', cost: 49000, revenue: 88000 },
      { quarter: 'Q4', cost: 61000, revenue: 125000 }
    ],
    revenueCategory: [
      { name: 'Software', value: 45, color: '#8b5cf6' },
      { name: 'Hardware', value: 25, color: '#06b6d4' },
      { name: 'Services', value: 20, color: '#10b981' },
      { name: 'Other', value: 10, color: '#f59e0b' }
    ]
  },
  "This Year": {
    salesReturns: [
      { month: 'Jan', returns: 4500, sales: 48000 },
      { month: 'Feb', returns: 5200, sales: 41000 },
      { month: 'Mar', returns: 6100, sales: 59000 },
      { month: 'Apr', returns: 5800, sales: 53000 },
      { month: 'May', returns: 7100, sales: 76000 },
      { month: 'Jun', returns: 7900, sales: 70000 },
      { month: 'Jul', returns: 8800, sales: 89000 },
      { month: 'Aug', returns: 8200, sales: 81000 }
    ],
    dailyOrders: [
      { day: 'Mon', orders: 1500 },
      { day: 'Tue', orders: 2400 },
      { day: 'Wed', orders: 2100 },
      { day: 'Thu', orders: 3100 },
      { day: 'Fri', orders: 3800 },
      { day: 'Sat', orders: 2300 },
      { day: 'Sun', orders: 1800 }
    ],
    revenueCost: [
      { quarter: 'Q1', cost: 180000, revenue: 290000 },
      { quarter: 'Q2', cost: 210000, revenue: 370000 },
      { quarter: 'Q3', cost: 195000, revenue: 350000 },
      { quarter: 'Q4', cost: 240000, revenue: 490000 }
    ],
    revenueCategory: [
      { name: 'Software', value: 50, color: '#8b5cf6' },
      { name: 'Hardware', value: 22, color: '#06b6d4' },
      { name: 'Services', value: 18, color: '#10b981' },
      { name: 'Other', value: 10, color: '#f59e0b' }
    ]
  }
};

export const Charts = () => {
  const { toggleSettingsPanel } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  const currentData = chartDataByPeriod[selectedPeriod];

  // Custom Donut Label to match percentage in slice center
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="charts-page-container">
      {/* PAGE HEADER */}
      <div className="charts-header">
        <div className="header-titles">
          <h1 className="charts-title">Charts</h1>
          <p className="charts-subtitle">Visual analytics with multiple chart types</p>
        </div>

        {/* TIME RANGE DROPDOWN */}
        <div className="period-dropdown-wrapper">
          <select 
            className="period-dropdown"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            aria-label="Select Time Range"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Quarter">This Quarter</option>
            <option value="This Year">This Year</option>
          </select>
          <FiChevronDown className="dropdown-arrow" size={14} />
        </div>
      </div>

      {/* 2x2 CHART GRID */}
      <div className="charts-grid">

        {/* CARD 1: SALES VS RETURNS (LINE CHART) */}
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Sales vs Returns</h3>
            <span className="card-subtitle">Line chart overview</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={currentData.salesReturns} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#202945" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#6c757d" tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis stroke="#6c757d" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151a30', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="returns" 
                  stroke="#06b6d4" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-custom-legend">
            <span className="legend-item"><span className="dot cyan"></span> returns</span>
            <span className="legend-item"><span className="dot purple"></span> sales</span>
          </div>
        </div>

        {/* CARD 2: DAILY ORDERS (BAR CHART) */}
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Daily Orders</h3>
            <span className="card-subtitle">Bar chart — this week</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={currentData.dailyOrders} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#202945" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#6c757d" tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis stroke="#6c757d" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151a30', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CARD 3: REVENUE VS COST (AREA CHART) */}
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Revenue vs Cost</h3>
            <span className="card-subtitle">Area chart — quarterly</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={currentData.revenueCost} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#202945" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="quarter" stroke="#6c757d" tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis stroke="#6c757d" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151a30', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-custom-legend">
            <span className="legend-item"><span className="dot cyan"></span> cost</span>
            <span className="legend-item"><span className="dot purple"></span> revenue</span>
          </div>
        </div>

        {/* CARD 4: REVENUE BY CATEGORY (DONUT CHART) */}
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Revenue by Category</h3>
            <span className="card-subtitle">Donut chart breakdown</span>
          </div>
          <div className="donut-card-content">
            <div className="donut-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={currentData.revenueCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {currentData.revenueCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151a30', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="category-legend-list">
              {currentData.revenueCategory.map((item, idx) => (
                <div className="category-legend-item" key={idx}>
                  <div className="cat-left">
                    <span className="cat-color-box" style={{ backgroundColor: item.color }}></span>
                    <span className="cat-name">{item.name}</span>
                  </div>
                  <span className="cat-val">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
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
    </div>
  );
};

export default Charts;