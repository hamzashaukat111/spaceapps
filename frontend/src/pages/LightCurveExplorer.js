import React, { useState, useRef } from 'react';
import './LightCurveExplorer.css';

const LightCurveExplorer = () => {
  // AI Model Input Parameters (9 fields)
  const [modelInputs, setModelInputs] = useState({
    stellarMass: '',           // Solar masses
    stellarRadius: '',         // Solar radii
    stellarTemperature: '',    // Kelvin
    orbitalPeriod: '',         // Days
    transitDepth: '',          // Fractional depth
    transitDuration: '',       // Hours
    impactParameter: '',       // 0-1 scale
    eccentricity: '',          // 0-1 scale
    metallicity: ''            // [Fe/H] dex
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

  // Dummy data for testing
  const dummyData = {
    stellarMass: '1.2',
    stellarRadius: '1.1',
    stellarTemperature: '5800',
    orbitalPeriod: '4.2',
    transitDepth: '0.015',
    transitDuration: '2.8',
    impactParameter: '0.3',
    eccentricity: '0.05',
    metallicity: '0.1'
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
      stellarMass: '',
      stellarRadius: '',
      stellarTemperature: '',
      orbitalPeriod: '',
      transitDepth: '',
      transitDuration: '',
      impactParameter: '',
      eccentricity: '',
      metallicity: ''
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
        // Mock prediction results
        const prediction = {
          planetRadius: (Math.sqrt(parseFloat(modelInputs.transitDepth)) * parseFloat(modelInputs.stellarRadius) * 109.2).toFixed(2),
          planetMass: (Math.pow(parseFloat(modelInputs.orbitalPeriod) / 365.25, 2/3) * Math.pow(parseFloat(modelInputs.stellarMass), 1/3) * 317.8).toFixed(2),
          equilibriumTemp: (parseFloat(modelInputs.stellarTemperature) * Math.sqrt(parseFloat(modelInputs.stellarRadius) / (2 * Math.pow(parseFloat(modelInputs.orbitalPeriod) / 365.25, 2/3)))).toFixed(0),
          habitabilityScore: (Math.random() * 100).toFixed(1),
          planetType: determinePlanetType(),
          atmospherePresence: Math.random() > 0.5 ? 'Likely' : 'Unlikely',
          confidence: (85 + Math.random() * 15).toFixed(1)
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

  // Helper function to determine planet type
  const determinePlanetType = () => {
    const estimatedRadius = Math.sqrt(parseFloat(modelInputs.transitDepth)) * parseFloat(modelInputs.stellarRadius) * 109.2;
    if (estimatedRadius < 1.25) return 'Terrestrial';
    if (estimatedRadius < 2.0) return 'Super-Earth';
    if (estimatedRadius < 4.0) return 'Mini-Neptune';
    return 'Gas Giant';
  };

  // Generate LLM response
  const generateLLMResponse = (prediction) => {
    return `🌟 **Exoplanet Analysis Complete!**

Based on the stellar and transit parameters you provided, our AI model has identified a fascinating ${prediction.planetType} exoplanet! Here's what we discovered:

**🪐 Planet Characteristics:**
- **Size**: ${prediction.planetRadius} Earth radii (${prediction.planetType})
- **Mass**: ${prediction.planetMass} Earth masses  
- **Temperature**: ${prediction.equilibriumTemp} K
- **Atmosphere**: ${prediction.atmospherePresence}

**🔬 Scientific Insights:**
This ${prediction.planetType} orbits its host star every ${modelInputs.orbitalPeriod} days at a distance that results in an equilibrium temperature of ${prediction.equilibriumTemp} K. ${prediction.habitabilityScore > 50 ? 'The habitability score suggests this world could potentially support liquid water under the right atmospheric conditions!' : 'While not in the traditional habitable zone, this world offers unique insights into planetary formation and evolution.'}

**🎯 Model Confidence:** ${prediction.confidence}%

The transit depth of ${(parseFloat(modelInputs.transitDepth) * 100).toFixed(2)}% and duration of ${modelInputs.transitDuration} hours provide strong evidence for this planetary companion. ${parseFloat(modelInputs.impactParameter) < 0.5 ? 'The low impact parameter suggests we\'re seeing a nearly central transit, giving us excellent precision on the planet\'s radius.' : ''}

Would you like to explore any specific aspects of this discovery or ask questions about the analysis?`;
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
    
    if (lowerQuestion.includes('habitable') || lowerQuestion.includes('life')) {
      return `Based on the analysis, this ${prediction.planetType} has a habitability score of ${prediction.habitabilityScore}/100. ${prediction.habitabilityScore > 50 ? 'This suggests favorable conditions for liquid water, though atmospheric composition would be crucial for actual habitability.' : 'The conditions are challenging for Earth-like life, but extremophiles might find ways to survive.'}`;
    }
    
    if (lowerQuestion.includes('atmosphere')) {
      return `Our model predicts that an atmosphere is ${prediction.atmospherePresence.toLowerCase()} for this planet. ${prediction.planetType === 'Gas Giant' ? 'As a gas giant, it definitely has a thick atmosphere composed primarily of hydrogen and helium.' : prediction.planetType === 'Terrestrial' ? 'For terrestrial planets, atmospheric retention depends on mass, magnetic field, and stellar radiation.' : 'The atmospheric composition would depend on the planet\'s formation history and current stellar environment.'}`;
    }
    
    if (lowerQuestion.includes('temperature') || lowerQuestion.includes('hot') || lowerQuestion.includes('cold')) {
      return `The equilibrium temperature is ${prediction.equilibriumTemp} K (${(parseFloat(prediction.equilibriumTemp) - 273.15).toFixed(0)}°C). ${parseFloat(prediction.equilibriumTemp) > 373 ? 'This is quite hot - any water would be in vapor form.' : parseFloat(prediction.equilibriumTemp) > 273 ? 'This temperature range could allow for liquid water with the right atmospheric pressure.' : 'This is below the freezing point of water, so any water would likely be ice.'}`;
    }
    
    if (lowerQuestion.includes('size') || lowerQuestion.includes('radius') || lowerQuestion.includes('big')) {
      return `This planet has a radius of ${prediction.planetRadius} Earth radii, making it ${parseFloat(prediction.planetRadius) > 1 ? 'larger' : 'smaller'} than Earth. ${prediction.planetType === 'Super-Earth' ? 'Super-Earths like this are among the most common exoplanets we\'ve discovered!' : prediction.planetType === 'Gas Giant' ? 'Gas giants are fascinating worlds with complex atmospheric dynamics.' : 'Terrestrial planets give us the best insights into rocky world formation.'}`;
    }
    
    return `That's an interesting question about this ${prediction.planetType}! The analysis shows it has unique characteristics with a ${prediction.confidence}% confidence level. What specific aspect would you like to explore further - its potential for habitability, atmospheric conditions, or formation history?`;
  };

  return (
    <div className="light-curve-explorer page-container">
      <div className="explorer-header">
        <h1 className="page-title">🤖 AI Exoplanet Detection Model</h1>
        <p className="page-subtitle">Input stellar and transit parameters for AI-powered exoplanet analysis</p>
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
            <label htmlFor="stellarMass">Stellar Mass (M☉)</label>
            <input
              type="text"
              id="stellarMass"
              value={modelInputs.stellarMass}
              onChange={(e) => handleInputChange('stellarMass', e.target.value)}
              placeholder="e.g., 1.2"
              className="model-input"
            />
            <span className="input-unit">Solar masses</span>
          </div>

          <div className="input-group">
            <label htmlFor="stellarRadius">Stellar Radius (R☉)</label>
            <input
              type="text"
              id="stellarRadius"
              value={modelInputs.stellarRadius}
              onChange={(e) => handleInputChange('stellarRadius', e.target.value)}
              placeholder="e.g., 1.1"
              className="model-input"
            />
            <span className="input-unit">Solar radii</span>
          </div>

          <div className="input-group">
            <label htmlFor="stellarTemperature">Stellar Temperature</label>
            <input
              type="text"
              id="stellarTemperature"
              value={modelInputs.stellarTemperature}
              onChange={(e) => handleInputChange('stellarTemperature', e.target.value)}
              placeholder="e.g., 5800"
              className="model-input"
            />
            <span className="input-unit">Kelvin</span>
          </div>

          <div className="input-group">
            <label htmlFor="orbitalPeriod">Orbital Period</label>
            <input
              type="text"
              id="orbitalPeriod"
              value={modelInputs.orbitalPeriod}
              onChange={(e) => handleInputChange('orbitalPeriod', e.target.value)}
              placeholder="e.g., 4.2"
              className="model-input"
            />
            <span className="input-unit">Days</span>
          </div>

          <div className="input-group">
            <label htmlFor="transitDepth">Transit Depth</label>
            <input
              type="text"
              id="transitDepth"
              value={modelInputs.transitDepth}
              onChange={(e) => handleInputChange('transitDepth', e.target.value)}
              placeholder="e.g., 0.015"
              className="model-input"
            />
            <span className="input-unit">Fractional</span>
          </div>

          <div className="input-group">
            <label htmlFor="transitDuration">Transit Duration</label>
            <input
              type="text"
              id="transitDuration"
              value={modelInputs.transitDuration}
              onChange={(e) => handleInputChange('transitDuration', e.target.value)}
              placeholder="e.g., 2.8"
              className="model-input"
            />
            <span className="input-unit">Hours</span>
          </div>

          <div className="input-group">
            <label htmlFor="impactParameter">Impact Parameter</label>
            <input
              type="text"
              id="impactParameter"
              value={modelInputs.impactParameter}
              onChange={(e) => handleInputChange('impactParameter', e.target.value)}
              placeholder="e.g., 0.3"
              className="model-input"
            />
            <span className="input-unit">0-1 scale</span>
          </div>

          <div className="input-group">
            <label htmlFor="eccentricity">Orbital Eccentricity</label>
            <input
              type="text"
              id="eccentricity"
              value={modelInputs.eccentricity}
              onChange={(e) => handleInputChange('eccentricity', e.target.value)}
              placeholder="e.g., 0.05"
              className="model-input"
            />
            <span className="input-unit">0-1 scale</span>
          </div>

          <div className="input-group">
            <label htmlFor="metallicity">Stellar Metallicity</label>
            <input
              type="text"
              id="metallicity"
              value={modelInputs.metallicity}
              onChange={(e) => handleInputChange('metallicity', e.target.value)}
              placeholder="e.g., 0.1"
              className="model-input"
            />
            <span className="input-unit">[Fe/H] dex</span>
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
                <div className="stat-label">Planet Type</div>
                <div className="stat-value">{modelPrediction.planetType}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Radius</div>
                <div className="stat-value">{modelPrediction.planetRadius} R⊕</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Mass</div>
                <div className="stat-value">{modelPrediction.planetMass} M⊕</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Temperature</div>
                <div className="stat-value">{modelPrediction.equilibriumTemp} K</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Habitability</div>
                <div className="stat-value">{modelPrediction.habitabilityScore}/100</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Confidence</div>
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