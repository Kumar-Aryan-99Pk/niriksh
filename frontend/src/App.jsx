import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Users, BarChart3, MessageSquare, Sparkles, HardHat, Building } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import RiskCenter from './pages/RiskCenter';
import StatePerformance from './pages/StatePerformance';
import MpPerformance from './pages/MpPerformance';
import ComparePage from './pages/ComparePage';
import ProjectDetails from './pages/ProjectDetails';
import MpProfile from './pages/MpProfile';
import OfficerCopilot from './pages/OfficerCopilot'; // <-- Added Import
import FeedbackPage from './pages/FeedbackPage'; // <-- Add this import
import VendorPortal from './pages/VendorPortal';
import './index.css'; 
import Footer from './components/Footer';
import VendorRegistry from './pages/VendorRegistry';
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? "active" : ""}>
      {children}
    </Link>
  );
}

// Temporary Feedback Placeholder Component

// Extracted Navigation Component to handle the sliding line logic
function TopNav({ houseFilter, setHouseFilter }) {
  const location = useLocation();
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  // Recalculate the line's position every time the route changes
  useEffect(() => {
    // A small timeout ensures React has finished applying the ".active" class to the DOM
    setTimeout(() => {
      if (navRef.current) {
        const activeLink = navRef.current.querySelector('a.active');
        if (activeLink) {
          setIndicator({
            left: activeLink.offsetLeft,
            width: activeLink.offsetWidth,
            opacity: 1 // Fade in after initial mount to prevent jumping from the left edge
          });
        }
      }
    }, 50);
  }, [location.pathname]);

  return (
    <nav className="top-navbar">
      <div className="logo-section">
        <h1 style={{ fontFamily: "monospace" }}>NIRIKSH</h1>
      </div>
      
      <div className="nav-links" ref={navRef}>
        <NavLink to="/"><LayoutDashboard size={18} /> Overview</NavLink>
        <NavLink to="/risk-center"><Map size={18} /> Find Projects</NavLink>
        <NavLink to="/states"><BarChart3 size={18} /> Browse States</NavLink>
        <NavLink to="/mps"><Users size={18} /> Browse MPs</NavLink>
        <NavLink to="/compare"><BarChart3 size={18} /> Compare</NavLink>
        <NavLink to="/vendors"><HardHat size={18} /> Agencies</NavLink>
        <NavLink to="/vendor-portal"><Building size={18} /> Vendor Portal</NavLink> {/* <-- Added Link */}
        <NavLink to="/copilot"><Sparkles size={18} /> AI Copilot</NavLink> {/* <-- Added Link */}
        <NavLink to="/feedback"><MessageSquare size={18} /> Feedback</NavLink>
        
        {/* The Animated Magic Line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: indicator.left,
          width: indicator.width,
          opacity: indicator.opacity,
          height: '3px',
          backgroundColor: 'var(--gold, #B4872A)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '3px 3px 0 0'
        }} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <select 
          value={houseFilter}
          onChange={(e) => setHouseFilter(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', cursor: 'pointer', fontWeight: '500', color: '#334155' }}
        >
          <option value="Both Houses">Both Houses</option>
          <option value="Lok Sabha">Lok Sabha</option>
          <option value="Rajya Sabha">Rajya Sabha</option>
        </select>
      </div>
    </nav>
  );
}

function App() {
  const [houseFilter, setHouseFilter] = useState('Both Houses');

  return (
    <Router>
      <div className="app-wrapper">
        <TopNav houseFilter={houseFilter} setHouseFilter={setHouseFilter} />

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard houseFilter={houseFilter} />} />
            <Route path="/risk-center" element={<RiskCenter />} />
            <Route path="/states" element={<StatePerformance />} />
            <Route path="/mps" element={<MpPerformance />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/mp/:mpName" element={<MpProfile />} />
            <Route path="/vendors" element={<VendorRegistry />} /> {/* <-- ADD THIS */}
            <Route path="/vendor-portal" element={<VendorPortal />} /> {/* <-- Added Route */}
            <Route path="/copilot" element={<OfficerCopilot />} /> {/* <-- Fixed Route Syntax */}
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;