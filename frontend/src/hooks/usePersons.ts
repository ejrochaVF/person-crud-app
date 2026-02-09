/**
 * CUSTOM HOOK: usePersons
 *
 * Manages person CRUD operations with optimistic updates
 * and better error handling patterns.
 *
 * Features:
 * - Optimistic updates for better UX
 * - Rollback on errors
 * - Loading states per operation
 * - Success/error callbacks
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import personService, { Person, CreatePersonData } from '../services/personService';
import useApi from './useApi';
import config from '../config/appConfig';

const usePersons = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const api = useApi();

  /**
   * Show success message that auto-clears
   */
  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), config.ui.successMessageDuration);
  }, []);

  /**
   * Fetch all persons (used internally by the hook)
   */
  const fetchPersons = useCallback(async (): Promise<void> => {
    try {
      const data = await personService.getAllPersons();
      setPersons(data);
    } catch (error) {
      console.error('Error in fetchPersons:', error);
      throw error;
    }
  }, []); // No dependencies needed since we use personService directly

  // Fetch persons on mount
  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  /**
   * Create person with optimistic update
   */
  const createPerson = useCallback(async (personData: CreatePersonData): Promise<Person> => {
    // Create temporary person for optimistic update
    const tempPerson = {
      ...personData,
      id: Date.now(), // Temporary ID
      isOptimistic: true // Flag for optimistic update
    };

    // Optimistically add to UI
    setPersons(prev => [tempPerson, ...prev]);

    try {
      const newPerson = await api.execute(
        () => personService.createPerson(personData),
        {
          onSuccess: () => showSuccess('Person created successfully!'),
          retries: 1
        }
      );

      // Replace optimistic person with real data
      setPersons(prev =>
        prev.map(p => p.id === tempPerson.id ? newPerson : p)
      );

      return newPerson;

    } catch (error: any) {
      // Rollback: Remove optimistic person
      setPersons(prev => prev.filter(p => p.id !== tempPerson.id));

      // Handle validation errors
      if (error.errors) {
        alert('Validation Error:\n' + error.errors.join('\n'));
      } else {
        alert('Failed to create person. Please try again.');
      }

      throw error;
    }
  }, [api, showSuccess]);

  /**
   * Update person with optimistic update
   */
  const updatePerson = useCallback(async (id: number, personData: CreatePersonData): Promise<Person> => {
    // Store original person for rollback
    const originalPerson = persons.find(p => p.id === id);
    if (!originalPerson) throw new Error('Person not found - it may have been deleted or the list is not loaded');

    // Optimistically update UI
    setPersons(prev =>
      prev.map(p => p.id === id ? { ...p, ...personData, isOptimistic: true } : p)
    );

    try {
      const updatedPerson = await api.execute(
        () => personService.updatePerson(id, personData),
        {
          onSuccess: () => showSuccess('Person updated successfully!'),
          retries: 1
        }
      );

      // Replace optimistic update with real data
      setPersons(prev =>
        prev.map(p => p.id === id ? updatedPerson : p)
      );

      return updatedPerson;

    } catch (error: any) {
      // Rollback: Restore original person
      setPersons(prev =>
        prev.map(p => p.id === id ? originalPerson : p)
      );

      // Handle validation errors
      if (error.errors) {
        alert('Validation Error:\n' + error.errors.join('\n'));
      } else {
        alert('Failed to update person. Please try again.');
      }

      throw error;
    }
  }, [api, persons, showSuccess]);

  /**
   * Delete person with optimistic update
   */
  const deletePerson = useCallback(async (id: number): Promise<void> => {
    // Store person for rollback
    const personToDelete = persons.find(p => p.id === id);
    if (!personToDelete) return;

    // Optimistically remove from UI
    setPersons(prev => prev.filter(p => p.id !== id));

    try {
      await api.execute(
        () => personService.deletePerson(id),
        {
          onSuccess: () => showSuccess('Person deleted successfully!'),
          retries: 1
        }
      );

    } catch (error: any) {
      // Rollback: Add person back
      setPersons(prev => [personToDelete, ...prev]);

      alert('Failed to delete person. Please try again.');
      throw error;
    }
  }, [api, persons, showSuccess]);

  return useMemo(() => ({
    // State
    persons,
    successMessage,
    loading: api.loading,
    error: api.error,

    // Actions
    createPerson,
    updatePerson,
    deletePerson,

    // Utilities
    resetError: api.reset,
    fetchPersons
  }), [
    persons,
    successMessage,
    api.loading,
    api.error,
    createPerson,
    updatePerson,
    deletePerson,
    api.reset,
    fetchPersons
  ]);
};

export default usePersons;