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

import express, { Router } from 'express';

interface PersonController {
  getAllPersons: any;
  getPersonById: any;
  createPerson: any;
  updatePerson: any;
  deletePerson: any;
  searchPersons: any;
  getIncompleteProfiles: any;
}

export default (personController: PersonController): Router => {
  const router = express.Router();

/**
 * @swagger
 * /api/persons:
 *   get:
 *     summary: Get all persons
 *     description: Retrieve a list of all persons in the system
 *     tags: [Persons]
 *     responses:
 *       200:
 *         description: List of persons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PersonsList'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', personController.getAllPersons);

/**
 * @swagger
 * /api/persons/{id}:
 *   get:
 *     summary: Get person by ID
 *     description: Retrieve a single person by their unique identifier
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Person ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Person retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Person'
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', personController.getPersonById);

/**
 * @swagger
 * /api/persons:
 *   post:
 *     summary: Create a new person
 *     description: Create a new person record in the system
 *     tags: [Persons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonInput'
 *           example:
 *             name: "John"
 *             surname: "Doe"
 *             email: "john.doe@example.com"
 *             phone: "+1234567890"
 *             address: "123 Main St, City, State 12345"
 *     responses:
 *       201:
 *         description: Person created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Person created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Person'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', personController.createPerson);

/**
 * @swagger
 * /api/persons/{id}:
 *   put:
 *     summary: Update an existing person
 *     description: Update an existing person record by ID
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Person ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonInput'
 *           example:
 *             name: "John"
 *             surname: "Smith"
 *             email: "john.smith@example.com"
 *             phone: "+1234567890"
 *             address: "456 Oak St, City, State 12345"
 *     responses:
 *       200:
 *         description: Person updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Person updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Person'
 *       400:
 *         description: Invalid ID format or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', personController.updatePerson);

/**
 * @swagger
 * /api/persons/{id}:
 *   delete:
 *     summary: Delete a person
 *     description: Delete a person record by ID
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Person ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Person deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Person deleted successfully"
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', personController.deletePerson);

/**
 * @swagger
 * /api/persons/search:
 *   get:
 *     summary: Search and filter persons
 *     description: Search persons with advanced filtering and pagination
 *     tags: [Persons]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search in name or surname
 *         example: "John"
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Search in email
 *         example: "john@example.com"
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Search in phone
 *         example: "+1234567890"
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Search in address
 *         example: "Main St"
 *       - in: query
 *         name: createdAfter
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter persons created after this date
 *         example: "2024-01-01"
 *       - in: query
 *         name: createdBefore
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter persons created before this date
 *         example: "2024-12-31"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/PersonsList'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Person'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *                     filters:
 *                       $ref: '#/components/schemas/SearchFilters'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', personController.searchPersons);

/**
 * @swagger
 * /api/persons/incomplete:
 *   get:
 *     summary: Get persons with incomplete profiles
 *     description: Retrieve persons who are missing phone number or address information
 *     tags: [Persons]
 *     responses:
 *       200:
 *         description: Incomplete profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'
 *                 message:
 *                   type: string
 *                   example: "Persons with incomplete profiles (missing phone or address)"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/incomplete', personController.getIncompleteProfiles);

  return router;
};
