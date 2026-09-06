import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react'; 

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

export default function RiskCenter() {
  const [risks, setRisks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/risk-center`)
      .then(res => {
        setRisks(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Reset page when filter or search changes
  const handleFilterChange = (sev) => {
    setFilter(sev);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div className="page" style={{ padding: '20px', color: 'var(--ink-soft)' }}>Loading Risk Audit Queue...</div>;

  // 1. First apply Severity Filter
  let filteredRisks = filter === 'All' ? risks : risks.filter(r => r.Risk_Severity === filter);

  // 2. Then apply Text Search Filter (MP, State, or Description)
  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filteredRisks = filteredRisks.filter(r => {
      const matchState = (r.State || '').toLowerCase().includes(term);
      const matchMP = (r['MP Name'] || '').toLowerCase().includes(term);
      const matchDesc = (r['Work Description'] || r.description || '').toLowerCase().includes(term);
      return matchState || matchMP || matchDesc;
    });
  }

  // Calculate chunked data for current page
  const totalPages = Math.ceil(filteredRisks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRisks = filteredRisks.slice(startIndex, startIndex + itemsPerPage);

  const Pager = ({ align = 'space-between' }) => (
    <div className="pager-bar" style={{ justifyContent: align, display: 'flex', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
      {align === 'space-between' && (
        <span style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', flex: '1 1 auto' }}>
          Showing items {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRisks.length)} of {filteredRisks.length}
        </span>
      )}
      <div className="pager-controls" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          className="pager-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
        >
          Previous
        </button>
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Page {currentPage} of {totalPages || 1}</span>
        <button
          className="pager-btn"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ padding: '16px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '24px' }}>
        {/* <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: 'var(--navy)', marginBottom: '8px' }}>
          Risk Center
        </h1> */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: 'var(--navy)', marginBottom: '8px', fontWeight: '700' }}>
            Risk Center
          </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
          Transparent audit trail featuring exact cost multipliers, vendor monopoly share percentages, and plain-English risk factors.
        </p>
      </div>

      {/* Top Controls: Severity Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div className="filter-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: '1 1 auto' }}>
          {SEVERITIES.map(sev => (
            <button
              key={sev}
              onClick={() => handleFilterChange(sev)}
              className={`filter-chip filter-chip--${sev.toLowerCase()} ${filter === sev ? 'active' : ''}`}
            >
              {sev} ({sev === 'All' ? risks.length : risks.filter(r => r.Risk_Severity === sev).length})
            </button>
          ))}
        </div>

        {/* Dynamic Search Bar (Fluid width for mobile) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '350px', flexShrink: 0 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--ink-soft)' }} />
          <input
            type="text"
            placeholder="Search MP, State, or Project..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '10px 16px 10px 38px',
              borderRadius: '6px',
              border: '1px solid var(--line-strong)',
              background: 'var(--paper)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--ink)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <Pager />

      {/* Responsive Table Wrapper */}
      <div className="table-frame" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', borderRadius: '8px', border: '1px solid var(--line)' }}>
        <table className="data-table" style={{ minWidth: '1000px', width: '100%', borderCollapse: 'collapse' }}>
          <colgroup>
            <col style={{ width: '13%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '24%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>ID, State & MP</th>
              <th>Description & Category</th>
              <th>Vendor / Agency</th>
              <th>Final Cost</th>
              <th>Severity</th>
              <th>Score</th>
              <th>Audit Justification</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRisks.map(item => (
              <tr key={item['Work ID']}>
                <td>
                  <strong>ID: {item['Work ID']}</strong><br />
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', display: 'block', marginTop: '2px' }}>{item.State}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: '600' }}>{item['MP Name']}</span>
                </td>
                <td style={{ maxWidth: '280px' }}>
                  <div style={{ marginBottom: '6px' }}>{item['Work Description'] || item['description'] || 'N/A'}</div>
                  <span className="tag">{item.Category || item['category'] || 'General'}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{item.Vendor || item['vendor'] || 'Unassigned'}</span>
                </td>
                <td className="mono">
                  <strong>₹{Number(item.amount || item['Final Amount (₹)'] || 0).toLocaleString('en-IN')}</strong><br/>
                  {/* <span style={{ 
                    fontSize: '0.75rem', 
                    color: item['Payment Status'] === 'Completed' ? 'var(--sage)' : 'var(--gold)',
                    fontWeight: '600',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {item['Payment Status'] || 'Completed'}
                  </span> */}
                </td>
                <td>
                  <span className={`badge ${(item.Risk_Severity || 'low').toLowerCase()}`}>
                    {item.Risk_Severity}
                  </span>
                </td>
                <td className="mono"><strong>{item.Risk_Score}</strong></td>
                <td>
                  <ul className="reason-list">
                    {item.Risk_Reasons?.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
            {paginatedRisks.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>
                  No anomalies match your filters or search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pager align="flex-end" />
    </div>
  );
}