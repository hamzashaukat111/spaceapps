// Azure AI Foundry Agent Service
// Integrates with Azure AI Foundry to provide natural language explanations

const AZURE_AI_CONFIG = {
  endpoint: process.env.REACT_APP_AZURE_AI_ENDPOINT || 'https://hamza-oct-resource.services.ai.azure.com/openai',
  apiKey: process.env.REACT_APP_AZURE_AI_KEY,
  agentId: process.env.REACT_APP_AZURE_AGENT_ID || 'asst_HtTGcHsl3435eNl9Q2L5tfuv',
  apiVersion: '2024-02-15-preview' // Azure OpenAI Assistants API version
};

class AzureAIAgentService {
  constructor() {
    this.endpoint = AZURE_AI_CONFIG.endpoint;
    this.apiKey = AZURE_AI_CONFIG.apiKey;
    this.agentId = AZURE_AI_CONFIG.agentId;
    this.apiVersion = AZURE_AI_CONFIG.apiVersion;
    
    // Validate that API key exists
    if (!this.apiKey) {
      console.error('❌ Azure AI API Key is missing! Set REACT_APP_AZURE_AI_KEY environment variable.');
      console.error('💡 For local development, create a .env file in the frontend directory.');
    }
    
    // Debug info (safe - doesn't expose full key)
    console.log('🔧 Azure AI Agent Service initialized');
    console.log('📍 Endpoint:', this.endpoint);
    console.log('🔑 API Key:', this.apiKey ? `${this.apiKey.substring(0, 10)}... ✓` : '❌ Missing');
    console.log('🤖 Agent ID:', this.agentId);
  }

