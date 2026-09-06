import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, IndianRupee, Activity, CheckCircle2, Hourglass, FileText, Target, Percent, AlertTriangle } from 'lucide-react';

export default function MpProfile() {
  const { mpName } = useParams();
  const navigate = useNavigate();
  const [mp, setMp] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tab state for the Project Execution Ledger
  const [activeTab, setActiveTab] = useState('completed'); // 'completed' or 'recommended'

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/mp-performance`)
      .then(res => {
        const payload = res.data.data || res.data;
        const foundMp = Array.isArray(payload) ? payload.find(m => (m['MP Name'] || m.name) === decodeURIComponent(mpName)) : null;
        setMp(foundMp);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch MP details:", err);
        setLoading(false);
      });
  }, [mpName]);

  if (loading) return <div className="page-container" style={{ color: 'var(--ink-soft)' }}>Loading MP Dossier...</div>;
  if (!mp) return <div className="page-container" style={{ color: 'var(--brick)' }}>MP Record Not Found.</div>;

  // Safe data parsers
  const utilVal = parseFloat((mp['Utilization %'] || mp.utilization_pct || '0').toString().replace('%', ''));
  const allocated = typeof (mp['Allocated Amount (₹)'] || mp.allocated) === 'number' 
    ? `₹${((mp['Allocated Amount (₹)'] || mp.allocated) / 1e7).toFixed(2)} Cr` 
    : (mp['Allocated Amount (₹)'] || mp.allocated || 'N/A');
  
  const grade = mp.Governance_Grade || mp.governance_grade || mp.Grade || mp.grade || 'C';
  const gradeClass = grade.toString().trim().charAt(0).toLowerCase();

  // Execution Metrics Calculations
  const completedWorks = parseInt(mp['Completed Works'] || mp.Completed || 0);
  const pendingWorks = parseInt(mp['Pending Works'] || mp.Pending || 0);
  const recommendedWorks = parseInt(mp['Works Recommended'] || mp.Recommended || (completedWorks + pendingWorks));
  const completionRate = recommendedWorks > 0 ? ((completedWorks / recommendedWorks) * 100).toFixed(1) : 0;

  // Extended Hackathon Mock Data for both tabs
  const mockCompleted = [
    { name: "Construction of CC Road in Ward 4", category: "Infrastructure", cost: "₹4.50 Lakhs", status: "Completed", date: "2023-10-12" },
    { name: "Installation of Solar Street Lights", category: "Energy", cost: "₹2.25 Lakhs", status: "Completed", date: "2023-11-05" },
    { name: "Community Hall Renovation", category: "Public Facility", cost: "₹12.00 Lakhs", status: "Completed", date: "2024-01-20" },
    { name: "Provision of Computers for Govt School", category: "Education", cost: "₹3.80 Lakhs", status: "Completed", date: "2024-02-15" },
    { name: "Water Purification Plant", category: "Water Supply", cost: "₹8.50 Lakhs", status: "Completed", date: "2024-03-10" }
  ];

  const mockRecommended = [
    { name: "Upgradation of Rural Dispensary", category: "Healthcare", cost: "₹15.00 Lakhs", status: "Approved", date: "2024-06-01" },
    { name: "Construction of Passenger Waiting Shed", category: "Infrastructure", cost: "₹3.50 Lakhs", status: "Pending", date: "2024-07-12" },
    { name: "Library Books and Furniture", category: "Education", cost: "₹2.00 Lakhs", status: "Ongoing", date: "2024-08-05" },
    { name: "Sports Equipment for Youth Club", category: "Sports", cost: "₹1.50 Lakhs", status: "Pending Review", date: "2024-08-20" },
    { name: "Deep Tube Well Installation", category: "Water Supply", cost: "₹5.00 Lakhs", status: "Approved", date: "2024-09-02" }
  ];

  // If actual API provides 'mp.projects', filter it. Otherwise, use our mock ledgers.
  const displayProjects = mp.projects 
    ? mp.projects.filter(p => activeTab === 'completed' ? p.status.toLowerCase() === 'completed' : p.status.toLowerCase() !== 'completed')
    : (activeTab === 'completed' ? mockCompleted : mockRecommended);

  return (
    <div className="page-container">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', marginBottom: '24px', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Profile Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '32px', marginBottom: '32px', borderTop: '4px solid var(--navy)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--navy)', marginBottom: '8px' }}>
            {mp['MP Name'] || mp.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-soft)', fontSize: '1.05rem' }}>
            <MapPin size={18} color="var(--gold)" />
            <span>{mp.Constituency || mp.constituency}, {mp.State || mp.state}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', fontWeight: '600' }}>Governance Grade</div>
          <span className={`badge grade-${gradeClass}`} style={{ fontSize: '1.6rem', padding: '12px 24px', borderRadius: '4px' }}>
            {grade}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '16px' }}>Financial & Execution Metrics</h3>
      <div className="metrics-grid" style={{ marginBottom: '32px' }}>
        <div className="kpi-card kpi-card--navy">
          <div className="kpi-icon-wrap"><IndianRupee size={24} /></div>
          <div className="kpi-body">
            <div className="kpi-title">Total Allocated</div>
            <div className="kpi-value">{allocated}</div>
            <div className="kpi-subtitle">Total funds allocated to MP</div>
          </div>
        </div>

        <div className="kpi-card kpi-card--gold">
          <div className="kpi-icon-wrap"><Activity size={24} /></div>
          <div className="kpi-body">
            <div className="kpi-title">Fund Utilization</div>
            <div className="kpi-value">{utilVal.toFixed(2)}%</div>
            <div className="kpi-subtitle">Share of allocation recommended</div>
          </div>
        </div>

        <div className="kpi-card kpi-card--sage">
          <div className="kpi-icon-wrap"><CheckCircle2 size={24} /></div>
          <div className="kpi-body">
            <div className="kpi-title">Works Completed</div>
            <div className="kpi-value">{completedWorks}</div>
            <div className="kpi-subtitle">Fully executed local projects</div>
          </div>
        </div>

        <div className="kpi-card kpi-card--brick">
          <div className="kpi-icon-wrap"><Hourglass size={24} /></div>
          <div className="kpi-body">
            <div className="kpi-title">Works Pending</div>
            <div className="kpi-value">{pendingWorks}</div>
            <div className="kpi-subtitle">Projects awaiting completion</div>
          </div>
        </div>
      </div>

      {/* Project Execution Ledger */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <FileText size={22} color="var(--navy)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--navy)', margin: 0 }}>Project Execution Ledger</h3>
            </div>
            <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Comprehensive view of recommended and completed constituent works.</p>
          </div>
          
          {/* Mini-Stats for the Ledger */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}><Target size={14}/> Recommended</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--navy)', fontFamily: 'var(--font-mono)' }}>{recommendedWorks}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}><Percent size={14}/> Completion Rate</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--sage)', fontFamily: 'var(--font-mono)' }}>{completionRate}%</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('completed')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontFamily: 'var(--font-body)', 
              fontWeight: '600', 
              transition: 'all 0.2s',
              background: activeTab === 'completed' ? 'var(--navy)' : 'transparent',
              color: activeTab === 'completed' ? '#fff' : 'var(--ink-soft)',
              border: `1px solid ${activeTab === 'completed' ? 'var(--navy)' : 'var(--line-strong)'}`
            }}
          >
            Completed Works
          </button>
          <button 
            onClick={() => setActiveTab('recommended')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontFamily: 'var(--font-body)', 
              fontWeight: '600', 
              transition: 'all 0.2s',
              background: activeTab === 'recommended' ? 'var(--navy)' : 'transparent',
              color: activeTab === 'recommended' ? '#fff' : 'var(--ink-soft)',
              border: `1px solid ${activeTab === 'recommended' ? 'var(--navy)' : 'var(--line-strong)'}`
            }}
          >
            Recommended Works
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Project Description</th>
              <th>Category</th>
              <th>Est. Cost</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {displayProjects.map((proj, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '500', color: 'var(--navy)' }}>{proj.name}</td>
                <td>{proj.category}</td>
                <td className="mono">{proj.cost}</td>
                <td>
                  <span className={`badge ${proj.status.toLowerCase() === 'completed' ? 'completed' : 'pending'}`}>
                    {proj.status}
                  </span>
                </td>
                <td className="mono">{proj.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ML Ledger Section Placeholder */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <AlertTriangle size={22} color="var(--brick)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--navy)', margin: 0 }}>Project Risk & Anomaly Ledger</h3>
        </div>
        <p style={{ color: 'var(--ink-soft)', lineHeight: '1.6', marginBottom: '20px' }}>
          This section is reserved for the Machine Learning Anomaly Detection Engine. Once deployed, it will list flagged projects, financial discrepancies, and geographic misallocations specific to this MP's portfolio.
        </p>
        <div style={{ padding: '20px', background: 'var(--paper-alt)', border: '1px dashed var(--line-strong)', borderRadius: '4px', textAlign: 'center', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
          Awaiting ML Model Integration...
        </div>
      </div>

    </div>
  );
}