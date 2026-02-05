/**
 * PERSON LIST COMPONENT
 * 
 * This is part of the PRESENTATION TIER - UI Layer
 * 
 * Responsibility:
 * - Fetch and display list of all persons
 * - Handle loading and error states
 * - Coordinate Create, Edit, and Delete operations
 * - Manage which view to show (list or form)
 * 
 * Key React Concepts:
 * - useState: Manage component state (persons, loading, errors, etc.)
 * - useEffect: Fetch data when component mounts
 * - Conditional Rendering: Show different UI based on state
 * - Lifting State Up: Child components call parent functions
 */

import React, { useState, useEffect } from 'react';
import PersonItem from './PersonItem';
import PersonForm from './PersonForm';
import personService from '../services/personService';

const PersonList = () => {
  // State Management
  const [persons, setPersons] = useState([]);           // List of persons
  const [loading, setLoading] = useState(true);         // Loading state
  const [error, setError] = useState(null);             // Error state
  const [showForm, setShowForm] = useState(false);      // Show/hide form
  const [editingPerson, setEditingPerson] = useState(null); // Person being edited
  const [successMessage, setSuccessMessage] = useState(''); // Success feedback

  /**
   * useEffect Hook - Fetch persons when component mounts
   * 
   * Dependency array []: Runs only once when component mounts
   * This is like componentDidMount in class components
   */
  useEffect(() => {
    fetchPersons();
  }, []); // Empty dependency array = run once on mount

  /**
   * Fetch all persons from the backend
   * 
   * Flow:
   * 1. Set loading to true
   * 2. Call personService.getAllPersons()
   * 3. Update state with persons
   * 4. Handle errors if any
   * 5. Set loading to false
   */
  const fetchPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await personService.getAllPersons();
      setPersons(data);
    } catch (err) {
      setError('Failed to load persons. Please check if the backend is running.');
      console.error('Error fetching persons:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle creating a new person
   * 
   * Flow:
   * 1. Call API to create person
   * 2. Add new person to state
   * 3. Hide form
   * 4. Show success message
   */
  const handleCreate = async (personData) => {
    try {
      const newPerson = await personService.createPerson(personData);
      
      // Add to persons list
      setPersons(prev => [newPerson, ...prev]);
      
      // Reset form state
      setShowForm(false);
      setSuccessMessage('Person created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear after 3 seconds
    } catch (err) {
      // Handle validation errors from backend
      if (err.errors) {
        alert('Validation Error:\n' + err.errors.join('\n'));
      } else {
        alert('Failed to create person. Please try again.');
      }
      throw err; // Re-throw so form knows to stop submitting
    }
  };

  /**
   * Handle updating a person
   * 
   * Flow:
   * 1. Call API to update person
   * 2. Update person in state
   * 3. Hide form
   * 4. Show success message
   */
  const handleUpdate = async (personData) => {
    try {
      const updatedPerson = await personService.updatePerson(editingPerson.id, personData);
      
      // Update in persons list
      setPersons(prev => 
        prev.map(p => p.id === editingPerson.id ? updatedPerson : p)
      );
      
      // Reset form state
      setShowForm(false);
      setEditingPerson(null);
      setSuccessMessage('Person updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (err.errors) {
        alert('Validation Error:\n' + err.errors.join('\n'));
      } else {
        alert('Failed to update person. Please try again.');
      }
      throw err;
    }
  };

  /**
   * Handle deleting a person
   * 
   * Flow:
   * 1. Call API to delete person
   * 2. Remove person from state
   * 3. Show success message
   */
  const handleDelete = async (id) => {
    try {
      await personService.deletePerson(id);
      
      // Remove from persons list
      setPersons(prev => prev.filter(p => p.id !== id));
      
      setSuccessMessage('Person deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete person. Please try again.');
      console.error('Error deleting person:', err);
    }
  };

  /**
   * Handle edit button click
   * 
   * Opens the form in edit mode with person data
   */
  const handleEdit = (person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  /**
   * Handle add new person button click
   * 
   * Opens the form in create mode
   */
  const handleAddNew = () => {
    setEditingPerson(null);
    setShowForm(true);
  };

  /**
   * Handle form cancel
   * 
   * Closes the form and resets state
   */
  const handleCancel = () => {
    setShowForm(false);
    setEditingPerson(null);
  };

  /**
   * Conditional Rendering
   * 
   * Shows different UI based on current state:
   * - Loading: Show loading message
   * - Error: Show error message
   * - Form: Show create/edit form
   * - List: Show persons list
   */

  // Loading State
  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading persons...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchPersons}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="container">
      <header className="app-header">
        <h1>👥 Person Management</h1>
        <p className="subtitle">Full Stack CRUD Application</p>
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
