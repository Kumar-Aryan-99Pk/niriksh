import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, MapPin, IndianRupee, HardHat, Info, ShieldCheck, Sparkles, FileText, Loader2, CheckCircle2, Calendar } from 'lucide-react';

export default function OfficerCopilot() {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [selectedState, setSelectedState] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  
  // Prediction State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [matchedCategory, setMatchedCategory] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/copilot-benchmarks`)
      .then(res => {
        const payload = res.data.data || res.data;
        setBenchmarks(Array.isArray(payload) ? payload : []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const uniqueStates = [...new Set(benchmarks.map(b => b.State))].sort();

  const analyzeDescription = async () => {
    if (!projectDescription || !selectedState) return;
    
    setIsAnalyzing(true);
    setPrediction(null);

    try {
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; 
      
      const systemPrompt = `You are a project estimator for the Indian Government's MPLADS scheme. 
      Provide your output as a raw JSON object with exactly these four keys:
      1. "category": Must be exactly one of: "Education", "Roads, Pathways and Bridges", "Drinking Water and Public Health", "Health and Family Welfare", "Electricity/Lighting", "Normal/Others".
      2. "estimatedCostLakhs": A realistic median cost estimate in Lakhs (number only).
      3. "costRange": A realistic cost range string (e.g., "12 - 18 Lakhs").
      4. "duration": A realistic estimated time to complete (e.g., "3 - 6 months").`;

      // Point to Groq's OpenAI-compatible endpoint
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile", // Or use "llama-3.1-8b-instant" for even faster speeds
        response_format: { type: "json_object" }, // Forces strict JSON output
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this project: "${projectDescription}" in Region: "${selectedState}"` }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // The response structure is identical to OpenAI
      const rawText = response.data.choices[0].message.content;
      const aiData = JSON.parse(rawText);
      
      console.log("Groq Forecast Generated:", aiData);

      let detectedCategory = aiData.category;
      const validCategories = ["Education", "Roads, Pathways and Bridges", "Drinking Water and Public Health", "Health and Family Welfare", "Electricity/Lighting", "Normal/Others"];
      if (!validCategories.includes(detectedCategory)) detectedCategory = 'Normal/Others';

      let localData = benchmarks.find(b => b.State === selectedState && b.Category === detectedCategory);
      if (!localData) localData = benchmarks.find(b => b.State === selectedState && b.Category === 'Normal/Others');

      setMatchedCategory(detectedCategory);
      
      setPrediction({
        Estimated_Cost: Number(aiData.estimatedCostLakhs) * 100000, 
        Cost_Range: aiData.costRange,
        Duration: aiData.duration,
        Recommended_Vendors: localData?.Recommended_Vendors || [],
        Historical_Projects: localData?.Historical_Projects || "N/A"
      });

    } catch (error) {
      console.error("AI Classification Failed, falling back to heuristic engine...", error);
      
      const text = projectDescription.toLowerCase();
      let detectedCategory = 'Normal/Others';

      if (text.match(/school|vidyalaya|class|college|padhai|education|shiksha/)) detectedCategory = 'Education';
      else if (text.match(/road|sadak|rasta|cc|pathway|bridge|pul/)) detectedCategory = 'Roads, Pathways and Bridges';
      else if (text.match(/water|pani|jal|handpump|tank|drainage|nala/)) detectedCategory = 'Drinking Water and Public Health';
      else if (text.match(/hospital|medical|ambulance|swasthya|clinic/)) detectedCategory = 'Health and Family Welfare';
      else if (text.match(/light|bijli|electricity|solar/)) detectedCategory = 'Electricity/Lighting';

      let localData = benchmarks.find(b => b.State === selectedState && b.Category === detectedCategory) 
                 || benchmarks.find(b => b.State === selectedState && b.Category === 'Normal/Others');
      
      setMatchedCategory(detectedCategory);
      // Fallback object if JSON parsing fails
      setPrediction(localData ? {
        Estimated_Cost: localData.Estimated_Cost,
        Cost_Range: localData.Cost_Range,
        Duration: "Timeline Unavailable",
        Recommended_Vendors: localData.Recommended_Vendors,
        Historical_Projects: localData.Historical_Projects
      } : null);
    }
    
    setIsAnalyzing(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid var(--line-strong)',
    background: '#fff',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: 'var(--ink)',
    outline: 'none',
    boxSizing: 'border-box'
  };

  if (loading) return <div className="page-container" style={{ padding: '24px', color: 'var(--ink-soft)' }}>Initializing AI Copilot...</div>;

  return (
    <div className="page-container" style={{ padding: 'clamp(16px, 3vw, 24px)', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'var(--navy)', padding: '16px', borderRadius: '12px', color: 'var(--gold)', boxShadow: '0 8px 16px rgba(20,33,61,0.2)' }}>
            <Sparkles size={32} />
          </div>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--navy)', marginBottom: '12px', fontWeight: '700' }}>
          AI Officer Copilot
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Describe your project naturally (English or Hinglish). The AI will analyze the requirements and forecast budgets, timelines, and optimal vendors.
        </p>
      </div>

      {/* Input Form */}
      <div className="card" style={{ padding: '32px', background: 'var(--paper-alt)', border: '1px solid var(--line-strong)', borderRadius: '12px', marginBottom: '32px' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600', color: 'var(--navy)', fontSize: '0.95rem' }}>
            <MapPin size={18} color="var(--gold)" /> Select Project Region
          </label>
          <select style={{ ...inputStyle, cursor: 'pointer', maxWidth: '350px' }} value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
            <option value="" disabled>Choose a State...</option>
            {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600', color: 'var(--navy)', fontSize: '0.95rem' }}>
            <FileText size={18} color="var(--gold)" /> Describe the Project Requirements
          </label>
          <textarea 
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', lineHeight: '1.5' }} 
            placeholder="e.g., Ek chota school banwana hai aur usme drinking water facility chahiye..."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </div>

        <button 
          onClick={analyzeDescription}
          disabled={!selectedState || !projectDescription || isAnalyzing}
          style={{
            background: (!selectedState || !projectDescription) ? 'var(--line-strong)' : 'var(--navy)',
            color: '#fff',
            border: 'none',
            padding: '14px 24px',
            borderRadius: '8px',
            fontSize: '1.05rem',
            fontWeight: '600',
            fontFamily: 'var(--font-display)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: (!selectedState || !projectDescription || isAnalyzing) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          {isAnalyzing ? <><Loader2 className="animate-spin" size={20} /> Analyzing Intent & Generating Forecast...</> : <><Sparkles size={20} /> Generate AI Forecast</>}
        </button>

      </div>

      {/* AI Predictions / Output */}
      {prediction && !isAnalyzing && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '16px', background: 'rgba(63, 107, 79, 0.1)', borderRadius: '8px', border: '1px solid var(--sage)' }}>
            <CheckCircle2 size={24} color="var(--sage)" />
            <div>
              <div style={{ color: 'var(--sage)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Intent Match Successful</div>
              <div style={{ color: 'var(--ink)', fontSize: '1rem', fontWeight: '500' }}>Correlated with historical data from the <strong>"{matchedCategory}"</strong> sector in {selectedState}.</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            
            {/* Cost & Duration Estimate Card */}
            <div className="card" style={{ padding: '32px', borderTop: '4px solid var(--navy)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <IndianRupee size={24} color="var(--navy)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>AI Forecast: Financial & Timeline</h3>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: '8px' }}>Median Project Cost</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--navy)', lineHeight: '1' }}>
                  ₹{(prediction.Estimated_Cost / 100000).toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: '500' }}>Lakhs</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--paper)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>Typical Range</div>
                  <div style={{ fontWeight: '600', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{prediction.Cost_Range}</div>
                </div>

                <div style={{ background: 'var(--paper)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--gold)" /> Est. Duration
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{prediction.Duration}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(20, 33, 61, 0.05)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: 'auto' }}>
                <Info size={20} color="var(--navy)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: '1.4' }}>
                  Vendor recommendations are based on <strong>{prediction.Historical_Projects}</strong> historically verified projects in this state matching the AI's parameter extraction.
                </div>
              </div>
            </div>

            {/* Recommended Vendors Card */}
            <div className="card" style={{ padding: '32px', borderTop: '4px solid var(--sage)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <ShieldCheck size={24} color="var(--sage)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>AI Recommended Agencies</h3>
              </div>
              
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', marginBottom: '20px' }}>
                These contractors have successfully delivered similar projects in <strong>{selectedState}</strong> without triggering critical cost anomalies.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {prediction.Recommended_Vendors?.length > 0 ? (
                  prediction.Recommended_Vendors.map((vendor, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--paper)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                      <div style={{ background: 'rgba(63, 107, 79, 0.1)', padding: '10px', borderRadius: '50%' }}>
                        <HardHat size={20} color="var(--sage)" />
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                        {vendor}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '16px', color: 'var(--ink-soft)' }}>No clean vendor data available for this specific region and category.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}