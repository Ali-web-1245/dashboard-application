import React, { useState } from 'react';
import { 
  FiDollarSign, 
  FiCalendar, 
  FiFileText, 
  FiDownload, 
  FiUserCheck, 
  FiShoppingBag, 
  FiEye, 
  FiFile, 
  FiAlertCircle, 
  FiFolder, 
  FiUsers, 
  FiPieChart, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin, 
  FiYoutube, 
  FiAward, 
  FiSun, 
  FiShare2, 
  FiCheckSquare, 
  FiGrid, 
  FiClock, 
  FiSettings 
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './statistics.css';

// Data Structures
const initialTopSummary = [
  { id: 1, title: "All Earnings", value: "$20,000", icon: <FiDollarSign size={18} />, colorClass: "icon-purple" },
  { id: 2, title: "Task", value: "145", icon: <FiCalendar size={18} />, colorClass: "icon-red" },
  { id: 3, title: "Page Views", value: "290+", icon: <FiFileText size={18} />, colorClass: "icon-green" },
  { id: 4, title: "Downloads", value: "500", icon: <FiDownload size={18} />, colorClass: "icon-blue" }
];

const initialColoredBannerCards = [
  { 
    id: 1, 
    title: "Revenue", 
    value: "$42,562", 
    subtitle: "$2,651 last month", 
    icon: <FiDollarSign size={32} />, 
    bgClass: "card-banner-purple" 
  },
  { 
    id: 2, 
    title: "Orders Received", 
    value: "486", 
    subtitle: "20% increase", 
    icon: <FiUserCheck size={32} />, 
    bgClass: "card-banner-blue" 
  },
  { 
    id: 3, 
    title: "Total Sales", 1641: "1641", 
    subtitle: "$2,651 revenue increase", 
    icon: <FiShoppingBag size={32} />, 
    bgClass: "card-banner-orange" 
  }
];

const initialDarkMetricsRow = [
  { id: 1, label: "Visitors", value: "6035", icon: <FiEye size={16} /> },
  { id: 2, label: "Invoices", value: "19", icon: <FiFile size={16} /> },
  { id: 3, label: "Issues", value: "63", icon: <FiAlertCircle size={16} /> },
  { id: 4, label: "Projects", value: "95%", icon: <FiFolder size={16} /> }
];

const initialBlockBadgesRow = [
  { id: 1, title: "Last week users", value: "2,672", icon: <FiUsers size={20} />, bgClass: "badge-purple" },
  { id: 2, title: "Total earning", value: "$6391", icon: <FiPieChart size={20} />, bgClass: "badge-blue" },
  { id: 3, title: "Today visitors", value: "9,276", icon: <FiEye size={20} />, bgClass: "badge-green" },
  { id: 4, title: "New order", value: "3,619", icon: <FiShoppingBag size={20} />, bgClass: "badge-red" }
];

const initialPerformanceCards = [
  {
    id: 1,
    title: "Total Paid Users",
    value: "7652",
    percentage: "8% Less Last 3 Months",
    isNegative: true
  },
  {
    id: 2,
    title: "Order Status",
    value: "625",
    percentage: "6% From Last 3 Months",
    isNegative: false
  },
  {
    id: 3,
    title: "Unique Visitors",
    value: "6522",
    percentage: "10% From Last 3 Months",
    isNegative: true
  },
  {
    id: 4,
    title: "Monthly Earnings",
    value: "5963",
    percentage: "36% From Last 6 Months",
    isNegative: false
  }
];

const initialSocialCards = [
  { id: 1, name: "Facebook Users", count: "1165 +", icon: <FiFacebook size={24} />, bgClass: "social-purple" },
  { id: 2, name: "Twitter Users", count: "780 +", icon: <FiTwitter size={24} />, bgClass: "social-cyan" },
  { id: 3, name: "Linked In Users", count: "998 +", icon: <FiLinkedin size={24} />, bgClass: "social-grey" },
  { id: 4, name: "Youtube Videos", count: "650 +", icon: <FiYoutube size={24} />, bgClass: "social-red" }
];

const initialImpressionGroup = [
  { id: 1, label: "Impressions", value: "1,563", timeframe: "May 08 - June 08 (Total)", icon: <FiEye size={18} /> },
  { id: 2, label: "Goal", value: "30,564", timeframe: "May 08 - June 08 (Total)", icon: <FiPieChart size={18} /> },
  { id: 3, label: "Impact", value: "42.6%", timeframe: "May 08 - June 08 (Total)", icon: <FiTrendingUp size={18} /> }
];

const initialProgressIndicators = [
  { id: 1, label: "Published Project", value: "532", progressColor: "#7c3aed", percent: 65 },
  { id: 2, label: "Completed Task", value: "4,569", progressColor: "#10b981", percent: 85 },
  { id: 3, label: "Pending Task", value: "1,005", progressColor: "#f59e0b", percent: 40 },
  { id: 4, label: "Issues", value: "365", progressColor: "#ef4444", percent: 25 }
];

const initialLowerBannerCards = [
  { id: 1, title: "Daily user", value: "1,658", icon: <FiUsers size={28} />, bgClass: "card-banner-purple" },
  { id: 2, title: "Daily pageview", value: "1K", icon: <FiFileText size={28} />, bgClass: "card-banner-blue" },
  { id: 3, title: "Last month visitor", value: "5,678", icon: <FiAward size={28} />, bgClass: "card-banner-green" }
];

const initialSatisfactionStats = [
  { label: "previous", value: "56.75" },
  { label: "change", value: "+12.60" },
  { label: "trend", value: "23.7%" }
];

const initialGridWidgets = [
  { id: 1, label: "SHARES", value: "1000", icon: <FiShare2 size={16} /> },
  { id: 2, label: "NETWORK", value: "600", icon: <FiCheckSquare size={16} /> },
  { id: 3, label: "RETURNS", value: "3550", icon: <FiGrid size={16} /> },
  { id: 4, label: "ORDER", value: "100%", icon: <FiClock size={16} /> }
];

export const Statistics = () => {
  const { toggleSettingsPanel } = useTheme();

  // Component State
  const [satisfactionScore] = useState("89.73%");
  const [weatherTemp] = useState("19°");
  const [weatherCondition] = useState("Sunny");

  return (
    <div className="statistics-page-container">
      {/* HEADER NAVBAR / TITLE AREA */}
      <div className="stats-header-bar">
        <h2 className="stats-page-title">Statistics</h2>
        <div className="stats-breadcrumb">
          <span>Home</span> / <span className="active">Statistics</span>
        </div>
      </div>

      {/* ROW 1: TOP COMPACT SUMMARY CARDS */}
      <div className="stats-grid-4">
        {initialTopSummary.map((item) => (
          <div className="stats-card row1-card" key={item.id}>
            <div className="row1-text">
              <span className="row1-val">{item.value}</span>
              <span className="row1-title">{item.title}</span>
            </div>
            <div className={`row1-icon ${item.colorClass}`}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* ROW 2: LARGE COLORED BANNER CARDS */}
      <div className="stats-grid-3 margin-top">
        {initialColoredBannerCards.map((banner) => (
          <div className={`stats-banner-card ${banner.bgClass}`} key={banner.id}>
            <div className="banner-info">
              <span className="banner-title">{banner.title}</span>
              <h2 className="banner-value">{banner.id === 3 ? banner["1641"] : banner.value}</h2>
              <span className="banner-sub">{banner.subtitle}</span>
            </div>
            <div className="banner-icon-bg">{banner.icon}</div>
          </div>
        ))}
      </div>

      {/* ROW 3: COMPACT DARK METRICS */}
      <div className="stats-grid-4 margin-top">
        {initialDarkMetricsRow.map((metric) => (
          <div className="stats-card row3-card" key={metric.id}>
            <div className="row3-left">
              <span className="row3-icon">{metric.icon}</span>
              <span className="row3-label">{metric.label}</span>
            </div>
            <span className="row3-value">{metric.value}</span>
          </div>
        ))}
      </div>

      {/* ROW 4: BLOCK BADGES METRICS */}
      <div className="stats-grid-4 margin-top">
        {initialBlockBadgesRow.map((badge) => (
          <div className="stats-card row4-card" key={badge.id}>
            <div className={`row4-badge ${badge.bgClass}`}>{badge.icon}</div>
            <div className="row4-info">
              <h3 className="row4-val">{badge.value}</h3>
              <span className="row4-title">{badge.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 5: PERFORMANCE STATS WITH PERCENTAGES */}
      <div className="stats-grid-4 margin-top">
        {initialPerformanceCards.map((item) => (
          <div className="stats-card row5-card" key={item.id}>
            <span className="row5-title">{item.title}</span>
            <div className="row5-value-row">
              {item.isNegative ? (
                <FiTrendingDown className="trend-icon negative" size={16} />
              ) : (
                <FiTrendingUp className="trend-icon positive" size={16} />
              )}
              <h3 className="row5-val">{item.value}</h3>
            </div>
            <span className={`row5-percent ${item.isNegative ? 'negative' : 'positive'}`}>
              {item.percentage}
            </span>
          </div>
        ))}
      </div>

      {/* ROW 6: SOCIAL NETWORKS SUMMARY */}
      <div className="stats-grid-4 margin-top">
        {initialSocialCards.map((social) => (
          <div className={`social-banner-card ${social.bgClass}`} key={social.id}>
            <div className="social-left">
              <h3 className="social-count">{social.count}</h3>
              <span className="social-name">{social.name}</span>
            </div>
            <div className="social-icon">{social.icon}</div>
          </div>
        ))}
      </div>

      {/* ROW 7: IMPRESSIONS & TIMEFRAME CARDS */}
      <div className="stats-grid-3 margin-top">
        {initialImpressionGroup.map((imp) => (
          <div className="stats-card row7-card" key={imp.id}>
            <div className="row7-text">
              <span className="row7-label">{imp.label}</span>
              <h3 className="row7-val">{imp.value}</h3>
              <span className="row7-time">{imp.timeframe}</span>
            </div>
            <div className="row7-icon">{imp.icon}</div>
          </div>
        ))}
      </div>

      {/* ROW 8: PROGRESS INDICATORS */}
      <div className="stats-grid-4 margin-top">
        {initialProgressIndicators.map((prog) => (
          <div className="stats-card row8-card" key={prog.id}>
            <div className="row8-top">
              <span className="row8-label">{prog.label}</span>
            </div>
            <h3 className="row8-val">{prog.value}</h3>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${prog.percent}%`, backgroundColor: prog.progressColor }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ROW 9: LOWER COLORED BANNER CARDS */}
      <div className="stats-grid-3 margin-top">
        {initialLowerBannerCards.map((banner) => (
          <div className={`stats-banner-card ${banner.bgClass}`} key={banner.id}>
            <div className="banner-info">
              <h2 className="banner-value">{banner.value}</h2>
              <span className="banner-title">{banner.title}</span>
            </div>
            <div className="banner-icon-bg">{banner.icon}</div>
          </div>
        ))}
      </div>

      {/* ROW 10: BOTTOM CUSTOMER SATISFACTION, SMALL WIDGETS & WEATHER CARD */}
      <div className="bottom-dashboard-grid margin-top">
        {/* CUSTOMER SATISFACTION */}
        <div className="stats-card satisfaction-card">
          <span className="card-section-header">Customer satisfaction</span>
          <div className="satisfaction-body">
            <h1 className="satisfaction-score">{satisfactionScore}</h1>
            <div className="satisfaction-bar">
              <div className="satisfaction-bar-fill" style={{ width: '89.73%' }} />
            </div>
            <div className="satisfaction-stats-row">
              {initialSatisfactionStats.map((st, idx) => (
                <div key={idx} className="sat-stat-item">
                  <span className="sat-stat-label">{st.label}</span>
                  <span className="sat-stat-val">{st.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2X2 MINI WIDGET GRID */}
        <div className="widgets-2x2-grid">
          {initialGridWidgets.map((w) => (
            <div className="stats-card mini-widget-card" key={w.id}>
              <div className="widget-icon">{w.icon}</div>
              <div className="widget-info">
                <span className="widget-val">{w.value}</span>
                <span className="widget-label">{w.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* WEATHER & ACTION CARD */}
        <div className="weather-container-row">
          <div className="stats-card weather-card">
            <div className="weather-temp">{weatherTemp}</div>
            <div className="weather-info">
              <FiSun className="sun-icon" size={20} />
              <span>{weatherCondition}</span>
            </div>
          </div>
          <div className="stats-banner-card card-banner-blue weather-action-card">
            <FiSun size={32} className="weather-big-icon" />
            <span className="banner-title">New York, NY</span>
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

export default Statistics;