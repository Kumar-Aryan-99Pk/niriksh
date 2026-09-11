import React, { useState } from 'react';
import '../VendorPortal.css';
import { 
  ShieldCheck, HardHat, FileText, CheckCircle2, 
  Building, Award, LogIn, ArrowRight, 
  Clock, Check, MapPin, IndianRupee 
} from 'lucide-react';

export default function VendorPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  
  // Dummy Credentials State
  const [email, setEmail] = useState('vendor@bharatbuild.in');
  const [password, setPassword] = useState('admin123');
  const [vendorIdType, setVendorIdType] = useState('GeM_Seller_ID');
  
  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1px solid var(--line-strong)', background: '#fff',
    fontFamily: 'var(--font-body)', fontSize: '1rem',
    color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
    marginBottom: '16px'
  };

  if (!isLoggedIn) {
    return (
      <div className="vendor-page-container auth-background">
        <div className="vendor-card auth-card">
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', background: 'var(--navy)', padding: '16px', borderRadius: '12px', color: 'var(--gold)', marginBottom: '16px' }}>
              <HardHat size={32} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--navy)', margin: '0 0 8px 0', fontWeight: '700' }}>
              Vendor & Agency Gateway
            </h1>
            <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Authenticate to access civic contracts and view your regional trust index.</p>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '6px', borderRadius: '10px', marginBottom: '24px', border: '1px solid var(--line)' }}>
            <button 
              onClick={() => setAuthMode('login')}
              className={`auth-toggle-btn ${authMode === 'login' ? 'active' : ''}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthMode('register')}
              className={`auth-toggle-btn ${authMode === 'register' ? 'active' : ''}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuth}>
            {authMode === 'register' && (
              <>
                <label className="input-label">Registered Company Name</label>
                <input type="text" placeholder="e.g., Bharat Build Consortium" style={inputStyle} required />
                
                <label className="input-label">Government Vendor ID Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={vendorIdType} onChange={(e) => setVendorIdType(e.target.value)}>
                  <option value="GeM_Seller_ID">GeM Seller ID</option>
                  <option value="Udyam">Udyam Registration (MSME)</option>
                  <option value="GSTIN">GSTIN</option>
                  <option value="CPPP">CPPP eProcurement ID</option>
                </select>

                <label className="input-label">{vendorIdType.replace(/_/g, ' ')} Number</label>
                <input type="text" placeholder="Enter official ID for verification" style={inputStyle} required />
              </>
            )}

            <label className="input-label">Email Address / Vendor ID</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vendor@domain.com" style={inputStyle} required />

            <label className="input-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} required />

            <button type="submit" className="submit-btn">
              {authMode === 'login' ? <><LogIn size={20} /> Access Portal</> : <><CheckCircle2 size={20} /> Submit for Verification</>}
            </button>
            
            {authMode === 'login' && (
              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                Demo Credentials: <strong>vendor@bharatbuild.in</strong> / <strong>admin123</strong>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Active Dashboard State
  const openWorks = [
    { id: 'MPL-UP-882', title: 'CC Road Construction', location: 'Uttar Pradesh', category: 'Roads, Pathways and Bridges', estCost: '₹28.5 Lakhs', status: 'Open for EOI' },
    { id: 'MPL-JH-441', title: 'Primary School Classroom Construction', location: 'Jharkhand', category: 'Education', estCost: '₹15.0 Lakhs', status: 'Bid Submitted' },
    { id: 'MPL-DL-109', title: 'Solar Street Lighting (50 Poles)', location: 'Delhi', category: 'Electricity/Lighting', estCost: '₹6.0 Lakhs', status: 'Open for EOI' }
  ];

  return (
    <div className="vendor-page-container dashboard-container">
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Building size={28} color="var(--navy)" />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy)', margin: 0, fontWeight: '700' }}>
              Bharat Build Consortium
            </h1>
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--sage)" /> Verified GeM Seller (GEM-VND-8821)
          </div>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="logout-btn">
          Log Out
        </button>
      </div>

      {/* Trust Score Telemetry */}
      <h2 className="section-title">
        <Award size={20} color="var(--gold)" /> Algorithmic Trust Profile
      </h2>
      
      <div className="metrics-grid">
        <div className="vendor-card metric-card tier-card">
          <div className="metric-label">Overall Trust Score</div>
          <div className="metric-value trust-score">
            94<span>/100</span>
          </div>
          <div className="metric-subtext">
            <Check size={16} color="var(--sage)" /> Tier A+ (Preferred Vendor)
          </div>
        </div>

        <div className="vendor-card metric-card">
          <div className="metric-label"><Clock size={16} /> Timely Completion</div>
          <div className="metric-value">91%</div>
          <div className="metric-subtext alt">Average delay: &lt; 14 days</div>
        </div>

        <div className="vendor-card metric-card">
          <div className="metric-label"><IndianRupee size={16} /> Cost Overrun Risk</div>
          <div className="metric-value">2.4%</div>
          <div className="metric-subtext alt">Historical budget deviation</div>
        </div>
      </div>

      {/* Active Work Requests */}
      <h2 className="section-title">
        <FileText size={20} color="var(--gold)" /> Open Civic Contracts & EOIs
      </h2>

      <div className="works-list">
        {openWorks.map((work, idx) => (
          <div key={work.id} className="work-item" style={{ borderBottom: idx === openWorks.length - 1 ? 'none' : '1px solid var(--line)' }}>
            
            <div className="work-details">
              <div className="work-meta">{work.id} • {work.category}</div>
              <div className="work-title">{work.title}</div>
              <div className="work-tags">
                <span><MapPin size={16} color="var(--gold)" /> {work.location}</span>
                <span><IndianRupee size={16} color="var(--sage)" /> Est: {work.estCost}</span>
              </div>
            </div>

            <div className="work-action">
              {work.status === 'Open for EOI' ? (
                <button className="eoi-btn">
                  Submit EOI <ArrowRight size={16} />
                </button>
              ) : (
                <div className="submitted-badge">
                  <CheckCircle2 size={16} /> Bid Submitted
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}