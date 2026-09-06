import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ComparePage() {
  const [mps, setMps] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Array holding up to 4 selected MP names
  const [selections, setSelections] = useState(["", "", "", ""]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/mp-performance`)
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

  if (loading) return <div className="page-container" style={{ padding: '24px', color: 'var(--ink-soft)' }}>Loading Constituency Data...</div>;

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
    borderRadius: '6px', 
    border: '1px solid var(--line-strong, #B7AF98)', 
    background: 'var(--paper, #F1EEE6)',
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: '0.95rem',
    color: 'var(--ink, #1C1B18)',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box'
  };

  // Filter unique valid MPs chosen in the dropdowns
  const activeMps = selections
    .map(name => mps.find(m => (m['MP Name'] || m.name) === name))
    .filter(Boolean)
    .filter((mp, index, self) => self.findIndex(t => (t['MP Name'] || t.name) === (mp['MP Name'] || mp.name)) === index); // Remove duplicates

  const handleSelect = (index, value) => {
    const newSelections = [...selections];
    newSelections[index] = value === "NONE" ? "" : value;
    setSelections(newSelections);
  };

  // Calculate top performers
  const topUtilMp = activeMps.length > 0 ? activeMps.reduce((prev, current) => (getUtil(prev) > getUtil(current)) ? prev : current) : null;
  const topWorksMp = activeMps.length > 0 ? activeMps.reduce((prev, current) => (getCompleted(prev) > getCompleted(current)) ? prev : current) : null;

  // Theme colors allocated to up to 4 comparison bars
  const barColors = ['var(--navy, #14213D)', 'var(--gold, #B4872A)', 'var(--sage, #3F6B4F)', 'var(--brick, #8C3A2B)'];

  return (
    <div className="page-container" style={{ padding: 'clamp(16px, 3vw, 24px)', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '32px' }}>
        {/* <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: 'var(--navy, #14213D)', marginBottom: '8px', fontWeight: '600' }}>
          Constituency & MP Comparison
        </h1> */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: 'var(--navy)', marginBottom: '8px', fontWeight: '700' }}>
            Constituency & MP Comparison
          </h1>
        <p style={{ color: 'var(--ink-soft, #514E46)', fontSize: '0.95rem', margin: 0 }}>
          Evaluate head-to-head performance across fund utilization, project execution speed, and governance grading (up to 4 MPs).
        </p>
      </div>

      {/* Selection Controls - Fluid Grid for Mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[0, 1, 2, 3].map((slotIndex) => (
          <div className="card" key={slotIndex} style={{ padding: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'var(--ink, #1C1B18)', fontFamily: 'var(--font-display, serif)', fontSize: '0.9rem' }}>
              {slotIndex < 2 ? `Select MP ${slotIndex + 1}` : `Select MP ${slotIndex + 1} (Optional)`}
            </label>
            <select 
              style={selectStyle}
              value={selections[slotIndex]}
              onChange={(e) => handleSelect(slotIndex, e.target.value)}
            >
              <option value="" disabled>Search & Select MP...</option>
              {slotIndex >= 2 && <option value="NONE">-- Clear Selection --</option>}
              {mps.map((m, i) => (
                <option key={`mp-${slotIndex}-${i}`} value={m['MP Name'] || m.name}>
                  {m['MP Name'] || m.name} ({m.Constituency || m.constituency})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Head-to-Head Comparison - Needs at least 2 MPs selected */}
      {activeMps.length >= 2 && (
        <>
          {/* Comparative Stat Cards - Auto stacking grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '24px', marginBottom: '32px' }}>
            
            {/* Fund Utilization Winner */}
            <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <h4 style={{ color: 'var(--ink-soft, #514E46)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-display, serif)', letterSpacing: '0.5px' }}>Top Fund Utilization</h4>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--ink, #1C1B18)' }}>{topUtilMp['MP Name'] || topUtilMp.name}</div>
              <div style={{ fontSize: '1rem', color: 'var(--ink-soft, #514E46)', marginTop: '8px', fontFamily: 'var(--font-mono, monospace)' }}>
                {activeMps.map(m => `${getUtil(m).toFixed(2)}%`).join(' vs ')}
              </div>
            </div>

            {/* Most Works Completed */}
            <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <h4 style={{ color: 'var(--ink-soft, #514E46)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-display, serif)', letterSpacing: '0.5px' }}>Most Works Completed</h4>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--ink, #1C1B18)' }}>{topWorksMp['MP Name'] || topWorksMp.name}</div>
              <div style={{ fontSize: '1rem', color: 'var(--ink-soft, #514E46)', marginTop: '8px', fontFamily: 'var(--font-mono, monospace)' }}>
                {activeMps.map(m => getCompleted(m)).join(' vs ')} Projects
              </div>
            </div>

            {/* Governance Grade Matchup */}
            <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <h4 style={{ color: 'var(--ink-soft, #514E46)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-display, serif)', letterSpacing: '0.5px' }}>Governance Grades</h4>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {activeMps.map((mp, idx) => (
                  <React.Fragment key={idx}>
                    <span className={`badge grade-${getGradeClass(mp)}`} style={{ fontSize: '1.1rem', padding: '6px 14px', borderRadius: '4px' }}>
                      Grade {mp.Governance_Grade || mp.governance_grade || mp.Grade || mp.grade || 'C'}
                    </span>
                    {idx < activeMps.length - 1 && <span style={{ color: 'var(--ink-soft, #514E46)', fontWeight: '600', fontSize: '0.9rem' }}>VS</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>

          {/* Visual Graphs Section */}
          <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--navy, #14213D)', marginBottom: '32px', fontWeight: '600', fontFamily: 'var(--font-display, serif)', textTransform: 'none', letterSpacing: 'normal' }}>Performance Metrics Breakdown</h3>
            
            {/* Visual: Utilization Graph - Redesigned to stack names on top of bars for mobile */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <strong style={{ color: 'var(--ink, #1C1B18)', fontSize: '1rem' }}>Fund Utilization (%)</strong>
              </div>
              
              {activeMps.map((mp, idx) => (
                <div key={`util-${idx}`} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px', gap: '12px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--ink-soft, #514E46)', lineHeight: '1.2' }}>{mp['MP Name'] || mp.name}</span>
                    <span style={{ fontWeight: '600', fontFamily: 'var(--font-mono, monospace)', fontSize: '1.05rem', color: 'var(--ink)' }}>{getUtil(mp).toFixed(1)}%</span>
                  </div>
                  <div style={{ width: '100%', background: 'var(--paper-alt, #E7E2D3)', height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(getUtil(mp), 100)}%`, background: barColors[idx % barColors.length], height: '100%', transition: 'width 0.5s ease', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--line, #D3CDBC)', margin: '32px 0' }} />

            {/* Visual: Completed Works Graph - Redesigned to stack names on top of bars for mobile */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <strong style={{ color: 'var(--ink, #1C1B18)', fontSize: '1rem' }}>Completed Projects</strong>
              </div>
              
              {(() => {
                const maxWorks = Math.max(...activeMps.map(m => getCompleted(m)), 1);

                return activeMps.map((mp, idx) => {
                  const wPct = (getCompleted(mp) / maxWorks) * 100;
                  
                  return (
                    <div key={`works-${idx}`} style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px', gap: '12px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--ink-soft, #514E46)', lineHeight: '1.2' }}>{mp['MP Name'] || mp.name}</span>
                        <span style={{ fontWeight: '600', fontFamily: 'var(--font-mono, monospace)', fontSize: '1.05rem', color: 'var(--ink)' }}>{getCompleted(mp)}</span>
                      </div>
                      <div style={{ width: '100%', background: 'var(--paper-alt, #E7E2D3)', height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${wPct}%`, background: barColors[idx % barColors.length], height: '100%', transition: 'width 0.5s ease', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

          </div>
        </>
      )}
      
      {/* Prompt for users when < 2 MPs are selected */}
      {activeMps.length > 0 && activeMps.length < 2 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)', background: 'var(--paper-alt)', borderRadius: '8px', border: '1px dashed var(--line-strong)' }}>
          Please select at least one more MP to view the comparison matrix.
        </div>
      )}
    </div>
  );
}