  /**
   * Create a new thread for conversation
   */
  async createThread() {
    try {
      const url = `${this.endpoint}/threads?api-version=${this.apiVersion}`;
      console.log('📡 Creating thread at:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({})
      });

      console.log('📥 Thread creation response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Thread creation failed:', response.status, errorData);
        throw new Error(`Failed to create thread: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const thread = await response.json();
      console.log('✅ Thread created successfully:', thread.id);
      return thread.id;
    } catch (error) {
      console.error('❌ Error creating thread:', error);
      throw error;
    }
  }

  /**
   * Send message to agent and get response
   */
  async sendMessage(threadId, message) {
    try {
      console.log('📨 Sending message to thread:', threadId);
      
      // Send message to thread
      const messageUrl = `${this.endpoint}/threads/${threadId}/messages?api-version=${this.apiVersion}`;
      const messageResponse = await fetch(messageUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });

      console.log('📥 Message response status:', messageResponse.status);

      if (!messageResponse.ok) {
        const errorData = await messageResponse.json().catch(() => ({}));
        console.error('❌ Failed to create message:', messageResponse.status, errorData);
        throw new Error(`Failed to create message: ${messageResponse.status}`);
      }

      console.log('✅ Message sent successfully');

      // Create and run the agent
      const runUrl = `${this.endpoint}/threads/${threadId}/runs?api-version=${this.apiVersion}`;
      console.log('🏃 Creating run with agent:', this.agentId);
      
      const runResponse = await fetch(runUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          assistant_id: this.agentId
        })
      });

      console.log('📥 Run response status:', runResponse.status);

      if (!runResponse.ok) {
        const errorData = await runResponse.json().catch(() => ({}));
        console.error('❌ Failed to create run:', runResponse.status, errorData);
        throw new Error(`Failed to create run: ${runResponse.status}`);
      }

      const run = await runResponse.json();
      console.log('✅ Run created:', run.id);

      // Poll for completion
      console.log('⏳ Polling run status...');
      const completedRun = await this.pollRunStatus(threadId, run.id);

      if (completedRun.status === 'failed') {
        console.error('❌ Run failed:', completedRun.last_error);
        throw new Error(`Run failed: ${completedRun.last_error?.message || 'Unknown error'}`);
      }

      console.log('✅ Run completed successfully');

      // Get messages
      const messagesUrl = `${this.endpoint}/threads/${threadId}/messages?api-version=${this.apiVersion}&order=desc&limit=1`;
      const messagesResponse = await fetch(messagesUrl, {
        method: 'GET',
        headers: {
          'api-key': this.apiKey
        }
      });

      console.log('📥 Messages response status:', messagesResponse.status);

      if (!messagesResponse.ok) {
        const errorData = await messagesResponse.json().catch(() => ({}));
        console.error('❌ Failed to get messages:', messagesResponse.status, errorData);
        throw new Error(`Failed to get messages: ${messagesResponse.status}`);
      }

      const messages = await messagesResponse.json();
      console.log('📨 Received messages:', messages.data?.length || 0);
      
      // Extract the latest assistant message
      if (messages.data && messages.data.length > 0) {
        const latestMessage = messages.data[0];
        if (latestMessage.content && latestMessage.content.length > 0) {
          const textContent = latestMessage.content.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            console.log('✅ AI Response received');
            return textContent.text.value;
          }
        }
      }

      console.error('❌ No response from agent');
      throw new Error('No response from agent');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw error;
    }
  }

  /**
   * Poll run status until completion
   */
  async pollRunStatus(threadId, runId, maxAttempts = 30) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const url = `${this.endpoint}/threads/${threadId}/runs/${runId}?api-version=${this.apiVersion}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'api-key': this.apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ Failed to get run status (attempt ${attempt + 1}/${maxAttempts}):`, response.status, errorData);
        throw new Error(`Failed to get run status: ${response.status}`);
      }

      const run = await response.json();
      console.log(`⏳ Polling run status (attempt ${attempt + 1}/${maxAttempts}): ${run.status}`);

      if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled') {
        return run;
      }

      // Wait 1 second before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.error('❌ Run timed out after', maxAttempts, 'attempts');
    throw new Error('Run timed out');
  }

  /**
   * Format prediction data for AI agent
   */
  formatPredictionForAgent(prediction, modelInputs) {
    const prompt = `You are Nexus2, an expert AI astronomer analyzing exoplanet detection results. Provide a clear, engaging, and educational explanation.

CLASSIFICATION RESULTS:
- Prediction: ${prediction.predicted_label}
- Confidence: ${prediction.confidence}%
- Probabilities:
  * Planet: ${(parseFloat(prediction.probability_scores.planet) * 100).toFixed(1)}%
  * Candidate: ${(parseFloat(prediction.probability_scores.candidate) * 100).toFixed(1)}%
  * False Positive: ${(parseFloat(prediction.probability_scores.false_positive) * 100).toFixed(1)}%

TOP INFLUENTIAL FEATURES (TabNet Importance):
${this.formatTabNetImportance(prediction.tabnet_importance)}

FEATURE IMPACTS (SHAP Values - CatBoost):
${this.formatShapValues(prediction.catboost_shap)}

INPUT PARAMETERS:
- Source ID: ${modelInputs.source_id}
- Mission: ${modelInputs.mission_code}
- Orbital Period: ${modelInputs.period} days
- Transit Duration: ${modelInputs.duration} hours
- Transit Depth: ${modelInputs.depth} ppm
- Planet Radius: ${modelInputs.radius} Earth radii
- Equilibrium Temperature: ${modelInputs.eqt} K
- Insolation Flux: ${modelInputs.insol} (Earth units)
- Stellar Temperature: ${modelInputs.st_teff} K
- Stellar Surface Gravity: ${modelInputs.st_logg} (log g)
- Stellar Radius: ${modelInputs.st_rad} (solar radii)
- Right Ascension: ${modelInputs.ra}°
- Declination: ${modelInputs.dec}°

Please provide:
1. A clear, engaging explanation of the classification result
2. What the prediction means scientifically
3. Why the top features were most important in this decision
4. What the SHAP values tell us about how the AI made this decision
5. If it's a planet or candidate: what makes this detection interesting and what follow-up observations would be valuable
6. If it's a false positive: what likely caused this signal and what it teaches us about detection challenges
7. Educational insights suitable for both amateur astronomers and students

Keep the tone enthusiastic yet scientific, like explaining to an engaged science enthusiast.`;

    return prompt;
  }

  /**
   * Format TabNet importance for display
   */
  formatTabNetImportance(tabnetImportance) {
    if (!tabnetImportance) return 'Not available';

    const sorted = Object.entries(tabnetImportance)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return sorted
      .map(([feature, importance]) => `  - ${feature}: ${(importance * 100).toFixed(2)}%`)
      .join('\n');
  }

  /**
   * Format SHAP values for display
   */
  formatShapValues(shapValues) {
    if (!shapValues) return 'Not available';

    return Object.entries(shapValues)
      .map(([feature, value]) => {
        const direction = value > 0 ? 'increases' : 'decreases';
        return `  - ${feature}: ${direction} prediction confidence by ${Math.abs(value).toFixed(4)}`;
      })
      .join('\n');
  }

  /**
   * Get AI explanation for prediction
   */
  async getExplanation(prediction, modelInputs) {
    try {
      // Create a new thread for this conversation
      const threadId = await this.createThread();
      console.log('Created thread:', threadId);

      // Format the prediction data into a prompt
      const prompt = this.formatPredictionForAgent(prediction, modelInputs);

      // Send to agent and get response
      const response = await this.sendMessage(threadId, prompt);

      return response;
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      
      // Fallback to a basic response if AI agent fails
      return `I apologize, but I'm having trouble connecting to the AI analysis service right now. Here's what I can tell you based on the raw data:

The model classified this as a **${prediction.predicted_label}** with ${prediction.confidence}% confidence.

**Key Points:**
- The probabilities show: Planet (${(parseFloat(prediction.probability_scores.planet) * 100).toFixed(1)}%), Candidate (${(parseFloat(prediction.probability_scores.candidate) * 100).toFixed(1)}%), False Positive (${(parseFloat(prediction.probability_scores.false_positive) * 100).toFixed(1)}%)
- This detection is from the ${modelInputs.mission_code} mission
- The transit has a period of ${modelInputs.period} days and depth of ${modelInputs.depth} ppm

Please try again in a moment, or feel free to ask specific questions about the results.`;
    }
  }
}

const azureAIAgentService = new AzureAIAgentService();
export default azureAIAgentService;
