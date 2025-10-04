// API service for handling backend communication
// TODO: Add proper error handling and retry logic
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.requestTimeout = 10000; // 10 second timeout
  }

  async post(endpoint, data) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      return { error: error.message };
    }
  }

  async get(endpoint) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      return { error: error.message };
    }
  }

  // User Analytics
  async trackUserInteraction(data) {
    return this.post('/analytics/interaction', {
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...data
    });
  }

  // Game Data
  async submitGameScore(gameType, scoreData) {
    return this.post('/games/score', {
      gameType,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...scoreData
    });
  }

  // User Progress
  async saveUserProgress(progressData) {
    return this.post('/user/progress', {
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...progressData
    });
  }

  // Search Analytics
  async trackSearch(searchData) {
    return this.post('/analytics/search', {
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...searchData
    });
  }

  // Contact Form
  async submitContactForm(formData) {
    return this.post('/contact', {
      timestamp: new Date().toISOString(),
      ...formData
    });
  }

  // Newsletter Signup
  async subscribeNewsletter(email) {
    return this.post('/newsletter/subscribe', {
      email,
      timestamp: new Date().toISOString()
    });
  }

  // Feedback Form
  async submitFeedback(feedbackData) {
    return this.post('/feedback', {
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...feedbackData
    });
  }

  // Session Management - generates unique session IDs
  getSessionId() {
    let sessionId = localStorage.getItem('exoplanet_session_id');
    if (!sessionId) {
      // Generate a unique session ID
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substr(2, 9);
      sessionId = `session_${timestamp}_${randomStr}`;
      
      try {
        localStorage.setItem('exoplanet_session_id', sessionId);
      } catch (e) {
        // Handle localStorage quota exceeded or disabled
        console.warn('Could not save session ID to localStorage:', e);
      }
    }
    return sessionId;
  }

  // Helper method to check if we're in development mode
  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }
}

export default new ApiService();