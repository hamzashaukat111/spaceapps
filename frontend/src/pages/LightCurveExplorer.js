import React, { useState, useRef } from 'react';
import './LightCurveExplorer.css';

const LightCurveExplorer = () => {
  // AI Model Input Parameters (12 fields matching dataset)
  const [modelInputs, setModelInputs] = useState({
    source_id: '',        // Unique star ID (categorical)
    period: '',           // Orbital period of exoplanet candidate
    duration: '',         // Transit duration (hours)
    depth: '',            // Transit depth (relative brightness drop)
    radius: '',           // Planet radius
    eqt: '',              // Equilibrium temperature
    insol: '',            // Insolation flux (relative to Earth)
    st_teff: '',          // Stellar effective temperature
    st_logg: '',          // Stellar surface gravity
    st_rad: '',           // Stellar radius
    ra: '',               // Right ascension (celestial coordinate)
    dec: '',              // Declination (celestial coordinate)
    mission_code: 'KEPLER' // KEPLER/TESS/K2 (categorical)
  });
  
  // State management
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelPrediction, setModelPrediction] = useState(null);
  const [llmResponse, setLlmResponse] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const csvInputRef = useRef(null);

  // Dummy data for testing (matching dataset features)
  const dummyData = {
    source_id: 'KIC-12345678',
    period: '4.2',
    duration: '2.8',
    depth: '0.015',
    radius: '1.2',
    eqt: '288',
    insol: '1.1',
    st_teff: '5800',
    st_logg: '4.4',
    st_rad: '1.1',
    ra: '285.67',
    dec: '42.33',
    mission_code: 'KEPLER'
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setModelInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Load dummy data
  const loadDummyData = () => {
    setModelInputs(dummyData);
  };

  // Clear all inputs
  const clearInputs = () => {
    setModelInputs({
      source_id: '',
      period: '',
      duration: '',
      depth: '',
      radius: '',
      eqt: '',
      insol: '',
      st_teff: '',
      st_logg: '',
      st_rad: '',
      ra: '',
      dec: '',
      mission_code: 'KEPLER'
    });
  };

  // Handle CSV file upload
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      
      // Parse CSV and populate fields
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const lines = csv.split('\n');
        
        // Assuming CSV format: field,value
        const data = {};
        lines.forEach(line => {
          const [field, value] = line.split(',');
          if (field && value && modelInputs.hasOwnProperty(field.trim())) {
            data[field.trim()] = value.trim();
          }
        });
        
        setModelInputs(prev => ({ ...prev, ...data }));
      };
      reader.readAsText(file);
    }
  };

  // Run AI model prediction
  const runPrediction = async () => {
    // Validate inputs
    const requiredFields = Object.keys(modelInputs);
    const emptyFields = requiredFields.filter(field => !modelInputs[field]);
    
    if (emptyFields.length > 0) {
      alert(`Please fill in all fields. Missing: ${emptyFields.join(', ')}`);
      return;
    }

    setIsProcessing(true);
    setModelPrediction(null);
    setLlmResponse('');

    try {
      // Simulate API call to AI model
      setTimeout(async () => {
        // Mock prediction results based on dataset output format
        const labelOptions = ['planet', 'candidate', 'false_positive'];
        const labelIndex = Math.floor(Math.random() * 3);
        const predictedLabel = labelOptions[labelIndex];
        
        const prediction = {
          label_enc: labelIndex, // 0=planet, 1=candidate, 2=false_positive
          predicted_label: predictedLabel,
          confidence: (85 + Math.random() * 15).toFixed(1),
          probability_scores: {
            planet: (Math.random() * 0.4 + (labelIndex === 0 ? 0.6 : 0.1)).toFixed(3),
            candidate: (Math.random() * 0.4 + (labelIndex === 1 ? 0.6 : 0.1)).toFixed(3),
            false_positive: (Math.random() * 0.4 + (labelIndex === 2 ? 0.6 : 0.1)).toFixed(3)
          },
          // Additional derived metrics for display
          planetRadius: parseFloat(modelInputs.radius) || 1.0,
          equilibriumTemp: parseFloat(modelInputs.eqt) || 288,
          stellarTemp: parseFloat(modelInputs.st_teff) || 5800,
          transitDepth: parseFloat(modelInputs.depth) || 0.01,
          orbitalPeriod: parseFloat(modelInputs.period) || 1.0
        };

        setModelPrediction(prediction);

        // Generate LLM response based on prediction
        const llmText = generateLLMResponse(prediction);
        setLlmResponse(llmText);
        
        setIsProcessing(false);
      }, 3000);

    } catch (error) {
      console.error('Prediction failed:', error);
      setIsProcessing(false);
    }
  };

  // Helper function to get classification description
  const getClassificationDescription = (label) => {
    switch(label) {
      case 'planet':
        return 'Confirmed Exoplanet';
      case 'candidate':
        return 'Exoplanet Candidate';
      case 'false_positive':
        return 'False Positive';
      default:
        return 'Unknown';
    }
  };

  // Generate LLM response
  const generateLLMResponse = (prediction) => {
    const classification = getClassificationDescription(prediction.predicted_label);
    const isConfirmed = prediction.predicted_label === 'planet';
    const isCandidate = prediction.predicted_label === 'candidate';
    
    return `🌟 **Nexa AI Classification Complete!**

Based on the stellar and transit parameters you provided, our AI model has classified this object as: **${classification}**

**🎯 Classification Results:**
- **Prediction**: ${classification}
- **Confidence**: ${prediction.confidence}%
- **Label Encoding**: ${prediction.label_enc}

**📊 Probability Scores:**
- **Planet**: ${(parseFloat(prediction.probability_scores.planet) * 100).toFixed(1)}%
- **Candidate**: ${(parseFloat(prediction.probability_scores.candidate) * 100).toFixed(1)}%
- **False Positive**: ${(parseFloat(prediction.probability_scores.false_positive) * 100).toFixed(1)}%

**🔬 Object Characteristics:**
- **Radius**: ${prediction.planetRadius} Earth radii
- **Equilibrium Temperature**: ${prediction.equilibriumTemp} K
- **Orbital Period**: ${prediction.orbitalPeriod} days
- **Transit Depth**: ${(prediction.transitDepth * 100).toFixed(3)}%
- **Host Star Temperature**: ${prediction.stellarTemp} K

**🚀 Scientific Interpretation:**
${isConfirmed ? 'This object shows strong evidence of being a genuine exoplanet with high confidence scores across multiple parameters.' : 
  isCandidate ? 'This object requires further observation and analysis to confirm its planetary nature. The signal shows promising characteristics but needs additional validation.' : 
  'This signal is likely a false positive caused by stellar activity, instrumental noise, or other astrophysical phenomena rather than a transiting planet.'}

The transit signature with a depth of ${(prediction.transitDepth * 100).toFixed(3)}% and period of ${prediction.orbitalPeriod} days ${isConfirmed || isCandidate ? 'provides valuable insights into this potential world\'s properties.' : 'appears to be caused by non-planetary sources.'}

Would you like to explore specific aspects of this classification or ask questions about the analysis methodology?`;
  };

  // Handle chat functionality
  const sendChatMessage = async () => {
    if (!chatInput.trim() || !modelPrediction) return;

    const userMessage = {
      type: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    // Simulate LLM response
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        content: generateChatResponse(chatInput, modelPrediction),
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, botResponse]);
      setIsChatLoading(false);
    }, 1500);
  };

  // Generate contextual chat responses
  const generateChatResponse = (question, prediction) => {
    const lowerQuestion = question.toLowerCase();
    const classification = getClassificationDescription(prediction.predicted_label);
    const isConfirmed = prediction.predicted_label === 'planet';
    const isCandidate = prediction.predicted_label === 'candidate';
    const isFalsePositive = prediction.predicted_label === 'false_positive';
    
    if (lowerQuestion.includes('classification') || lowerQuestion.includes('type') || lowerQuestion.includes('category')) {
      return `The AI model classified this object as a **${classification}** with ${prediction.confidence}% confidence. ${isConfirmed ? 'This indicates strong evidence for a genuine exoplanet.' : isCandidate ? 'This means it shows promising signs but requires further validation.' : 'This suggests the signal is likely caused by non-planetary sources.'}`;
    }
    
    if (lowerQuestion.includes('probability') || lowerQuestion.includes('score') || lowerQuestion.includes('confidence')) {
      return `The probability scores are: Planet (${(parseFloat(prediction.probability_scores.planet) * 100).toFixed(1)}%), Candidate (${(parseFloat(prediction.probability_scores.candidate) * 100).toFixed(1)}%), False Positive (${(parseFloat(prediction.probability_scores.false_positive) * 100).toFixed(1)}%). The model is ${prediction.confidence}% confident in its ${classification} classification.`;
    }
    
    if (lowerQuestion.includes('false positive') || lowerQuestion.includes('error') || lowerQuestion.includes('wrong')) {
      return `${isFalsePositive ? 'Yes, this object is classified as a false positive, meaning the transit-like signal is likely caused by stellar activity, instrumental noise, or other astrophysical phenomena rather than a planet.' : `The false positive probability is ${(parseFloat(prediction.probability_scores.false_positive) * 100).toFixed(1)}%, which is ${parseFloat(prediction.probability_scores.false_positive) < 0.3 ? 'relatively low, suggesting this is likely a real signal.' : 'significant and should be considered in the analysis.'}`}`;
    }
    
    if (lowerQuestion.includes('temperature') || lowerQuestion.includes('hot') || lowerQuestion.includes('cold')) {
      return `The equilibrium temperature is ${prediction.equilibriumTemp} K (${(parseFloat(prediction.equilibriumTemp) - 273.15).toFixed(0)}°C). ${isConfirmed || isCandidate ? `${parseFloat(prediction.equilibriumTemp) > 373 ? 'This is quite hot - any water would be in vapor form.' : parseFloat(prediction.equilibriumTemp) > 273 ? 'This temperature range could allow for liquid water with the right atmospheric pressure.' : 'This is below the freezing point of water, so any water would likely be ice.'}` : 'However, since this is classified as a false positive, these temperature calculations may not represent a real planet.'}`;
    }
    
    if (lowerQuestion.includes('size') || lowerQuestion.includes('radius') || lowerQuestion.includes('big')) {
      return `The input radius is ${prediction.planetRadius} Earth radii. ${isConfirmed ? 'As a confirmed planet, this size suggests interesting characteristics for further study.' : isCandidate ? 'If confirmed as a planet, this size would make it an interesting target for follow-up observations.' : 'However, since this is classified as a false positive, this radius measurement likely doesn\'t represent a real planet.'}`;
    }
    
    if (lowerQuestion.includes('period') || lowerQuestion.includes('orbit')) {
      return `The orbital period is ${prediction.orbitalPeriod} days with a transit depth of ${(prediction.transitDepth * 100).toFixed(3)}%. ${isConfirmed || isCandidate ? 'This orbital configuration provides valuable insights into the system architecture.' : 'However, as a false positive, this periodicity is likely caused by stellar variability or other non-planetary sources.'}`;
    }
    
    return `That's an interesting question about this ${classification}! The Nexa AI model shows ${prediction.confidence}% confidence in this classification. ${isConfirmed ? 'As a confirmed planet, this opens up many exciting research possibilities.' : isCandidate ? 'As a candidate, this object would benefit from additional observations to confirm its nature.' : 'As a false positive, this helps us understand the various sources of noise in exoplanet detection.'} What specific aspect would you like to explore further?`;
  };

  return (
    <div className="light-curve-explorer page-container">
      <div className="explorer-header">
        <h1 className="page-title">🤖 Nexa AI Detection Model</h1>
        <p className="page-subtitle">Input stellar and transit parameters for AI-powered exoplanet classification</p>
      </div>

      {/* Input Section */}
      <div className="model-inputs-section">
        <div className="section-header">
          <h3>📊 Model Input Parameters</h3>
          <div className="input-actions">
            <button className="dummy-data-btn" onClick={loadDummyData}>
              🎲 Load Dummy Data
            </button>
            <button className="clear-btn" onClick={clearInputs}>
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* CSV Upload */}
        <div className="csv-upload-section">
          <input
            type="file"
            ref={csvInputRef}
            accept=".csv"
            onChange={handleCsvUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="csv-upload-btn"
            onClick={() => csvInputRef.current?.click()}
          >
            📁 Upload CSV File
          </button>
          {uploadedFile && (
            <span className="uploaded-file">✅ {uploadedFile.name}</span>
          )}
        </div>

        {/* Input Grid */}
        <div className="inputs-grid">
          <div className="input-group">
            <label htmlFor="source_id">Source ID</label>
            <input
              type="text"
              id="source_id"
              value={modelInputs.source_id}
              onChange={(e) => handleInputChange('source_id', e.target.value)}
              placeholder="e.g., KIC-12345678"
              className="model-input"
            />
            <span className="input-unit">Unique star identifier</span>
          </div>

          <div className="input-group">
            <label htmlFor="period">Period</label>
            <input
              type="text"
              id="period"
              value={modelInputs.period}
              onChange={(e) => handleInputChange('period', e.target.value)}
              placeholder="e.g., 4.2"
              className="model-input"
            />
            <span className="input-unit">Orbital period (days)</span>
          </div>

          <div className="input-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              value={modelInputs.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g., 2.8"
              className="model-input"
            />
            <span className="input-unit">Transit duration (hours)</span>
          </div>

          <div className="input-group">
            <label htmlFor="depth">Depth</label>
            <input
              type="text"
              id="depth"
              value={modelInputs.depth}
              onChange={(e) => handleInputChange('depth', e.target.value)}
              placeholder="e.g., 0.015"
              className="model-input"
            />
            <span className="input-unit">Transit depth (relative brightness drop)</span>
          </div>

          <div className="input-group">
            <label htmlFor="radius">Planet Radius</label>
            <input
              type="text"
              id="radius"
              value={modelInputs.radius}
              onChange={(e) => handleInputChange('radius', e.target.value)}
              placeholder="e.g., 1.2"
              className="model-input"
            />
            <span className="input-unit">Planet radius (Earth radii)</span>
          </div>

          <div className="input-group">
            <label htmlFor="eqt">Equilibrium Temperature</label>
            <input
              type="text"
              id="eqt"
              value={modelInputs.eqt}
              onChange={(e) => handleInputChange('eqt', e.target.value)}
              placeholder="e.g., 288"
              className="model-input"
            />
            <span className="input-unit">Temperature (Kelvin)</span>
          </div>

          <div className="input-group">
            <label htmlFor="insol">Insolation Flux</label>
            <input
              type="text"
              id="insol"
              value={modelInputs.insol}
              onChange={(e) => handleInputChange('insol', e.target.value)}
              placeholder="e.g., 1.1"
              className="model-input"
            />
            <span className="input-unit">Relative to Earth</span>
          </div>

          <div className="input-group">
            <label htmlFor="st_teff">Stellar Temperature</label>
            <input
              type="text"
              id="st_teff"
              value={modelInputs.st_teff}
              onChange={(e) => handleInputChange('st_teff', e.target.value)}
              placeholder="e.g., 5800"
              className="model-input"
            />
            <span className="input-unit">Effective temperature (K)</span>
          </div>

          <div className="input-group">
            <label htmlFor="st_logg">Stellar Surface Gravity</label>
            <input
              type="text"
              id="st_logg"
              value={modelInputs.st_logg}
              onChange={(e) => handleInputChange('st_logg', e.target.value)}
              placeholder="e.g., 4.4"
              className="model-input"
            />
            <span className="input-unit">log(g) [cm/s²]</span>
          </div>

          <div className="input-group">
            <label htmlFor="st_rad">Stellar Radius</label>
            <input
              type="text"
              id="st_rad"
              value={modelInputs.st_rad}
              onChange={(e) => handleInputChange('st_rad', e.target.value)}
              placeholder="e.g., 1.1"
              className="model-input"
            />
            <span className="input-unit">Solar radii</span>
          </div>

          <div className="input-group">
            <label htmlFor="ra">Right Ascension</label>
            <input
              type="text"
              id="ra"
              value={modelInputs.ra}
              onChange={(e) => handleInputChange('ra', e.target.value)}
              placeholder="e.g., 285.67"
              className="model-input"
            />
            <span className="input-unit">Degrees</span>
          </div>

          <div className="input-group">
            <label htmlFor="dec">Declination</label>
            <input
              type="text"
              id="dec"
              value={modelInputs.dec}
              onChange={(e) => handleInputChange('dec', e.target.value)}
              placeholder="e.g., 42.33"
              className="model-input"
            />
            <span className="input-unit">Degrees</span>
          </div>

          <div className="input-group">
            <label htmlFor="mission_code">Mission Code</label>
            <select
              id="mission_code"
              value={modelInputs.mission_code}
              onChange={(e) => handleInputChange('mission_code', e.target.value)}
              className="model-input"
            >
              <option value="KEPLER">KEPLER</option>
              <option value="TESS">TESS</option>
              <option value="K2">K2</option>
            </select>
            <span className="input-unit">Space mission</span>
          </div>
        </div>

        {/* Run Prediction Button */}
        <div className="prediction-section">
          <button 
            className="run-prediction-btn"
            onClick={runPrediction}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                Running AI Model...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                </svg>
                Run Prediction
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Output and Chat Section */}
      {(modelPrediction || llmResponse) && (
        <div className="ai-output-section">
          <div className="section-header">
            <h3>🎯 AI Analysis Results</h3>
          </div>

          {/* LLM Response */}
          {llmResponse && (
            <div className="llm-response">
              <div className="response-content">
                {llmResponse.split('\n').map((line, index) => (
                  <p key={index} className={line.startsWith('**') ? 'response-heading' : 'response-text'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {modelPrediction && (
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-label">Classification</div>
                <div className="stat-value">{getClassificationDescription(modelPrediction.predicted_label)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Label Encoding</div>
                <div className="stat-value">{modelPrediction.label_enc}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Planet Probability</div>
                <div className="stat-value">{(parseFloat(modelPrediction.probability_scores.planet) * 100).toFixed(1)}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Candidate Probability</div>
                <div className="stat-value">{(parseFloat(modelPrediction.probability_scores.candidate) * 100).toFixed(1)}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">False Positive Probability</div>
                <div className="stat-value">{(parseFloat(modelPrediction.probability_scores.false_positive) * 100).toFixed(1)}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Model Confidence</div>
                <div className="stat-value">{modelPrediction.confidence}%</div>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className="chat-interface">
            <div className="chat-header">
              <h4>💬 Chat with AI Assistant</h4>
              <p>Ask questions about the analysis results</p>
            </div>

            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.type}`}>
                  <div className="message-avatar">
                    {message.type === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">{message.timestamp}</div>
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="chat-message bot">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input-section">
              <div className="chat-input-container">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about habitability, atmosphere, temperature..."
                  className="chat-input"
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  disabled={!modelPrediction}
                />
                <button 
                  className="send-btn"
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || !modelPrediction || isChatLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              
              {!modelPrediction && (
                <p className="chat-disabled-message">
                  Run a prediction first to enable chat functionality
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightCurveExplorer;