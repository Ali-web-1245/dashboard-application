import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers & Layout
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from "./components/layout/Layout";
// Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Data from './pages/data/Data';
import Users from './pages/users/Users';
import Customers from './pages/customers/Customers';
import CRM from './pages/crm/CRM';
import Blog from './pages/blog/Blog';
import Invoice from './pages/invoice/Invoice';
import Charts from './pages/charts/Charts';
import Statistics from './pages/statistics/Statistics';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Default redirect to Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Application Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data" element={<Data />} />
            <Route path="/users" element={<Users />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/statistics" element={<Statistics />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;