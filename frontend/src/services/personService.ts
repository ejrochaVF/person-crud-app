/**
 * PERSON SERVICE
 * 
 * This is part of the PRESENTATION TIER - Service Layer
 * 
 * Responsibility:
 * - Handle all HTTP communication with the backend API
 * - Centralize API calls in one place
 * - Abstract the API details from components
 * 
 * Why separate service layer:
 * - Components don't need to know API endpoints
 * - Easy to change backend URL (only change here)
 * - Reusable API calls across multiple components
 * - Easier to test
 * 
 * Library used: Axios
 * - Alternative to fetch API
 * - Automatically handles JSON
 * - Better error handling
 * - Request/response interceptors
 */

import axios from 'axios';
import config from '../config/appConfig';

// Types
interface Person {
  id: number;
  name: string;
  surname: string;
  email: string;
  address: string;
  phone: string;
  isOptimistic?: boolean;
}

interface CreatePersonData {
  name: string;
  surname: string;
  email: string;
  address: string;
  phone: string;
}

// Configure axios defaults
axios.defaults.timeout = config.api.timeout;

// Base URL for all API calls - now from config
const API_URL = config.api.personsURL as string;

/**
 * PersonService Object
 * Contains all API methods for Person CRUD operations
 */
const personService = {
  /**
   * Get all persons from the database
   * 
   * HTTP: GET /api/persons
   * 
   * @returns {Promise<Array>} Array of person objects
   * @throws {Error} If the request fails
   */
  getAllPersons: async (): Promise<Person[]> => {
    try {
      const response = await axios.get(API_URL);
      // Backend returns: { success: true, count: X, data: [...] }
      return response.data.data; // Return just the array of persons
    } catch (error) {
      console.error('Error fetching persons:', error);
      throw error; // Re-throw so component can handle it
    }
  },

  /**
   * Get a single person by ID
   * 
   * HTTP: GET /api/persons/:id
   * 
   * @param {number} id - Person ID
   * @returns {Promise<Object>} Person object
   * @throws {Error} If person not found or request fails
   */
  getPersonById: async (id: number): Promise<Person> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching person ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new person
   * 
   * HTTP: POST /api/persons
   * 
   * @param {Object} personData - Person data
   * @param {string} personData.name - First name
   * @param {string} personData.surname - Last name
   * @param {string} personData.email - Email address
   * @param {string} personData.address - Physical address
   * @param {string} personData.phone - Phone number
   * @returns {Promise<Object>} Created person object
   * @throws {Error} If validation fails or request fails
   */
  createPerson: async (personData: CreatePersonData): Promise<Person> => {
    try {
      const response = await axios.post(API_URL, personData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating person:', error);
      // If backend returns validation errors
      if (error.response && error.response.data) {
        throw error.response.data; // Throw the backend error response
      }
      throw error;
    }
  },

  /**
   * Update an existing person
   * 
   * HTTP: PUT /api/persons/:id
   * 
   * @param {number} id - Person ID to update
   * @param {Object} personData - Updated person data
   * @returns {Promise<Object>} Updated person object
   * @throws {Error} If person not found, validation fails, or request fails
   */
  updatePerson: async (id: number, personData: CreatePersonData): Promise<Person> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, personData);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating person ${id}:`, error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  /**
   * Delete a person
   * 
   * HTTP: DELETE /api/persons/:id
   * 
   * @param {number} id - Person ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If person not found or request fails
   */
  deletePerson: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // No data returned, just success
    } catch (error: any) {
      console.error(`Error deleting person ${id}:`, error);
      throw error;
    }
  }
};

export type { Person, CreatePersonData };
export default personService;
