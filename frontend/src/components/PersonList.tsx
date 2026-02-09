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

import React, { useState } from 'react';
import PersonItem from './PersonItem';
import PersonForm from './PersonForm';
import LoadingSpinner from './LoadingSpinner';
import usePersons from '../hooks/usePersons';
import { Person, CreatePersonData } from '../services/personService';
import config from '../config/appConfig';

const PersonList: React.FC = () => {
  // State for UI management (form visibility, editing)
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Use custom hook for person operations
  const {
    persons,
    successMessage,
    loading,
    error,
    createPerson,
    updatePerson,
    deletePerson,
    resetError,
    fetchPersons
  } = usePersons();

  /**
   * Handle creating a new person
   */
  const handleCreate = async (personData: CreatePersonData): Promise<void> => {
    try {
      await createPerson(personData);
      // Hide form on success (handled by optimistic update hook)
      setShowForm(false);
    } catch (error: any) {
      alert('Failed to create person: ' + (error.message || 'Unknown error'));
    }
  };

  /**
   * Handle updating a person
   */
  const handleUpdate = async (personData: CreatePersonData): Promise<void> => {
    if (!editingPerson) return;
    try {
      await updatePerson(editingPerson.id, personData);
      // Hide form and clear editing state on success
      setShowForm(false);
      setEditingPerson(null);
    } catch (error: any) {
      alert('Failed to update person: ' + (error.message || 'Unknown error'));
    }
  };

  /**
   * Handle deleting a person
   */
  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deletePerson(id);
    } catch (error) {
      // Error already handled by hook
    }
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (person: Person) => {
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
      await fetchPersons();
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
