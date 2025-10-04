import { useEffect, useCallback, useRef } from 'react';
import ApiService from '../services/api';

export const useAnalytics = () => {
  const pageStartTime = useRef(Date.now());
  
  // Track page views with additional context
  const trackPageView = useCallback((pageName) => {
    const trackingData = {
      type: 'page_view',
      page: pageName,
      url: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    // Only track if not in development mode (optional)
    if (process.env.NODE_ENV !== 'development') {
      ApiService.trackUserInteraction(trackingData);
    }
  }, []);

  // Track button clicks with context
  const trackClick = useCallback((elementName, additionalData = {}) => {
    const clickData = {
      type: 'click',
      element: elementName,
      timestamp: new Date().toISOString(),
      ...additionalData
    };
    
    ApiService.trackUserInteraction(clickData);
  }, []);

  // Track time spent on page - more accurate calculation
  const trackTimeSpent = useCallback((pageName, customTimeSpent = null) => {
    const timeSpent = customTimeSpent || (Date.now() - pageStartTime.current);
    
    ApiService.trackUserInteraction({
      type: 'time_spent',
      page: pageName,
      duration: Math.round(timeSpent / 1000), // Convert to seconds
      timestamp: new Date().toISOString()
    });
  }, []);

  // Track search queries with more details
  const trackSearch = useCallback((query, results = 0, searchType = 'general') => {
    ApiService.trackSearch({
      query: query.trim(),
      resultsCount: results,
      searchType,
      queryLength: query.length,
      timestamp: new Date().toISOString()
    });
  }, []);

  // Track game interactions with session data
  const trackGameAction = useCallback((gameType, action, data = {}) => {
    ApiService.trackUserInteraction({
      type: 'game_action',
      gameType,
      action,
      sessionDuration: Date.now() - pageStartTime.current,
      timestamp: new Date().toISOString(),
      ...data
    });
  }, []);

  // Reset page start time when component mounts
  useEffect(() => {
    pageStartTime.current = Date.now();
  }, []);

  return {
    trackPageView,
    trackClick,
    trackTimeSpent,
    trackSearch,
    trackGameAction
  };
};