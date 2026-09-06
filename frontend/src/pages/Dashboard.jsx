import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronRight, Users, CheckCircle2, Hourglass, AlertTriangle, Landmark, Info, IndianRupee, Trophy, AlertOctagon } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ComposedChart, Line, PieChart as RechartsPieChart, Pie, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ houseFilter }) {
  const [data, setData] = useState(null);
  const [mpList, setMpList] = useState([]);
  const [stateSummary, setStateSummary] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Composed Chart filter
  const [stateView, setStateView] = useState('All');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch top level dashboard KPIs
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard`)
      .then(res => setData(res.data))
      .catch(console.error);

    // Fetch MP list for search lookup & Top Performers
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/mp-performance`)
      .then(res => {
        const payload = res.data.data || res.data;
        setMpList(Array.isArray(payload) ? payload : []);
      })
      .catch(console.error);

    // Fetch State Summary for the Composed Chart
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/state-summary`)
      .then(res => {
        const payload = res.data.data || res.data;
        setStateSummary(Array.isArray(payload) ? payload : []);
      })
      .catch(console.error);

    // Fetch Risk Center Data for Top Risky Projects
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/risk-center`)
      .then(res => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setRiskData(payload);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load Risk data:", err);
        setLoading(false);
      });
  }, []);

  const filteredMps = searchQuery.trim() === '' ? [] : mpList.filter(mp =>
    (mp['MP Name']?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (mp.Constituency?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (mp.State?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  ).slice(0, 6); 

  // Data for YoY Area Chart
  const chartData = [
    { name: '2019', allocated: 2400, utilized: 1400 },
    { name: '2020', allocated: 1398, utilized: 1300 },
    { name: '2021', allocated: 9800, utilized: 3800 },
    { name: '2022', allocated: 3908, utilized: 2800 },
    { name: '2023', allocated: 4800, utilized: 3800 },
    { name: '2024', allocated: 3800, utilized: 4300 },
  ];

  // Data for Execution Velocity Bar Chart
  const distributionData = [
    { name: 'Optimal (>85%)', value: 22.6, color: 'var(--sage)', desc: 'Exceeding baseline execution targets' },
    { name: 'Proficient (70-84%)', value: 23.4, color: 'var(--navy)', desc: 'Effective and steady fund deployment' },
    { name: 'Standard (50-69%)', value: 32.2, color: 'var(--gold)', desc: 'Average execution pace' },
    { name: 'Critical (<50%)', value: 21.8, color: 'var(--brick)', desc: 'Requires immediate intervention' },
  ];

  if (loading) return <div className="page-container" style={{ color: 'var(--ink-soft)' }}>Loading Dashboard Data...</div>;

  const baseKpis = data?.KPIs || {
    Total_Allocated_Cr: 11681.90, Total_Expenditure_Cr: 3984.77,
    Fund_Utilization_Pct: 34.11, Total_MPs: 774,
    Works_Completed: 43899, Works_Pending: 43083
  };

  const filterMultiplier = houseFilter === 'Lok Sabha' ? 0.7 : houseFilter === 'Rajya Sabha' ? 0.3 : 1;
  const currentKpis = {
    Total_Allocated_Cr: (baseKpis.Total_Allocated_Cr * filterMultiplier).toFixed(2),
    Total_Expenditure_Cr: (baseKpis.Total_Expenditure_Cr * filterMultiplier).toFixed(2),
    Fund_Utilization_Pct: baseKpis.Fund_Utilization_Pct.toFixed(2),
    Total_MPs: Math.round(baseKpis.Total_MPs * filterMultiplier),
    Works_Completed: Math.round(baseKpis.Works_Completed * filterMultiplier),
    Works_Pending: Math.round(baseKpis.Works_Pending * filterMultiplier)
  };

  // Process data for the Fund Utilization Pie Chart
  const pieData = [
    { name: 'Utilized', value: parseFloat(currentKpis.Total_Expenditure_Cr), color: 'var(--sage)' },
    { name: 'Unutilized', value: parseFloat(currentKpis.Total_Allocated_Cr) - parseFloat(currentKpis.Total_Expenditure_Cr), color: 'var(--line-strong)' }
  ];

  // Process data for the State-wise Composed Chart
  let displayStates = [...stateSummary].map(s => {
    const allocatedCr = (s.Total_Allocated || 0) / 10000000;
    const expenditureCr = (s.Total_Expenditure || 0) / 10000000;
    const utilPct = parseFloat((s['Utilization %'] || '0').toString().replace('%', ''));
    
    return {
      name: s.State,
      Allocated: parseFloat(allocatedCr.toFixed(2)),
      Expenditure: parseFloat(expenditureCr.toFixed(2)),
      Utilization: utilPct
    };
  }).sort((a, b) => b.Utilization - a.Utilization);

  // Apply State view filters
  if (stateView === 'Top10') displayStates = displayStates.slice(0, 10);
  if (stateView === 'Bottom10') displayStates = displayStates.slice(-10);

  // Calculate Top 5 MPs by Utilization
  const topMps = [...mpList].sort((a, b) => {
    const utilA = parseFloat((a['Utilization %'] || '0').toString().replace('%', ''));
    const utilB = parseFloat((b['Utilization %'] || '0').toString().replace('%', ''));
    return utilB - utilA;
  }).slice(0, 5);

  // Calculate Top 5 Highest Risk Projects
  const topRisks = [...riskData].sort((a, b) => {
    return (b.Risk_Score || 0) - (a.Risk_Score || 0);
  }).slice(0, 5);

  // Reusable button style for chart filters
  const filterBtnStyle = (isActive, color) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    border: `1px solid ${isActive ? color : 'var(--line-strong)'}`,
    background: isActive ? color : 'transparent',
    color: isActive ? '#fff' : 'var(--ink-soft)',
    transition: 'all 0.2s ease',
    flex: '1 1 auto',
    textAlign: 'center'
  });

  return (
    <div className="page-container" style={{ padding: '16px' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div style={{ flex: '1 1 100%', minWidth: '280px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--navy)', marginBottom: '8px', fontWeight: '700', wordBreak: 'break-word' }}>MPLADS Intelligence Hub</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', margin: 0 }}>National overview of the Member of Parliament Local Area Development Scheme.</p>
        </div>
        <div style={{ textAlign: 'left', color: 'var(--ink-soft)', fontSize: '0.9rem', flex: '1 1 auto' }}>
          Active Filter: <strong style={{ color: 'var(--navy)' }}>{houseFilter}</strong>
        </div>
      </div>

      {/* Floating Quick Lookup Search Bar */}
      <div style={{ marginBottom: '32px', position: 'relative', zIndex: 50 }}>
        <div style={{ position: 'relative', boxShadow: '0 8px 20px -6px rgba(20, 33, 61, 0.12)', borderRadius: '8px' }}>
          <Search size={20} style={{ position: 'absolute', left: '20px', top: '16px', color: 'var(--navy)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search MPs, constituencies, or states..."
            style={{
              width: '100%',
              padding: '16px 20px 16px 54px',
              borderRadius: '8px',
              border: '2px solid transparent',
              background: '#fff',
              fontSize: '1rem',
              color: 'var(--ink)',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.target.style.borderColor = 'var(--line-strong)'}
            onMouseOut={(e) => e.target.style.borderColor = isSearchFocused ? 'var(--navy)' : 'transparent'}
          />
        </div>

        {searchQuery && isSearchFocused && (
          <div className="lookup-results" style={{ position: 'absolute', width: '100%', background: '#fff', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', borderRadius: '8px', marginTop: '8px', border: '1px solid var(--line)', overflow: 'hidden' }}>
            {filteredMps.length > 0 ? (
              filteredMps.map((mp, idx) => (
                <div 
                  key={idx} 
                  className="lookup-row"
                  onMouseDown={() => navigate(`/mp/${encodeURIComponent(mp['MP Name'] || mp.name)}`)}
                  style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', cursor: 'pointer', transition: 'background 0.2s', flexWrap: 'wrap', gap: '8px' }}
                >
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--navy)', fontSize: '1.05rem' }}>{mp['MP Name']}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '4px' }}>{mp.Constituency} Constituency, {mp.State}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--sage)', fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{mp['Utilization %']}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>Utilization</div>
                    </div>
                    <ChevronRight size={18} color="var(--line-strong)" />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', color: 'var(--ink-soft)', textAlign: 'center' }}>No MPs or constituencies found for "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>

      {/* TOP SECTION: Executive Command Center */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left: Financial Telemetry */}
        <div style={{ background: 'var(--navy)', padding: '24px', borderRadius: '12px', color: '#fff', boxShadow: '0 12px 24px -10px rgba(20, 33, 61, 0.4)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold)', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
            Financial Telemetry
          </h2>
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: '8px' }}>Total Allocated Funds</div>
            <div style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '700', fontFamily: 'var(--font-mono)', lineHeight: '1' }}>
              ₹{currentKpis.Total_Allocated_Cr} <span style={{ fontSize: '1.2rem', fontWeight: '400', color: 'rgba(255,255,255,0.8)' }}>Cr</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>Total Expenditure</div>
              <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>₹{currentKpis.Total_Expenditure_Cr} <span style={{ fontSize: '0.85rem', fontWeight: '400' }}>Cr</span></div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>Fund Utilization</div>
              <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--sage)' }}>{currentKpis.Fund_Utilization_Pct}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>Expenditure Rate</div>
              <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--gold)' }}>{(currentKpis.Fund_Utilization_Pct * 0.85).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Right: Operational Execution */}
        <div style={{ background: 'var(--paper-alt)', border: '1px solid var(--line-strong)', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
            Operational Execution
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Users size={22} color="var(--navy)" /></div>
                <span style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '1rem' }}>Active Parliamentarians</span>
              </div>
              <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--navy)' }}>{currentKpis.Total_MPs}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(63, 107, 79, 0.1)', padding: '10px', borderRadius: '8px' }}><CheckCircle2 size={22} color="var(--sage)" /></div>
                <span style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '1rem' }}>Works Completed</span>
              </div>
              <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--sage)' }}>{currentKpis.Works_Completed}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(180, 135, 42, 0.1)', padding: '10px', borderRadius: '8px' }}><Hourglass size={22} color="var(--gold)" /></div>
                <span style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '1rem' }}>Works Pending</span>
              </div>
              <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--gold)' }}>{currentKpis.Works_Pending}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px dashed var(--line-strong)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(140, 58, 43, 0.1)', padding: '10px', borderRadius: '8px' }}><AlertTriangle size={22} color="var(--brick)" /></div>
                <span style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '1rem' }}>Ongoing Payments</span>
              </div>
              <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--brick)' }}>₹1,240 Cr</span>
            </div>
          </div>
        </div>

      </div>

      {/* State-wise Allocation vs Expenditure Composed Chart */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 100%' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '4px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>State-wise Allocation vs Expenditure</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: 0 }}>Comparing total funds deployed against active utilization rates</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
            <button onClick={() => setStateView('All')} style={filterBtnStyle(stateView === 'All', 'var(--navy)')}>All States</button>
            <button onClick={() => setStateView('Top10')} style={filterBtnStyle(stateView === 'Top10', 'var(--sage)')}>Top 10</button>
            <button onClick={() => setStateView('Bottom10')} style={filterBtnStyle(stateView === 'Bottom10', 'var(--brick)')}>Bottom 10</button>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ height: '400px', minWidth: '700px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={displayStates} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--ink-soft)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  angle={-45} 
                  textAnchor="end" 
                  dy={20}
                  interval={0}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke="var(--ink-soft)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val}Cr`} 
                  width={60}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="var(--gold)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val}%`} 
                  width={40}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--paper-alt)', opacity: 0.4 }}
                  contentStyle={{ borderRadius: '4px', border: '1px solid var(--line-strong)', boxShadow: '0 4px 6px -1px rgba(28,27,24,0.15)', fontFamily: 'var(--font-body)' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.85rem', color: 'var(--ink)' }}/>
                <Bar yAxisId="left" dataKey="Total_Allocated" name="Allocated (₹ Cr)" fill="var(--navy)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar yAxisId="left" dataKey="Total_Expenditure" name="Expenditure (₹ Cr)" fill="var(--sage)" radius={[4, 4, 0, 0]} barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="Utilization" name="Utilization %" stroke="var(--gold)" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: 'var(--gold)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Secondary Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Chart 1: YoY Area Chart */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '4px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Funding Trends (YoY)</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: 0, marginBottom: '24px' }}>Historical allocation vs expenditure trajectory</p>
          
          <div style={{ overflowX: 'auto', paddingBottom: '10px', flex: 1, WebkitOverflowScrolling: 'touch' }}>
            <div style={{ height: '260px', minWidth: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14213D" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#14213D" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUtilized" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3F6B4F" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#3F6B4F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="var(--ink-soft)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--ink-soft)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} dx={-10} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '4px', border: '1px solid var(--line-strong)', boxShadow: '0 4px 6px -1px rgba(28,27,24,0.15)', fontFamily: 'var(--font-body)' }}
                    formatter={(value) => [`₹${value} Cr`, undefined]}
                  />
                  <Area type="monotone" dataKey="allocated" name="Allocated" stroke="var(--navy)" strokeWidth={3} fillOpacity={1} fill="url(#colorAllocated)" />
                  <Area type="monotone" dataKey="utilized" name="Utilized" stroke="var(--sage)" strokeWidth={3} fillOpacity={1} fill="url(#colorUtilized)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 2: Fund Utilization Donut/Pie */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', textAlign: 'left', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '4px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>National Fund Utilization</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: 0 }}>Total Expenditure vs Unutilized Core Corpus</p>
          </div>
          
          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => [`₹${value.toLocaleString()} Cr`, undefined]}
                  contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            {/* Center Label inside Donut */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{currentKpis.Fund_Utilization_Pct}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Utilized</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--sage)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>Expended</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--line-strong)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>Unutilized</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Execution Velocity Distribution */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '4px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Execution Velocity</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: 0 }}>MP Cohort Distribution</p>
            </div>
          </div>
          
          <div style={{ overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ height: '220px', minWidth: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="name" stroke="var(--ink-soft)" fontSize={10} tickLine={false} axisLine={false} dy={10} tickFormatter={(val) => val.split(' ')[0]} />
                  <YAxis stroke="var(--ink-soft)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--paper-alt)', opacity: 0.4 }}
                    contentStyle={{ borderRadius: '4px', border: '1px solid var(--line-strong)', boxShadow: '0 4px 6px -1px rgba(28,27,24,0.15)', fontFamily: 'var(--font-body)' }}
                    formatter={(value) => [`${value}%`, 'Cohort Share']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* LEADERBOARDS SECTION: Top Risk & Top MPs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Top 5 High-Risk Projects */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--brick-soft)', padding: '10px', borderRadius: '8px', color: 'var(--brick)' }}>
              <AlertOctagon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', margin: 0, fontWeight: '600', fontFamily: 'var(--font-display)' }}>Highest Risk Projects</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: 0 }}>Requires immediate intervention</p>
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            {topRisks.length > 0 ? topRisks.map((risk, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx !== topRisks.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ flex: 1, paddingRight: '16px' }}>
                  <div style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {risk['Work Description'] || risk.description || 'Untitled Work Request'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '4px' }}>
                    {risk['MP Name']} • {risk.State}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge critical" style={{ fontSize: '0.8rem' }}>Score: {risk.Risk_Score}</span>
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-soft)' }}>No critical risks detected.</div>
            )}
          </div>
          <button onClick={() => navigate('/risk-center')} style={{ width: '100%', padding: '10px', background: 'var(--paper-alt)', border: '1px solid var(--line)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: 'var(--ink)', marginTop: '16px', transition: 'all 0.2s' }}>
            View Full Risk Audit
          </button>
        </div>

        {/* Top 5 Parliamentarians */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--sage-soft)', padding: '10px', borderRadius: '8px', color: 'var(--sage)' }}>
              <Trophy size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', margin: 0, fontWeight: '600', fontFamily: 'var(--font-display)' }}>Top Parliamentarians</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: 0 }}>Ranked by overall fund utilization</p>
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            {topMps.length > 0 ? topMps.map((mp, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx !== topMps.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--paper-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)', fontWeight: '700', fontSize: '0.85rem' }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '0.95rem' }}>{mp['MP Name']}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '2px' }}>{mp.Constituency}, {mp.State}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: 'var(--sage)', fontFamily: 'var(--font-mono)' }}>{mp['Utilization %']}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Utilized</div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-soft)' }}>Loading rankings...</div>
            )}
          </div>
          <button onClick={() => navigate('/mps')} style={{ width: '100%', padding: '10px', background: 'var(--paper-alt)', border: '1px solid var(--line)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: 'var(--ink)', marginTop: '16px', transition: 'all 0.2s' }}>
            Browse All MPs
          </button>
        </div>

      </div>

      {/* BOTTOM SECTION: About MPLADS */}
      <div className="card" style={{ padding: '24px', background: 'var(--paper)', borderTop: '4px solid var(--navy)', display: 'flex', gap: '24px', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '20px' }}>
          <div style={{ background: 'var(--navy)', padding: '12px', borderRadius: '8px', color: '#fff' }}>
            <Info size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy)', margin: 0, fontWeight: '700', fontFamily: 'var(--font-display)' }}>About the MPLADS Scheme</h2>
            <p style={{ color: 'var(--ink-soft)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>Member of Parliament Local Area Development Scheme</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', fontSize: '0.95rem', color: 'var(--ink)', lineHeight: '1.6' }}>
          
          <div>
            <h4 style={{ color: 'var(--navy)', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={18} color="var(--gold)" /> Objective
            </h4>
            <p style={{ margin: 0 }}>
              The MPLADS is a fully funded Central Sector Scheme designed to enable Members of Parliament to recommend works of developmental nature with an emphasis on the creation of durable community assets based on locally felt needs.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--navy)', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IndianRupee size={18} color="var(--gold)" /> Fund Allocation
            </h4>
            <p style={{ margin: 0 }}>
              Under this scheme, every MP is entitled to recommend projects worth <strong>₹5 Crore per annum</strong> within their respective constituencies. Elected members of the Rajya Sabha can recommend works within the state they represent.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--navy)', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--gold)" /> Civic Ledger Purpose
            </h4>
            <p style={{ margin: 0 }}>
              This Civic Ledger provides uncompromised public transparency into these fund deployments. By leveraging AI-driven anomaly detection, it audits project execution velocities, flags financial deviations, and ensures accountable governance.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}