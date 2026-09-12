import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, ShieldCheck, ArrowRight, HardHat } from 'lucide-react';

export default function AccessGateway() {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ padding: 'clamp(16px, 3vw, 48px)', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--navy)', margin: '0 0 12px 0', fontWeight: '700' }}>
          Stakeholder Access Gateway
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Select your authorized operational role to access secure dashboards, verify citizen grievances, and manage civic contracts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '900px', width: '100%' }}>
        
        {/* DNO Access Card */}
        <div 
          className="card" 
          onClick={() => navigate('/dno-portal')}
          style={{ padding: '40px', background: '#fff', borderRadius: '16px', border: '1px solid var(--line-strong)', borderTop: '6px solid var(--navy)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ background: 'rgba(20, 33, 61, 0.05)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <ShieldCheck size={32} color="var(--navy)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '12px' }}>District Nodal Officer</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '24px', lineHeight: '1.5' }}>
            Access the Grievance Redressal Dashboard to verify citizen complaints, review photographic evidence, and initiate site inspections.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--navy)', fontWeight: '600' }}>
            DNO Login <ArrowRight size={18} />
          </div>
        </div>

        {/* Vendor Access Card */}
        <div 
          className="card" 
          onClick={() => navigate('/vendor-portal')}
          style={{ padding: '40px', background: '#fff', borderRadius: '16px', border: '1px solid var(--line-strong)', borderTop: '6px solid var(--sage)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ background: 'rgba(63, 107, 79, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <HardHat size={32} color="var(--sage)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '12px' }}>Vendor & Agency</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '24px', lineHeight: '1.5' }}>
            View your algorithmic trust score, submit Expressions of Interest (EOIs) for open tenders, and track active project compliance.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sage)', fontWeight: '600' }}>
            Agency Login <ArrowRight size={18} />
          </div>
        </div>

      </div>
    </div>
  );
}