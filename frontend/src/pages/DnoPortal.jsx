import React, { useState } from 'react';
import { ShieldCheck, MapPin, AlertCircle, Camera, CheckCircle2, Search, LogIn, Filter } from 'lucide-react';

export default function DnoPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dummy State for Auth
  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  // Mock Citizen Complaints Data
  const [complaints, setComplaints] = useState([
    { id: 'GRV-7721', type: 'Project Complaint', location: 'Ward 4 CC Road', severity: 'Critical', citizen: 'Rahul S.', date: 'Today, 10:45 AM', desc: 'The concrete mix used is extremely poor. Cracks have appeared just 2 days after laying the road.', status: 'Pending Verification', hasEvidence: true },
    { id: 'GRV-7722', type: 'Data Discrepancy', location: 'Govt Primary School', severity: 'Moderate', citizen: 'Anita K.', date: 'Yesterday', desc: 'Portal shows project is 100% complete, but the boundary wall is only half finished.', status: 'Pending Verification', hasEvidence: true },
    { id: 'GRV-7719', type: 'System Bug', location: 'N/A', severity: 'Low', citizen: 'Vikram D.', date: 'Oct 12', desc: 'Unable to view the AI Copilot cost estimates on my mobile browser.', status: 'Verified', hasEvidence: false }
  ]);

  const verifyComplaint = (id) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'Verified & Escalated' } : c));
  };

  if (!isLoggedIn) {
    return (
      <div className="page-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
        <form onSubmit={handleAuth} style={{ maxWidth: '400px', width: '100%', background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid var(--line-strong)', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <ShieldCheck size={40} color="var(--navy)" style={{ marginBottom: '16px' }} />
            <h2 style={{ margin: '0 0 8px 0', color: 'var(--navy)' }}>DNO Authorized Login</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>Central Grievance Redressal System</p>
          </div>
          
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600' }}>Official Email / DNO ID</label>
          <input type="text" placeholder="dno.district@gov.in" required style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '6px', border: '1px solid var(--line-strong)' }} />
          
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600' }}>Secure Password</label>
          <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '6px', border: '1px solid var(--line-strong)' }} />
          
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: 'clamp(16px, 3vw, 32px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--line-strong)', paddingBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy)', margin: '0 0 8px 0' }}>Grievance Redressal Dashboard</h1>
          <p style={{ color: 'var(--ink-soft)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--sage)" /> Logged in as: District Nodal Officer (Ranchi)
          </p>
        </div>
        <button onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--line-strong)', borderRadius: '6px', cursor: 'pointer' }}>Log Out</button>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {complaints.map((complaint) => {
          const isCritical = complaint.severity === 'Critical';
          const isPending = complaint.status === 'Pending Verification';
          
          return (
            <div key={complaint.id} style={{ background: '#fff', border: `1px solid ${isCritical ? '#fca5a5' : 'var(--line-strong)'}`, borderRadius: '12px', padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap', borderLeft: `6px solid ${isCritical ? '#ef4444' : complaint.severity === 'Moderate' ? '#f59e0b' : '#22c55e'}` }}>
              
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink-soft)', background: 'var(--paper-alt)', padding: '4px 10px', borderRadius: '4px' }}>{complaint.id}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{complaint.date}</span>
                  {complaint.hasEvidence && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--navy)', fontWeight: '600' }}><Camera size={14} /> Evidence Attached</span>}
                </div>
                
                <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', margin: '0 0 8px 0' }}>{complaint.type}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--ink)', margin: '0 0 16px 0', lineHeight: '1.5' }}>"{complaint.desc}"</p>
                
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> {complaint.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Citizen: {complaint.citizen}</span>
                </div>
              </div>

              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px', justifyContent: 'center' }}>
                {isPending ? (
                  <>
                    <button onClick={() => verifyComplaint(complaint.id)} style={{ width: '100%', padding: '10px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} /> Verify Evidence
                    </button>
                    <button style={{ width: '100%', padding: '10px', background: 'transparent', color: 'var(--ink)', border: '1px solid var(--line-strong)', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>
                      Reject / Invalid
                    </button>
                  </>
                ) : (
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', textAlign: 'center', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} /> {complaint.status}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}