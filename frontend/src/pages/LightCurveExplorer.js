import React, { useState } from 'react';
import './LightCurveExplorer.css';

const LightCurveExplorer = () => {
  const [selectedDataset, setSelectedDataset] = useState('kepler');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Mock light curve data
  const generateLightCurve = () => {
    const points = [];
    const baseFlux = 1.0;
    const transitDepth = 0.02;
    const transitWidth = 20;
    const transitCenter = 150;
    
    for (let i = 0; i < 300; i++) {
      let flux = baseFlux + (Math.random() - 0.5) * 0.005; // Add noise
      
      // Add transit dip
      if (Math.abs(i - transitCenter) < transitWidth) {
        const transitFactor = 1 - transitDepth * Math.exp(-Math.pow((i - transitCenter) / 8, 2));
        flux *= transitFactor;
      }
      
      points.push({ time: i, flux });
    }
    return points;
  };

  const [lightCurveData] = useState(generateLightCurve());

  const datasets = [
    { id: 'kepler', name: 'Kepler Mission', count: '150,000+ targets' },
    { id: 'tess', name: 'TESS Mission', count: '200,000+ targets' },
    { id: 'k2', name: 'K2 Mission', count: '300,000+ targets' },
    { id: 'plato', name: 'PLATO Mission', count: 'Future data' }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        transitDetected: true,
        confidence: 0.94,
        period: 3.2,
        depth: 0.018,
        duration: 2.4,
        planetRadius: '1.2 Earth radii',
        narrative: 'AI detected a strong transit signal with high confidence. The periodic dimming suggests a planet approximately 1.2 times the size of Earth orbiting its host star every 3.2 days.'
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisResult(null);
    }
  };

  return (
    <div className="light-curve-explorer page-container">
      <div className="explorer-header">
        <h1 className="page-title">Light-Curve Explorer & AI Sandbox</h1>
        <button className="help-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <div className="mission-narrative">
        <div className="narrative-card">
          <h3>Mission Briefing: Kepler-442b Discovery</h3>
          <p>You are analyzing light curve data from the Kepler Space Telescope. Your mission: identify potential exoplanet transits in the stellar brightness measurements. Each dip in the light curve could reveal a new world orbiting a distant star.</p>
        </div>
      </div>

      <div className="dataset-selector">
        <h3>Select Dataset</h3>
        <div className="dataset-grid">
          {datasets.map((dataset) => (
            <button
              key={dataset.id}
              className={`dataset-card ${selectedDataset === dataset.id ? 'active' : ''}`}
              onClick={() => setSelectedDataset(dataset.id)}
            >
              <div className="dataset-name">{dataset.name}</div>
              <div className="dataset-count">{dataset.count}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="upload-section">
        <h3>Upload Your Data</h3>
        <div className="upload-area">
          <input
            type="file"
            id="file-upload"
            accept=".csv,.txt,.fits"
            onChange={handleFileUpload}
            className="file-input"
          />
          <label htmlFor="file-upload" className="upload-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 5V15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{uploadedFile ? uploadedFile.name : 'Upload light curve data'}</span>
            <small>Supports CSV, TXT, FITS files</small>
          </label>
        </div>
      </div>

      <div className="light-curve-section">
        <h3>Light Curve Visualization</h3>
        <div className="chart-container">
          <div className="chart-header">
            <span className="chart-title">Stellar Brightness vs Time</span>
            <div className="chart-controls">
              <button className="zoom-btn">🔍 Zoom</button>
              <button className="reset-btn">↻ Reset</button>
            </div>
          </div>
          <div className="chart-area">
            <svg width="100%" height="200" viewBox="0 0 300 200">
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--teal-light)" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="var(--teal-light)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="0" y1={i * 40} x2="300" y2={i * 40} stroke="rgba(77, 208, 225, 0.1)" strokeWidth="1"/>
              ))}
              
              {/* Light curve */}
              <path
                d={`M ${lightCurveData.map((point, i) => `${i} ${(1 - point.flux) * 200 + 50}`).join(' L ')}`}
                fill="none"
                stroke="var(--teal-light)"
                strokeWidth="2"
              />
              
              {/* Fill area */}
              <path
                d={`M ${lightCurveData.map((point, i) => `${i} ${(1 - point.flux) * 200 + 50}`).join(' L ')} L 300 200 L 0 200 Z`}
                fill="url(#curveGradient)"
              />
              
              {/* Transit marker */}
              <circle cx="150" cy="90" r="4" fill="var(--warning)" opacity="0.8"/>
              <text x="155" y="85" fill="var(--warning)" fontSize="10">Transit Detected</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="ai-analysis-section">
        <div className="analysis-header">
          <h3>AI Analysis</h3>
          <button 
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="spinner"></div>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
                Run AI Analysis
              </>
            )}
          </button>
        </div>

        {analysisResult && (
          <div className="analysis-results">
            <div className="result-header">
              <div className="detection-status">
                <span className="status-icon">✓</span>
                <span>Transit Detected</span>
                <span className="confidence">Confidence: {Math.round(analysisResult.confidence * 100)}%</span>
              </div>
            </div>
            
            <div className="result-stats">
              <div className="stat-item">
                <span className="stat-label">Orbital Period</span>
                <span className="stat-value">{analysisResult.period} days</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Transit Depth</span>
                <span className="stat-value">{(analysisResult.depth * 100).toFixed(1)}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Duration</span>
                <span className="stat-value">{analysisResult.duration} hours</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Planet Size</span>
                <span className="stat-value">{analysisResult.planetRadius}</span>
              </div>
            </div>
            
            <div className="narrative-section">
              <h4>AI Narrative</h4>
              <p>{analysisResult.narrative}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LightCurveExplorer;