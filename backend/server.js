const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const loadData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return { error: `${filename} not found in data directory` };
};

// API Endpoints
app.get('/api/dashboard', (req, res) => res.json(loadData('json_2026-09-02.json')));
app.get('/api/risk-center', (req, res) => res.json(loadData('risk_center_priority_queue.json')));
app.get('/api/maps/regional-risk', (req, res) => res.json(loadData('geo_risk_map_data.json')));
app.get('/api/mp-performance', (req, res) => res.json(loadData('mp_performance_profiles.json')));
app.get('/api/state-summary', (req, res) => res.json(loadData('state_performance_summary.json')));
app.get('/api/copilot-benchmarks', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'project_copilot.json'), 'utf8'));
    res.json({ data: data });
  } catch (error) {
    console.error("Error reading copilot data:", error);
    res.status(500).json({ error: "Failed to load benchmark data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Node backend running on port ${PORT}`));