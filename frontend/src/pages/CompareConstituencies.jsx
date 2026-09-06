import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ComparePage() {
  const [mps, setMps] = useState([]);
  const [mp1, setMp1] = useState(null);
  const [mp2, setMp2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/mp-performance')
      .then(res => {
        const payload = res.data.data || res.data;
        setMps(Array.isArray(payload) ? payload : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-container" style={{ color: 'var(--text-muted)' }}>Loading Constituency Data...</div>;

  // Robust Helpers: Safely extract metrics regardless of API key naming variations
  const getUtil = (mp) => {
    if (!mp) return 0;
    const val = mp['Utilization %'] || mp.utilization_pct || mp.Utilization_Pct || 0;
    return typeof val === 'number' ? val : parseFloat(val.toString().replace('%', '')) || 0;
  };

  const getCompleted = (mp) => {
    if (!mp) return 0;
    return parseInt(mp['Completed Works'] || mp.Completed_Works || mp.Completed || 0) || 0;
  };

  const getGradeClass = (mp) => {
    if (!mp) return 'c';
    const grade = mp.Governance_Grade || mp.governance_grade || mp.Grade || mp.grade || 'C';
    return grade.toString().trim().charAt(0).toLowerCase();
  };

  const selectStyle = {
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: '8px', 
    border: '1px solid var(--border-light)', 
    background: 'var(--bg-app)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    outline: 'none',
    cursor: 'pointer'
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '700' }}>
          Constituency & MP Comparison
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Evaluate head-to-head performance across fund utilization, project execution speed, and governance grading[cite: 3].
        </p>
      </div>

      {/* Selection Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>Select First MP / Constituency</label>
          <select 
            style={selectStyle}
            onChange={(e) => setMp1(mps.find(m => (m['MP Name'] || m.name) === e.target.value))}
            defaultValue=""
          >
            <option value="" disabled>Search & Select MP...</option>
            {mps.map((m, i) => (
              <option key={`mp1-${i}`} value={m['MP Name'] || m.name}>
                {m['MP Name'] || m.name} ({m.Constituency || m.constituency}, {m.State || m.state})
              </option>
            ))}
          </select>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>Select Second MP / Constituency</label>
          <select 
            style={selectStyle}
            onChange={(e) => setMp2(mps.find(m => (m['MP Name'] || m.name) === e.target.value))}
            defaultValue=""
          >
            <option value="" disabled>Search & Select MP...</option>
            {mps.map((m, i) => (
              <option key={`mp2-${i}`} value={m['MP Name'] || m.name}>
                {m['MP Name'] || m.name} ({m.Constituency || m.constituency}, {m.State || m.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head-to-Head Comparison */}
      {mp1 && mp2 && (
        <>
          {/* Comparative Stat Cards */}
          <div className="metrics-grid" style={{ marginBottom: '32px' }}>
            
            {/* Fund Utilization Winner */}
            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>Higher Fund Utilization</h4>
              {getUtil(mp1) > getUtil(mp2) ? (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--status-success)' }}>{mp1['MP Name'] || mp1.name}</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>{getUtil(mp1).toFixed(2)}% <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>vs</span> {getUtil(mp2).toFixed(2)}%</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--status-success)' }}>{mp2['MP Name'] || mp2.name}</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>{getUtil(mp2).toFixed(2)}% <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>vs</span> {getUtil(mp1).toFixed(2)}%</div>
                </>
              )}
            </div>

            {/* Most Works Completed */}
            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>Most Works Completed</h4>
              {getCompleted(mp1) > getCompleted(mp2) ? (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--brand-accent)' }}>{mp1['MP Name'] || mp1.name}</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>{getCompleted(mp1)} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>vs</span> {getCompleted(mp2)}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--brand-accent)' }}>{mp2['MP Name'] || mp2.name}</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>{getCompleted(mp2)} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>vs</span> {getCompleted(mp1)}</div>
                </>
              )}
            </div>

            {/* Governance Grade Matchup */}
            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>Governance Grades</h4>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <span className={`badge grade-${getGradeClass(mp1)}`} style={{ fontSize: '1.3rem', padding: '8px 20px', borderRadius: '8px' }}>
                  {mp1.Governance_Grade || mp1.governance_grade || mp1.Grade || mp1.grade || 'C'}
                </span>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>VS</span>
                <span className={`badge grade-${getGradeClass(mp2)}`} style={{ fontSize: '1.3rem', padding: '8px 20px', borderRadius: '8px' }}>
                  {mp2.Governance_Grade || mp2.governance_grade || mp2.Grade || mp2.grade || 'C'}
                </span>
              </div>
            </div>

          </div>

          {/* Visual Graphs Section */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '32px', fontWeight: '600', fontFamily: 'var(--font-display)', textTransform: 'none', letterSpacing: 'normal' }}>Performance Metrics Breakdown</h3>
            
            {/* Visual: Utilization Graph */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>Fund Utilization (%)</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
                <span style={{ width: '180px', fontSize: '0.95rem', textAlign: 'right', fontWeight: '500', color: 'var(--text-muted)' }}>{mp1['MP Name'] || mp1.name}</span>
                <div style={{ flex: 1, background: 'var(--bg-app)', height: '24px', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(getUtil(mp1), 100)}%`, background: 'var(--brand-accent)', height: '100%', transition: 'width 0.5s ease' }}></div>
                </div>
                <span style={{ width: '70px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{getUtil(mp1).toFixed(1)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ width: '180px', fontSize: '0.95rem', textAlign: 'right', fontWeight: '500', color: 'var(--text-muted)' }}>{mp2['MP Name'] || mp2.name}</span>
                <div style={{ flex: 1, background: 'var(--bg-app)', height: '24px', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(getUtil(mp2), 100)}%`, background: 'var(--status-high)', height: '100%', transition: 'width 0.5s ease' }}></div>
                </div>
                <span style={{ width: '70px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{getUtil(mp2).toFixed(1)}%</span>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--border-light)', margin: '32px 0' }} />

            {/* Visual: Completed Works Graph */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>Completed Projects</strong>
              </div>
              
              {(() => {
                const maxWorks = Math.max(getCompleted(mp1), getCompleted(mp2), 1);
                const w1Pct = (getCompleted(mp1) / maxWorks) * 100;
                const w2Pct = (getCompleted(mp2) / maxWorks) * 100;

                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
                      <span style={{ width: '180px', fontSize: '0.95rem', textAlign: 'right', fontWeight: '500', color: 'var(--text-muted)' }}>{mp1['MP Name'] || mp1.name}</span>
                      <div style={{ flex: 1, background: 'var(--bg-app)', height: '24px', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${w1Pct}%`, background: 'var(--status-success)', height: '100%', transition: 'width 0.5s ease' }}></div>
                      </div>
                      <span style={{ width: '70px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{getCompleted(mp1)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ width: '180px', fontSize: '0.95rem', textAlign: 'right', fontWeight: '500', color: 'var(--text-muted)' }}>{mp2['MP Name'] || mp2.name}</span>
                      <div style={{ flex: 1, background: 'var(--bg-app)', height: '24px', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${w2Pct}%`, background: 'var(--status-high)', height: '100%', transition: 'width 0.5s ease' }}></div>
                      </div>
                      <span style={{ width: '70px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{getCompleted(mp2)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

          </div>
        </>
      )}
    </div>
  );
}