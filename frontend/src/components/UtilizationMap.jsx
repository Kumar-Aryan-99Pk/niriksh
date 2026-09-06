import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import axios from 'axios';

// Pointing to your specific GeoJSON file
const INDIA_GEO_JSON = '/india.geojson'; 

function UtilizationMap() {
  const [stateData, setStateData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/state-summary`)
      .then(res => {
        const payload = res.data.data || res.data;
        setStateData(Array.isArray(payload) ? payload : []);
      })
      .catch(console.error);
  }, []);

  // Updated to match modern theme warning/success colors
  const colorScale = scaleLinear()
    .domain([10, 50, 90]) 
    .range(["#EF4444", "#F59E0B", "#10B981"]); 

  return (
    // Removed white background and borders to make it transparent/inherit from parent
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Tooltip id="my-tooltip" />
      
      <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
        {/* Removed center from projectionConfig and added to ZoomableGroup */}
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 850 }} style={{ width: "100%", height: "100%" }}>
          <ZoomableGroup center={[80, 22]} zoom={1} maxZoom={5}>
            <Geographies geography={INDIA_GEO_JSON}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const mapStateName = geo.properties.st_nm; 
                  
                  const d = stateData.find(s => 
                    s.State.toLowerCase().replace(/ and /g, ' & ') === (mapStateName || '').toLowerCase().replace(/ and /g, ' & ')
                  );
                  
                  const utilVal = d ? parseFloat((d['Utilization %'] || '0').toString().replace('%', '')) : 0;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      // Color application
                      fill={d ? colorScale(utilVal) : "var(--line, #e2e8f0)"}
                      stroke="var(--paper, #ffffff)"
                      strokeWidth={0.3} 
                      onMouseEnter={() => {
                        // Removed district. Only showing State Name and Utilization
                        setTooltipContent(`${mapStateName || 'Unknown'}: ${d ? utilVal.toFixed(1) + '%' : 'No Data'}`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content={tooltipContent}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "var(--navy, #3b82f6)", outline: "none", cursor: "pointer" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px', fontSize: '0.85rem', color: 'var(--ink-soft, #64748b)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 12, height: 12, background: '#EF4444', borderRadius: 2 }}></div> &lt; 30%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 12, height: 12, background: '#F59E0B', borderRadius: 2 }}></div> 30 - 70%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 12, height: 12, background: '#10B981', borderRadius: 2 }}></div> &gt; 70%</span>
      </div>
    </div>
  );
}

// Remove the 'export default' from the function declaration at the top:
// function UtilizationMap() { ... }

// Add this to the very bottom of the file:
export default React.memo(UtilizationMap);