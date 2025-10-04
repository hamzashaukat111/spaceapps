// Utility functions for the Exoplanet Lab app
// TODO: Organize these better and add more comprehensive error handling

/**
 * Format large numbers with appropriate units (K, M, B)
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Calculate distance between two points
 * Used for star map interactions
 */
export const calculateDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Debounce function to limit API calls
 * Learned this pattern from a Stack Overflow answer
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate random color for planets
 * Simple but effective for procedural generation
 */
export const generatePlanetColor = (planetType) => {
  const colors = {
    terrestrial: ['#8bc34a', '#4caf50', '#81c784', '#a5d6a7'],
    'gas-giant': ['#3f51b5', '#5c6bc0', '#7986cb', '#9fa8da'],
    'ice-giant': ['#00bcd4', '#26c6da', '#4dd0e1', '#80deea'],
    rocky: ['#ff5722', '#ff7043', '#ff8a65', '#ffab91']
  };
  
  const typeColors = colors[planetType] || colors.terrestrial;
  return typeColors[Math.floor(Math.random() * typeColors.length)];
};

/**
 * Convert light-years to other units
 * Useful for displaying distances in different scales
 */
export const convertDistance = (lightYears, unit = 'km') => {
  const conversions = {
    km: lightYears * 9.461e12,
    au: lightYears * 63241,
    parsec: lightYears * 0.3066
  };
  
  return conversions[unit] || lightYears;
};

/**
 * Validate email format
 * Basic regex pattern - could be improved
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format time duration in human readable format
 * Takes milliseconds and returns formatted string
 */
export const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

/**
 * Generate unique ID for components
 * Simple implementation - could use uuid library instead
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if device is mobile
 * Useful for responsive behavior
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Smooth scroll to element
 * Cross-browser compatible version
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Export default object with all utilities
// This pattern makes it easier to import everything at once
export default {
  formatLargeNumber,
  calculateDistance,
  debounce,
  generatePlanetColor,
  convertDistance,
  isValidEmail,
  formatDuration,
  generateId,
  isMobile,
  scrollToElement
};