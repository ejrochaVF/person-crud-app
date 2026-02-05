/**
 * PERSON ROUTES
 * 
 * This file defines the API endpoints (routes) for Person operations
 * 
 * Purpose:
 * - Map HTTP methods and URLs to controller functions
 * - Define the API structure
 * 
 * RESTful API Design:
 * - GET    /api/persons      -> Get all persons
 * - GET    /api/persons/:id  -> Get one person
 * - POST   /api/persons      -> Create new person
 * - PUT    /api/persons/:id  -> Update person
 * - DELETE /api/persons/:id  -> Delete person
 * 
 * Key Concepts:
 * - Routes are the entry points to your API
 * - They map URLs to controller functions
 * - Express Router allows modular route handling
 */

const express = require('express');

module.exports = (personController) => {
  const router = express.Router();

/**
 * @route   GET /api/persons
 * @desc    Get all persons
 * @access  Public
 */
router.get('/', personController.getAllPersons);

/**
 * @route   GET /api/persons/:id
 * @desc    Get single person by ID
 * @access  Public
 */
router.get('/:id', personController.getPersonById);

/**
 * @route   POST /api/persons
 * @desc    Create new person
 * @access  Public
 */
router.post('/', personController.createPerson);

/**
 * @route   PUT /api/persons/:id
 * @desc    Update person
 * @access  Public
 */
router.put('/:id', personController.updatePerson);

/**
 * @route   DELETE /api/persons/:id
 * @desc    Delete person
 * @access  Public
 */
router.delete('/:id', personController.deletePerson);

/**
 * @route   GET /api/persons/search
 * @desc    Search and filter persons with advanced criteria
 * @access  Public
 * @query   {string} name - Search in name or surname
 * @query   {string} email - Search in email
 * @query   {string} phone - Search in phone
 * @query   {string} address - Search in address
 * @query   {string} createdAfter - Filter by creation date (after)
 * @query   {string} createdBefore - Filter by creation date (before)
 * @query   {number} page - Page number for pagination
 * @query   {number} limit - Items per page
 */
router.get('/search', personController.searchPersons);

/**
 * @route   GET /api/persons/incomplete
 * @desc    Get persons with incomplete profiles
 * @access  Public
 */
router.get('/incomplete', personController.getIncompleteProfiles);

return router;
};
