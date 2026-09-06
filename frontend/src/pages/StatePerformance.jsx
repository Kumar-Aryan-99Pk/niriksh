import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UtilizationMap from '../components/UtilizationMap';

// Sequence updated: Data Table -> Geographic Map -> Utilization Graph
const PAGES = ['Data Table', 'Geographic Map', 'Utilization Graph'];

export default function StatePerformance() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);
  const mapWrapperRef = useRef(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/state-summary`)
      .then(res => {
        const payload = res.data.data || res.data;
        if (Array.isArray(payload)) {
          const sortedStates = payload.sort((a, b) => {
            const valA = parseFloat((a['Utilization %'] || '0').toString().replace('%', ''));
            const valB = parseFloat((b['Utilization %'] || '0').toString().replace('%', ''));
            return valB - valA;
          });
          setStates(sortedStates);
        } else {
          setStates([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const wrapper = mapWrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e) => {
      e.stopPropagation();
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', handleWheel);
  }, []);

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    scrollTimeout.current = setTimeout(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      
      setActiveIndex((prevIndex) => {
        if (prevIndex !== index) return index;
        return prevIndex;
      });
    }, 100); 
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--ink-soft)', fontFamily: 'var(--font-body)' }}>
        Loading State Performance Data...
      </div>
    );
  }

  const utilVariant = (val) => (val > 75 ? 'high' : val > 40 ? 'mid' : 'low');

  return (
    <div style={{
      padding: 'clamp(16px, 3vw, 24px)',
      background: 'var(--paper)',
      height: 'calc(100vh - 40px)', 
      boxSizing: 'border-box',
      overflow: 'hidden', 
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-body)'
    }}>

      {/* Fixed Header */}
      <div style={{ flexShrink: 0, marginBottom: '18px' }}>
        {/* <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 1.7rem)', color: 'var(--navy)', fontWeight: '600', margin: '0 0 6px 0' }}>
          State-Wise MPLADS Performance
        </h1> */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: 'var(--navy)', marginBottom: '8px', fontWeight: '700' }}>
            State-Wise MPLADS Performance
          </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', margin: 0 }}>
          Visualizing fund utilization percentages and project completion rates across Indian states.
        </p>
      </div>

      {/* Fixed Navigation Buttons (Scrollable on mobile) */}
      <div className="no-scrollbar" style={{ 
        flexShrink: 0, 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '18px', 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '4px' 
      }}>
        {PAGES.map((label, idx) => (
          <button
            key={label}
            onClick={() => scrollToIndex(idx)}
            className={`state-nav-btn ${activeIndex === idx ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {idx + 1}. {label}
          </button>
        ))}
      </div>

      {/* Dynamic Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar"
        style={{
          flex: 1,
          minHeight: 0, 
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          gap: '20px'
        }}
      >

        {/* PAGE 1: Data Table */}
        <div style={{ flex: '0 0 100%', scrollSnapAlign: 'start', height: '100%', minHeight: 0, width: '100%' }}>
          <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Added overflow-x auto and min-width to prevent squishing on mobile */}
            <div className="no-scrollbar" style={{ flex: 1, minHeight: 0, overflow: 'auto', overscrollBehavior: 'contain', width: '100%' }}>
              <table className="data-table" style={{ margin: 0, tableLayout: 'fixed', minWidth: '700px', width: '100%' }}>
                <colgroup>
                  <col style={{ width: '32%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>State</th>
                    <th>Total Works</th>
                    <th>Completed</th>
                    <th>Pending</th>
                    <th>Utilization %</th>
                  </tr>
                </thead>
                <tbody>
                  {states.map((st, i) => (
                    <tr key={i}>
                      <td><strong>{st.State}</strong></td>
                      <td className="mono">{st['Total Works'] || st.Total_Works || 0}</td>
                      <td className="mono">{st.Completed || st.Completed_Works || 0}</td>
                      <td className="mono">{st.Pending || st.Pending_Works || 0}</td>
                      <td className="mono"><strong>{st['Utilization %'] || (st.Utilization_Pct + '%') || '0%'}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PAGE 2: Geographic Map */}
        <div style={{ flex: '0 0 100%', scrollSnapAlign: 'start', height: '100%', minHeight: 0, width: '100%' }}>
          <div ref={mapWrapperRef} className="panel" style={{ padding: '10px', height: '100%', touchAction: 'none' }}>
            <UtilizationMap />
          </div>
        </div>

        {/* PAGE 3: Utilization Graph */}
        <div style={{ flex: '0 0 100%', scrollSnapAlign: 'start', height: '100%', minHeight: 0, width: '100%' }}>
          <div className="panel" style={{ padding: 'clamp(16px, 3vw, 22px)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 3vw, 1.15rem)', color: 'var(--ink)', fontWeight: '600', marginBottom: '16px', flexShrink: 0 }}>
              States by Fund Utilization % (Sorted Descending)
            </h3>

            <div className="no-scrollbar" style={{
              flex: 1,
              minHeight: 0, 
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
              paddingRight: '10px',
              overscrollBehavior: 'contain'
            }}>
              {states.map((s, idx) => {
                const rawUtil = s['Utilization %'] || s['Utilization_Pct'] || '0';
                const utilVal = parseFloat(rawUtil.toString().replace('%', ''));
                return (
                  <div key={idx} className="util-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="util-label" style={{ flex: '0 0 120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
                      {s.State}
                    </span>
                    <div className="util-track" style={{ flex: 1 }}>
                      <div
                        className={`util-fill util-fill--${utilVariant(utilVal)}`}
                        style={{ width: `${Math.min(utilVal, 100)}%` }}
                      />
                    </div>
                    <span className="util-pct" style={{ flex: '0 0 45px', textAlign: 'right', fontSize: '0.85rem' }}>
                      {utilVal.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}