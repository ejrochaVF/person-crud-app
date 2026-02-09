/**
 * PERSON LIST COMPONENT - ENHANCED VERSION
 *
 * Enhanced with robustness patterns:
 * - Error Boundary for error handling
 * - Custom hooks for API logic
 * - Optimistic updates for better UX
 * - Retry logic for failed requests
 * - Better loading states
 */

import React, { useState, useEffect, useRef } from 'react';
import PersonItem from './PersonItem';
import PersonForm from './PersonForm';
import LoadingSpinner from './LoadingSpinner';
import usePersons from '../hooks/usePersons';
import personService from '../services/personService';
import config from '../config/appConfig';

const PersonList = () => {
  // State for UI management (form visibility, editing)
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  // Ref to prevent infinite API calls
  const hasFetchedRef = useRef(false);

  // Use custom hook for person operations (excluding fetchPersons for initial load)
  const {
    persons: hookPersons,
    successMessage,
    loading,
    error,
    createPerson,
    updatePerson,
    deletePerson,
    resetError
  } = usePersons();

  // Use local persons state for initial load, hook persons for operations
  const [persons, setPersons] = useState(hookPersons);

  /**
   * useEffect Hook - Fetch persons when component mounts
   */
  useEffect(() => {
    const loadPersons = async () => {
      try {
        setPersons([]); // Clear any existing data
        const data = await personService.getAllPersons();
        setPersons(data);
      } catch (err) {
        console.error('Error fetching persons:', err);
        // Error will be handled by the hook's error state if needed
      }
    };

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadPersons();
    }
  }, []); // Empty dependency array - only run once on mount

  /**
   * Handle creating a new person
   */
  const handleCreate = async (personData) => {
    try {
      await createPerson(personData);
      // Hide form on success (handled by optimistic update hook)
      setShowForm(false);
    } catch (error) {
      // Error already handled by hook
      throw error;
    }
  };

  /**
   * Handle updating a person
   */
  const handleUpdate = async (personData) => {
    try {
      await updatePerson(editingPerson.id, personData);
      // Hide form and clear editing state on success
      setShowForm(false);
      setEditingPerson(null);
    } catch (error) {
      // Error already handled by hook
      throw error;
    }
  };

  /**
   * Handle deleting a person
   */
  const handleDelete = async (id) => {
    // Confirmation dialog
    const person = persons.find(p => p.id === id);
    if (!person) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${person.name} ${person.surname}?`
    );

    if (confirmDelete) {
      try {
        await deletePerson(id);
      } catch (error) {
        // Error already handled by hook
      }
    }
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  /**
   * Handle add new person button click
   */
  const handleAddNew = () => {
    setEditingPerson(null);
    setShowForm(true);
  };

  /**
   * Handle form cancel
   */
  const handleCancel = () => {
    setShowForm(false);
    setEditingPerson(null);
  };

  /**
   * Handle retry after error
   */
  const handleRetry = async () => {
    resetError();
    try {
      setPersons([]); // Clear any existing data
      const data = await personService.getAllPersons();
      setPersons(data);
    } catch (err) {
      console.error('Error retrying fetch:', err);
      // Error will be handled by the hook's error state
    }
  };

  // Loading State
  if (loading && persons.length === 0) {
    return <LoadingSpinner message="Loading persons..." fullScreen />;
  }

  // Error State
  if (error && persons.length === 0) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error.message || 'Failed to load persons. Please check if the backend is running.'}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={handleRetry}>
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="container">
      <header className="app-header">
        <h1>👥 {config.app.name}</h1>
        <p className="subtitle">Full Stack CRUD Application with Enhanced Robustness</p>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      {/* Show Form or List */}
      {showForm ? (
        <PersonForm
          person={editingPerson}
          onSubmit={editingPerson ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          loading={loading}
        />
      ) : (
        <div className="persons-container">
          {/* Header with Add Button */}
          <div className="list-header">
            <h2>All Persons ({persons.length})</h2>
            <button className="btn btn-primary" onClick={handleAddNew}>
              ➕ Add New Person
            </button>
          </div>

          {/* Loading overlay for operations */}
          {loading && (
            <div className="loading-overlay">
              <LoadingSpinner size="small" message="Processing..." />
            </div>
          )}

          {/* Persons List */}
          {persons.length === 0 ? (
            <div className="empty-state">
              <p>No persons found. Add your first person!</p>
              <button className="btn btn-primary" onClick={handleAddNew}>
                ➕ Add Person
              </button>
            </div>
          ) : (
            <div className="persons-list">
              {persons.map(person => (
                <PersonItem
                  key={person.id}
                  person={person}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isOptimistic={person.isOptimistic}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonList;
