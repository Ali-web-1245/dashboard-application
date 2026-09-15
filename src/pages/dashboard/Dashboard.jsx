import React, { useState } from 'react';
import { 
  BsThreeDots, 
  BsArrowUpRight,      
  BsArrowDownRight,   
  BsChevronDown,
  BsGridFill
} from 'react-icons/bs';
import { 
  FiFolder, 
  FiShoppingBag, 
  FiTable, 
  FiChevronRight 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import './dashboard.css';

// Monthly stacked growth chart dummy data
const growthData = [
  { month: 'Jan', investment: 30, loss: 40, profit: 35, maintenance: 0 },
  { month: 'Feb', investment: 125, loss: 15, profit: 145, maintenance: 0 },
  { month: 'Mar', investment: 40, loss: 12, profit: 30, maintenance: 75 },
  { month: 'Apr', investment: 25, loss: 45, profit: 35, maintenance: 0 },
  { month: 'May', investment: 40, loss: 60, profit: 20, maintenance: 0 },
  { month: 'Jun', investment: 80, loss: 40, profit: 105, maintenance: 115 },
  { month: 'Jul', investment: 70, loss: 45, profit: 100, maintenance: 0 },
  { month: 'Aug', investment: 25, loss: 15, profit: 15, maintenance: 0 },
  { month: 'Sep', investment: 40, loss: 12, profit: 60, maintenance: 0 },
  { month: 'Oct', investment: 50, loss: 80, profit: 45, maintenance: 0 },
  { month: 'Nov', investment: 25, loss: 18, profit: 25, maintenance: 150 },
  { month: 'Dec', investment: 75, loss: 75, profit: 10, maintenance: 0 },
];

// Sparkline mini data for Total Order card
const miniOrderData = [
  { val: 10 }, { val: 25 }, { val: 18 }, { val: 40 }, { val: 22 }, { val: 54 }
];

// Bajaj Finery mini area chart data
const bajajAreaChartData = [
  { val: 30 }, { val: 40 }, { val: 35 }, { val: 90 }, { val: 65 }, { val: 75 }, { val: 60 }
];

// Stock list array
const initialStocks = [
  { id: 1, name: 'Bajaj Finserv', price: '$1839.00', percentage: '10%', type: 'profit' },
  { id: 2, name: 'TTML', price: '$100.00', percentage: '10%', type: 'loss' },
  { id: 3, name: 'Reliance', price: '$200.00', percentage: '10%', type: 'profit' },
  { id: 4, name: 'TTML', price: '$189.00', percentage: '10%', type: 'loss' },
  { id: 5, name: 'Stolon', price: '$189.00', percentage: '10%', type: 'loss' }
];

export const Dashboard = () => {
  // States
  const [orderPeriod, setOrderPeriod] = useState('year'); // 'month' | 'year'
  const [growthFilter, setGrowthFilter] = useState('Today');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [earningMenuOpen, setEarningMenuOpen] = useState(false);
  const [growthMenuOpen, setGrowthMenuOpen] = useState(false);
  const [stocksMenuOpen, setStocksMenuOpen] = useState(false);

  // Dynamic values
  const earningData = { title: "Total Earning", value: "$500.00" };
  const orderData = { title: "Total Order", value: orderPeriod === 'year' ? "$961" : "$420" };

  return (
    <div className="dashboard-container">
      {/* TOP SUMMARY CARDS SECTION */}
      <div className="top-cards-grid">
        
        {/* 1. Total Earning Card */}
        <div className="summary-card earning-card">
          <div className="card-bg-shape purple-shape-1"></div>
          <div className="card-bg-shape purple-shape-2"></div>
          
          <div className="card-header">
            <div className="icon-wrapper purple-icon">
              <FiFolder size={20} />
            </div>
            <div className="menu-dropdown-container">
              <button 
                className="icon-btn" 
                aria-label="Earning Options"
                onClick={() => setEarningMenuOpen(!earningMenuOpen)}
              >
                <BsThreeDots size={18} />
              </button>
              {earningMenuOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => setEarningMenuOpen(false)}>Import Data</button>
                  <button onClick={() => setEarningMenuOpen(false)}>Refresh</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="card-body">
            <div className="value-trend">
              <span className="card-value">{earningData.value}</span>
              <span className="trend-circle">
                <BsArrowUpRight size={16} />
              </span>
            </div>
            <p className="card-title">{earningData.title}</p>
          </div>
        </div>

        {/* 2. Total Order Card */}
        <div className="summary-card order-card">
          <div className="card-bg-shape blue-shape"></div>
          
          <div className="card-header">
            <div className="icon-wrapper blue-icon">
              <FiShoppingBag size={20} />
            </div>
            <div className="period-toggle">
              <button 
                className={`toggle-btn ${orderPeriod === 'month' ? 'active' : ''}`}
                onClick={() => setOrderPeriod('month')}
              >
                Month
              </button>
              <button 
                className={`toggle-btn ${orderPeriod === 'year' ? 'active' : ''}`}
                onClick={() => setOrderPeriod('year')}
              >
                Year
              </button>
            </div>
          </div>

          <div className="order-card-content">
            <div className="order-text">
              <div className="value-trend">
                <span className="card-value">{orderData.value}</span>
                <span className="trend-circle down">
                  <BsArrowDownRight size={16} />
                </span>
              </div>
              <p className="card-title">{orderData.title}</p>
            </div>
            
            {/* Sparkline chart */}
            <div className="sparkline-container">
              <ResponsiveContainer width="100%" height={50}>
                <AreaChart data={miniOrderData}>
                  <Area type="monotone" dataKey="val" stroke="#ffffff" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Stacked Income Cards */}
        <div className="income-stacked-cards">
          {/* First Income Card */}
          <div className="summary-card income-card primary-income">
            <div className="income-card-inner">
              <div className="icon-wrapper blue-icon-solid">
                <FiTable size={18} />
              </div>
              <div className="income-details">
                <h3 className="income-value">$203k</h3>
                <p className="income-title">Total Income</p>
              </div>
            </div>
          </div>

          {/* Second Income Card */}
          <div className="summary-card income-card dark-income">
            <div className="card-bg-shape dark-glow"></div>
            <div className="income-card-inner">
              <div className="icon-wrapper gold-icon">
                <BsGridFill size={18} />
              </div>
              <div className="income-details">
                <h3 className="income-value">$203k</h3>
                <p className="income-title">Total Income</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT AREA: GROWTH CHART & STOCKS */}
      <div className="main-dashboard-grid">
        
        {/* TOTAL GROWTH BAR CHART SECTION */}
        <div className="dashboard-box growth-box">
          <div className="box-header">
            <div className="growth-title-area">
              <span className="box-subtitle">Total Growth</span>
              <h2 className="box-main-value">$2,324.00</h2>
            </div>

            <div className="growth-controls">
              {/* Dropdown for timeframe */}
              <div className="custom-select-container">
                <button 
                  className="select-btn"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  {growthFilter} <BsChevronDown size={12} />
                </button>
                {isFilterOpen && (
                  <div className="select-menu">
                    {['Today', 'This Week', 'This Month', 'This Year'].map((opt) => (
                      <div 
                        key={opt} 
                        className="select-item"
                        onClick={() => { setGrowthFilter(opt); setIsFilterOpen(false); }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Menu */}
              <div className="menu-dropdown-container">
                <button 
                  className="grid-menu-btn"
                  aria-label="Growth Menu"
                  onClick={() => setGrowthMenuOpen(!growthMenuOpen)}
                >
                  <BsThreeDots size={16} />
                </button>
                {growthMenuOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => setGrowthMenuOpen(false)}>Download CSV</button>
                    <button onClick={() => setGrowthMenuOpen(false)}>View Details</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recharts Stacked Bar Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={growthData} barSize={14} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#5d6994" tickLine={false} axisLine={{ stroke: '#28335e' }} />
                <YAxis stroke="#5d6994" tickLine={false} axisLine={false} tickCount={5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a223f', borderColor: '#28335e', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="rect"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#8492c4' }}
                />
                <Bar dataKey="investment" name="Investment" stackId="a" fill="#1e88e5" />
                <Bar dataKey="loss" name="Loss" stackId="a" fill="#5c8bb5" />
                <Bar dataKey="profit" name="Profit" stackId="a" fill="#7c4dff" />
                <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill="#90caf9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* POPULAR STOCKS SECTION */}
        <div className="dashboard-box stocks-box">
          <div className="box-header">
            <h3 className="stocks-heading">Popular Stocks</h3>
            <div className="menu-dropdown-container">
              <button 
                className="icon-btn-muted" 
                aria-label="Stocks Options"
                onClick={() => setStocksMenuOpen(!stocksMenuOpen)}
              >
                <BsThreeDots size={18} />
              </button>
              {stocksMenuOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => setStocksMenuOpen(false)}>Refresh List</button>
                  <button onClick={() => setStocksMenuOpen(false)}>Export List</button>
                </div>
              )}
            </div>
          </div>

          {/* Featured Stock Highlight */}
          <div className="featured-stock-card">
            <div className="featured-stock-info">
              <div>
                <h4 className="featured-name">Bajaj Finery</h4>
                <span className="featured-tag">10% Profit</span>
              </div>
              <div className="featured-price">$1839.00</div>
            </div>

            <div className="featured-chart-wrapper">
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={bajajAreaChartData}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c4dff" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#7c4dff" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="val" 
                    stroke="#7c4dff" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#purpleGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock Itemized List */}
          <div className="stocks-list">
            {initialStocks.map((stock) => (
              <div key={stock.id} className="stock-item">
                <div className="stock-meta">
                  <h5 className="stock-name">{stock.name}</h5>
                  <span className={`stock-status ${stock.type}`}>
                    {stock.percentage} {stock.type === 'profit' ? 'Profit' : 'Loss'}
                  </span>
                </div>
                <div className="stock-price-indicator">
                  <span className="stock-price">{stock.price}</span>
                  <div className={`indicator-badge ${stock.type}`}>
                    {stock.type === 'profit' ? (
                     <BsArrowUpRight size={14} />
                    ) : (
                      <BsArrowDownRight size={14} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Action */}
          <div className="stocks-footer">
            <button className="view-all-btn">
              View All <FiChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;