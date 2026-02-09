/**
 * PERSON FORM COMPONENT
 * 
 * This is part of the PRESENTATION TIER - UI Layer
 * 
 * Responsibility:
 * - Render form for creating/editing persons
 * - Handle form input changes
 * - Validate input (basic client-side validation)
 * - Submit form data to parent component
 * 
 * Props:
 * - person: Person object to edit (null for create mode)
 * - onSubmit: Function to call when form is submitted
 * - onCancel: Function to call when user cancels
 * 
 * Key React Concepts:
 * - useState: Manage form state
 * - useEffect: Load person data when editing
 * - Controlled Components: Form inputs controlled by React state
 */

import React, { useState, useEffect } from 'react';

const PersonForm = ({ person, onSubmit, onCancel, loading = false }) => {
  // State for form fields
  // This is a controlled component - React controls the input values
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    address: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * useEffect Hook
   * 
   * Purpose: Load person data into form when editing
   * Dependency: [person] - runs when person prop changes
   */
  useEffect(() => {
    if (person) {
      // Editing mode - populate form with existing person data
      setFormData({
        name: person.name || '',
        surname: person.surname || '',
        email: person.email || '',
        address: person.address || '',
        phone: person.phone || ''
      });
    } else {
      // Create mode - reset form
      setFormData({
        name: '',
        surname: '',
        email: '',
        address: '',
        phone: ''
      });
    }
  }, [person]);

  /**
   * Handle input changes
   * 
   * How it works:
   * 1. User types in input field
   * 2. onChange event fires
   * 3. This function updates the state
   * 4. React re-renders with new value
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,      // Keep all other fields
      [name]: value // Update the changed field
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   * 
   * Client-side validation (basic checks)
   * Backend will also validate (more thorough)
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    return newErrors;
  };

  /**
   * Handle form submission
   * 
   * Flow:
   * 1. Prevent default form submission (page reload)
   * 2. Validate form data
   * 3. If valid, call onSubmit prop with form data
   * 4. Parent component handles API call
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validate
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Success - parent component will handle UI update
    } catch (error) {
      // Error - parent component will show error message
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="person-form-container">
      <h2>{person ? 'Edit Person' : 'Add New Person'}</h2>
      
      <form onSubmit={handleSubmit} className="person-form">
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">First Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter first name"
            disabled={isSubmitting}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Surname Field */}
        <div className="form-group">
          <label htmlFor="surname">Last Name *</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            className={errors.surname ? 'error' : ''}
            placeholder="Enter last name"
            disabled={isSubmitting}
          />
          {errors.surname && <span className="error-message">{errors.surname}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter email address"
            disabled={isSubmitting}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Address Field */}
        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            placeholder="Enter address"
            disabled={isSubmitting}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        {/* Phone Field */}
        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
            placeholder="Enter phone number"
            disabled={isSubmitting}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (person ? 'Update' : 'Create')}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
