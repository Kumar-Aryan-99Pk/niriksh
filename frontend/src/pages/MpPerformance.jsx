import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function MPPerformance() {
  const [mps, setMps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  // Reset to first page when searching
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div className="page-container" style={{ padding: '24px', color: 'var(--ink-soft)' }}>Loading MP Profiles...</div>;

  // 1. Filter MPs based on search
  const filteredMps = mps.filter(mp => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchName = (mp['MP Name'] || mp.name || '').toLowerCase().includes(term);
    const matchConst = (mp.Constituency || mp.constituency || '').toLowerCase().includes(term);
    const matchState = (mp.State || mp.state || '').toLowerCase().includes(term);
    return matchName || matchConst || matchState;
  });

  // 2. Paginate the filtered results
  const totalPages = Math.ceil(filteredMps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMps = filteredMps.slice(startIndex, startIndex + itemsPerPage);

  // Modern button style for pagination
  const btnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'var(--paper)',
    border: '1px solid var(--line-strong)',
    borderRadius: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: '500',
    color: 'var(--ink)',
    transition: 'all 0.2s ease'
  };

  return (
    <div className="page-container" style={{ padding: 'clamp(16px, 3vw, 24px)', boxSizing: 'border-box' }}>
      
      {/* Header & Search Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: 'var(--navy)', marginBottom: '8px', fontWeight: '700' }}>
            MP-Wise Fund Allocation & Utilization
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', margin: 0 }}>
            Comprehensive tracking of MP fund allocation, spending velocities, and governance grades.
          </p>
        </div>

        {/* Dynamic Search Bar (Fluid width for mobile) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '350px', flexShrink: 0 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--ink-soft)' }} />
          <input
            type="text"
            placeholder="Search by MP, Constituency, or State..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 16px 12px 38px',
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

      {/* Pagination Controls Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', fontWeight: '500' }}>
          Showing <strong style={{ color: 'var(--navy)' }}>{filteredMps.length > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: 'var(--navy)' }}>{Math.min(startIndex + itemsPerPage, filteredMps.length)}</strong> of {filteredMps.length} MPs
        </span>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            style={{ ...btnStyle, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--ink)', minWidth: '80px', textAlign: 'center' }}>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button 
            disabled={currentPage >= totalPages || totalPages === 0} 
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            style={{ ...btnStyle, cursor: currentPage >= totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages || totalPages === 0 ? 0.5 : 1 }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="table-frame" style={{ background: 'var(--paper)', borderRadius: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid var(--line)', width: '100%' }}>
        <table className="data-table" style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--navy)' }}>
            <tr>
              <th style={{ color: '#fff' }}>MP Name</th>
              <th style={{ color: '#fff' }}>Constituency</th>
              <th style={{ color: '#fff' }}>State</th>
              <th style={{ color: '#fff' }}>Allocated (₹)</th>
              <th style={{ color: '#fff' }}>Utilization %</th>
              <th style={{ color: '#fff', textAlign: 'center' }}>Governance Grade</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMps.map((mp, index) => {
              const allocated = mp['Allocated Amount (₹)'] || mp.allocated || 0;
              const formattedAlloc = typeof allocated === 'number' ? `₹${(allocated / 1e7).toFixed(2)} Cr` : allocated;
              const util = mp['Utilization %'] || mp.utilization_pct || 0;
              
              // Extract the first letter of the grade to ensure CSS classes map correctly
              const rawGrade = mp.Governance_Grade || mp.governance_grade || mp.Grade || mp.grade || 'C';
              const safeGradeClass = rawGrade.toString().trim().charAt(0).toLowerCase();

              return (
                <tr key={index}>
                  <td style={{ fontWeight: '600', color: 'var(--navy)' }}>{mp['MP Name'] || mp.name}</td>
                  <td>{mp['Constituency'] || mp.constituency}</td>
                  <td style={{ color: 'var(--ink-soft)' }}>{mp['State'] || mp.state}</td>
                  <td className="mono" style={{ fontWeight: '500' }}>{formattedAlloc}</td>
                  <td className="mono" style={{ fontWeight: '600' }}>
                    {typeof util === 'number' ? `${util.toFixed(2)}%` : util}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge grade-${safeGradeClass}`}>
                      Grade {rawGrade}
                    </span>
                  </td>
                </tr>
              );
            })}
            {paginatedMps.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>
                  No Parliamentarians found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Bottom */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', gap: '12px' }}>
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          style={{ ...btnStyle, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <button 
          disabled={currentPage >= totalPages || totalPages === 0} 
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          style={{ ...btnStyle, cursor: currentPage >= totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages || totalPages === 0 ? 0.5 : 1 }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}