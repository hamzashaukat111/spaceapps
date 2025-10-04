// Application constants and configuration
// Centralized place for all app-wide constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// App Metadata
export const APP_INFO = {
  NAME: 'Exoplanet Lab',
  VERSION: '1.0.0',
  DESCRIPTION: 'Interactive exoplanet discovery and exploration platform',
  AUTHOR: 'NASA Space Apps Challenge Team',
  REPOSITORY: 'https://github.com/your-username/exoplanet-lab'
};

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  DISCOVERY: '/discovery',
  EXPLORER: '/explorer',
  SIMULATOR: '/simulator',
  MISSIONS: '/missions',
  INTERACTIVE: '/interactive'
};

// Game Configuration
export const GAME_CONFIG = {
  EXOPLANET_HUNT: {
    TIME_LIMIT: 120, // 2 minutes
    POINTS_PER_DISCOVERY: 100,
    BONUS_MULTIPLIER: 1.5,
    DIFFICULTY_LEVELS: ['easy', 'medium', 'hard']
  },
  STAR_EXPLORER: {
    ZOOM_LEVELS: [0.5, 1, 2, 4],
    ANIMATION_SPEED: 0.001,
    MAX_STARS_VISIBLE: 50
  }
};

// 3D Visualization Settings
export const VISUALIZATION_CONFIG = {
  SOLAR_SYSTEM: {
    PLANET_SCALE: 0.1,
    ORBIT_SCALE: 0.05,
    ANIMATION_SPEED: 0.01,
    CAMERA_DISTANCE: 50
  },
  STAR_MAP: {
    GRID_SIZE: 50,
    STAR_SIZE_MULTIPLIER: 8,
    GLOW_RADIUS: 25,
    ORBIT_RADIUS_BASE: 15
  }
};

// UI Constants
export const UI_CONFIG = {
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200
  },
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
  },
  DEBOUNCE_DELAY: 300 // For search inputs
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
  SEARCH: 'search',
  GAME_START: 'game_start',
  GAME_END: 'game_end',
  DISCOVERY: 'discovery',
  SHARE: 'share'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  NOT_FOUND: 'The requested resource was not found.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Your message has been sent successfully!',
  GAME_COMPLETED: 'Congratulations! You completed the challenge!',
  DISCOVERY_MADE: 'Amazing! You discovered a new exoplanet!',
  PROGRESS_SAVED: 'Your progress has been saved.'
};

// Exoplanet Data Constants
export const EXOPLANET_TYPES = {
  TERRESTRIAL: 'terrestrial',
  GAS_GIANT: 'gas-giant',
  ICE_GIANT: 'ice-giant',
  ROCKY: 'rocky',
  SUPER_EARTH: 'super-earth'
};

export const STAR_TYPES = {
  G_TYPE: 'G-type',
  M_DWARF: 'M-dwarf',
  K_DWARF: 'K-dwarf',
  F_TYPE: 'F-type',
  A_TYPE: 'A-type'
};

// Color Schemes
export const COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3',
  
  // Planet Colors
  PLANETS: {
    [EXOPLANET_TYPES.TERRESTRIAL]: ['#8bc34a', '#4caf50', '#81c784'],
    [EXOPLANET_TYPES.GAS_GIANT]: ['#3f51b5', '#5c6bc0', '#7986cb'],
    [EXOPLANET_TYPES.ICE_GIANT]: ['#00bcd4', '#26c6da', '#4dd0e1'],
    [EXOPLANET_TYPES.ROCKY]: ['#ff5722', '#ff7043', '#ff8a65']
  },
  
  // Star Colors
  STARS: {
    [STAR_TYPES.G_TYPE]: '#ffeb3b',
    [STAR_TYPES.M_DWARF]: '#ff5722',
    [STAR_TYPES.K_DWARF]: '#ff9800',
    [STAR_TYPES.F_TYPE]: '#fff9c4',
    [STAR_TYPES.A_TYPE]: '#e3f2fd'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SESSION_ID: 'exoplanet_session_id',
  USER_PROGRESS: 'exoplanet_user_progress',
  GAME_SCORES: 'exoplanet_game_scores',
  PREFERENCES: 'exoplanet_preferences',
  TUTORIAL_COMPLETED: 'exoplanet_tutorial_completed'
};

// Feature Flags
export const FEATURES = {
  ANALYTICS_ENABLED: process.env.NODE_ENV === 'production',
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  EXPERIMENTAL_FEATURES: false,
  OFFLINE_MODE: false
};

// Default export for easy importing
export default {
  API_CONFIG,
  APP_INFO,
  ROUTES,
  GAME_CONFIG,
  VISUALIZATION_CONFIG,
  UI_CONFIG,
  ANALYTICS_EVENTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  EXOPLANET_TYPES,
  STAR_TYPES,
  COLORS,
  STORAGE_KEYS,
  FEATURES
};