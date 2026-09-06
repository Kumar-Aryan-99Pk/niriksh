import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, Download, HardHat, AlertTriangle, CheckCircle2, 
  MapPin, IndianRupee, ShieldCheck, Briefcase, FileText, 
  Building2, TrendingDown, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function VendorRegistry() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorName, setSelectedVendorName] = useState(null);

  useEffect(() => {
    // We fetch from risk-center as it contains detailed project & vendor history
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/risk-center`)
      .then(res => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setRawData(payload);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load vendor data:", err);
        setLoading(false);
      });
  }, []);

  // --------------------------------------------------------
  // DATA TRANSFORMATION ENGINE: Grouping Projects by Vendor
  // --------------------------------------------------------
  const vendors = useMemo(() => {
    if (!rawData.length) return {};

    const grouped = rawData.reduce((acc, project) => {
      // Clean up vendor names, ignoring blanks
      const vName = project.Vendor ? project.Vendor.trim() : 'Unspecified Agency';
      if (vName === 'Unspecified Agency') return acc;

      if (!acc[vName]) {
        acc[vName] = {
          name: vName,
          projects: [],
          totalCost: 0,
          states: new Set(),
          categories: {},
          totalRiskScore: 0,
          criticalAlerts: 0
        };
      }

      const cost = parseFloat(project.Cost) || parseFloat(project.amount) || 0;
      const risk = parseFloat(project.Risk_Score) || 0;
      
      acc[vName].projects.push(project);
      acc[vName].totalCost += cost;
      if (project.State) acc[vName].states.add(project.State);
      
      const cat = project.Category || 'Other';
      acc[vName].categories[cat] = (acc[vName].categories[cat] || 0) + 1;
      
      acc[vName].totalRiskScore += risk;
      if (project.Risk_Severity === 'Critical' || risk > 75) {
        acc[vName].criticalAlerts += 1;
      }

      return acc;
    }, {});

    // Convert Set to Array and calculate averages
    Object.keys(grouped).forEach(key => {
      grouped[key].states = Array.from(grouped[key].states);
      grouped[key].avgRisk = grouped[key].projects.length > 0 
        ? (grouped[key].totalRiskScore / grouped[key].projects.length).toFixed(1) 
        : 0;
      
      // Calculate a "Trust Score" based on risk inversion
      grouped[key].trustScore = Math.max(0, 100 - grouped[key].avgRisk).toFixed(1);
    });

    return grouped;
  }, [rawData]);

  // Convert to array for searching and sorting
  const vendorList = useMemo(() => {
    return Object.values(vendors).sort((a, b) => b.totalCost - a.totalCost);
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    if (!searchQuery) return vendorList;
    const lowerQ = searchQuery.toLowerCase();
    return vendorList.filter(v => 
      v.name.toLowerCase().includes(lowerQ) || 
      v.states.some(s => s.toLowerCase().includes(lowerQ))
    );
  }, [vendorList, searchQuery]);

  // Auto-select the first vendor if none is selected
  useEffect(() => {
    if (!selectedVendorName && filteredVendors.length > 0) {
      setSelectedVendorName(filteredVendors[0].name);
    }
  }, [filteredVendors, selectedVendorName]);

  const activeVendor = selectedVendorName ? vendors[selectedVendorName] : null;

  // --------------------------------------------------------
  // CHART DATA PREPARATION
  // --------------------------------------------------------
  const pieColors = ['var(--navy)', 'var(--gold)', 'var(--sage)', 'var(--brick)', '#607D8B'];
  
  const categoryChartData = useMemo(() => {
    if (!activeVendor) return [];
    return Object.entries(activeVendor.categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [activeVendor]);

  const projectTimelineData = useMemo(() => {
    if (!activeVendor) return [];
    // Sort projects by cost to show the largest deployments
    return [...activeVendor.projects]
      .sort((a, b) => (b.Cost || b.amount || 0) - (a.Cost || a.amount || 0))
      .slice(0, 10)
      .map((p, idx) => ({
        name: `Project ${idx + 1}`,
        desc: p['Work Description'] ? p['Work Description'].substring(0, 20) + '...' : 'Unknown',
        cost: ((p.Cost || p.amount || 0) / 100000).toFixed(2), // In Lakhs
        risk: p.Risk_Score || 0
      }));
  }, [activeVendor]);

  // --------------------------------------------------------
  // PDF EXPORT HANDLER
  // --------------------------------------------------------
  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) return <div className="page-container" style={{ padding: '32px', color: 'var(--ink-soft)' }}>Aggregating Vendor Datasets...</div>;

  return (
    <>
      {/* 
        INLINE PRINT STYLES
        These styles tell the browser exactly how to format the PDF.
        It hides the sidebar, navigation, and buttons, and makes the content full width.
      */}
      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .top-navbar, .no-print, .vendor-sidebar { display: none !important; }
          .app-wrapper, .main-wrapper, .content, .page-container { 
            display: block !important; 
            width: 100% !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: visible !important;
          }
          .vendor-dashboard { 
            grid-template-columns: 1fr !important; 
            gap: 0 !important; 
          }
          .print-header { 
            display: block !important; 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #14213D;
            padding-bottom: 20px;
          }
          .card { 
            border: 1px solid #ddd !important; 
            box-shadow: none !important; 
            page-break-inside: avoid;
            margin-bottom: 20px !important;
          }
          .data-table th { background: #14213D !important; color: white !important; }
        }
      `}</style>

      <div className="page-container" style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Hidden Print Header (Only visible in PDF) */}
        <div className="print-header" style={{ display: 'none' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '24pt', margin: 0 }}>Niriksh Civic Ledger</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '12pt', margin: '5px 0' }}>Official Vendor Audit & Verification Report</p>
          <p style={{ fontSize: '10pt', color: '#666' }}>Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Header Section */}
        <div className="no-print" style={{ padding: '24px 32px', background: 'var(--paper)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--navy)', marginBottom: '4px', fontWeight: '700' }}>
              Vendor Registry & Audits
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', margin: 0 }}>
              Track agency performance, historical deployments, and risk profiles.
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--ink-soft)' }} />
              <input
                type="text"
                placeholder="Search agencies or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 42px',
                  borderRadius: '6px', border: '1px solid var(--line-strong)',
                  background: 'var(--paper-alt)', outline: 'none',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Split Layout Container */}
        <div className="vendor-dashboard" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT: Vendor List Sidebar */}
          <div className="vendor-sidebar no-print" style={{ background: 'var(--paper)', borderRight: '1px solid var(--line)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--line)', background: 'var(--paper-alt)', position: 'sticky', top: 0, zIndex: 10 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {filteredVendors.length} Agencies Found
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredVendors.map((vendor, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedVendorName(vendor.name)}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--line)',
                    cursor: 'pointer',
                    background: selectedVendorName === vendor.name ? 'rgba(20, 33, 61, 0.05)' : 'transparent',
                    borderLeft: selectedVendorName === vendor.name ? '4px solid var(--navy)' : '4px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '6px', lineHeight: '1.3' }}>
                    {vendor.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Briefcase size={12} /> {vendor.projects.length} Projects
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: vendor.avgRisk > 50 ? 'var(--brick)' : 'var(--sage)' }}>
                      Risk: {vendor.avgRisk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Active Vendor Profile */}
          <div style={{ overflowY: 'auto', padding: '32px', background: 'var(--paper-alt)' }}>
            {activeVendor ? (
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Profile Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ background: 'var(--navy)', padding: '12px', borderRadius: '8px' }}>
                        <Building2 size={28} color="var(--gold)" />
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy)', margin: 0, fontWeight: '700' }}>
                        {activeVendor.name}
                      </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--ink-soft)', fontSize: '0.95rem', marginLeft: '60px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Operating in: {activeVendor.states.join(', ')}</span>
                    </div>
                  </div>

                  {/* Print / Download Button */}
                  <button 
                    onClick={handleDownloadPDF}
                    className="no-print"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                      background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '8px',
                      fontFamily: 'var(--font-body)', fontWeight: '600', cursor: 'pointer',
                      transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(20,33,61,0.2)'
                    }}
                  >
                    <Download size={18} /> Download Audit PDF
                  </button>
                </div>

                {/* KPI Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--navy)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Total Contract Value</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--navy)' }}>
                      ₹{(activeVendor.totalCost / 10000000).toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: '500' }}>Cr</span>
                    </div>
                  </div>

                  <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--gold)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Projects Executed</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--ink)' }}>
                      {activeVendor.projects.length}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '24px', borderTop: `4px solid ${activeVendor.trustScore > 60 ? 'var(--sage)' : 'var(--brick)'}` }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Niriksh Trust Score</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: activeVendor.trustScore > 60 ? 'var(--sage)' : 'var(--brick)' }}>
                        {activeVendor.trustScore}
                      </div>
                      {activeVendor.trustScore > 60 ? <ShieldCheck size={28} color="var(--sage)"/> : <AlertTriangle size={28} color="var(--brick)"/>}
                    </div>
                  </div>

                  <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--brick)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Critical Alerts</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--brick)' }}>
                      {activeVendor.criticalAlerts}
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  
                  {/* Category Distribution Pie */}
                  <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '20px', fontWeight: '600' }}>Sector Expertise</h3>
                    <div style={{ height: '280px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            cx="50%" cy="50%"
                            innerRadius={60} outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {categoryChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid var(--line-strong)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value) => [`${value} Projects`, 'Count']}
                          />
                          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.85rem', paddingTop: '20px' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Projects Bar Chart */}
                  <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '20px', fontWeight: '600' }}>Top Deployments (Cost vs Risk)</h3>
                    <div style={{ height: '280px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                          <XAxis dataKey="name" fontSize={10} stroke="var(--ink-soft)" tickLine={false} axisLine={false} angle={-45} textAnchor="end" dy={10} />
                          <YAxis yAxisId="left" fontSize={10} stroke="var(--navy)" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}L`} />
                          <YAxis yAxisId="right" orientation="right" fontSize={10} stroke="var(--brick)" tickLine={false} axisLine={false} />
                          <RechartsTooltip 
                            cursor={{ fill: 'rgba(20, 33, 61, 0.05)' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid var(--line-strong)' }}
                          />
                          <Bar yAxisId="left" dataKey="cost" name="Cost (₹ Lakhs)" fill="var(--navy)" radius={[4, 4, 0, 0]} barSize={20} />
                          <Bar yAxisId="right" dataKey="risk" name="Risk Score" fill="var(--brick)" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Comprehensive Project List Table */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid var(--line)', background: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText color="var(--navy)" size={20} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--navy)', margin: 0, fontWeight: '600' }}>Complete Project Ledger</h3>
                  </div>
                  
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table className="data-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'var(--paper-alt)', borderBottom: '2px solid var(--line-strong)' }}>
                        <tr>
                          <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Work Description</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Location</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Category</th>
                          <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Sanctioned Cost</th>
                          <th style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Risk Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeVendor.projects.map((proj, idx) => {
                          const cost = parseFloat(proj.Cost || proj.amount || 0);
                          const formattedCost = `₹${(cost / 100000).toFixed(2)} Lakhs`;
                          const rScore = parseFloat(proj.Risk_Score || 0);
                          const isHighRisk = proj.Risk_Severity === 'Critical' || rScore > 70;

                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.2s' }}>
                              <td style={{ padding: '16px', fontWeight: '500', color: 'var(--ink)', lineHeight: '1.4' }}>
                                {proj['Work Description'] || proj.description || 'Description unavailable'}
                              </td>
                              <td style={{ padding: '16px', color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                                {proj.District}, {proj.State}
                              </td>
                              <td style={{ padding: '16px' }}>
                                <span style={{ background: 'var(--paper-alt)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                                  {proj.Category || 'Other'}
                                </span>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--navy)' }}>
                                {formattedCost}
                              </td>
                              <td style={{ padding: '16px', textAlign: 'center' }}>
                                <span style={{ 
                                  background: isHighRisk ? 'var(--brick-soft)' : 'var(--sage-soft)', 
                                  color: isHighRisk ? 'var(--brick)' : 'var(--sage)',
                                  padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                                }}>
                                  {isHighRisk ? <AlertTriangle size={12}/> : <CheckCircle2 size={12}/>}
                                  {rScore}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ink-soft)' }}>
                <HardHat size={48} color="var(--line-strong)" style={{ marginBottom: '16px' }} />
                <h3>Select a vendor to view their registry profile</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}