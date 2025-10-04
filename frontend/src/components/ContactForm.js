import React, { useState } from 'react';
import ApiService from '../services/api';
import { isValidEmail } from '../utils/helpers';
import './ContactForm.css';

const ContactForm = ({ isOpen, onClose }) => {
  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'student'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input changes with basic validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await ApiService.submitContactForm(formData);
      
      if (response.error) {
        console.error('Form submission error:', response.error);
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        // Reset form on successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          userType: 'student'
        });
        
        // Auto-close modal after 2 seconds on success
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Unexpected error during form submission:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-header">
          <h2>Contact NASA Exoplanet Team</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={validationErrors.name ? 'error' : ''}
              required
            />
            {validationErrors.name && (
              <span className="error-text">{validationErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={validationErrors.email ? 'error' : ''}
              required
            />
            {validationErrors.email && (
              <span className="error-text">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="userType">I am a *</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="educator">Educator</option>
              <option value="researcher">Researcher</option>
              <option value="enthusiast">Space Enthusiast</option>
              <option value="media">Media/Press</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Tell us more about your inquiry..."
              required
            />
          </div>

          {submitStatus === 'success' && (
            <div className="success-message">
              ✅ Thank you! Your message has been sent successfully.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="error-message">
              ❌ Sorry, there was an error sending your message. Please try again.
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;