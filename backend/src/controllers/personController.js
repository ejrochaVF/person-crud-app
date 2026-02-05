/**
 * PERSON CONTROLLER
 *
 * This file is part of the PRESENTATION TIER (HTTP Layer)
 *
 * Responsibility:
 * - Handle HTTP requests and responses for Person operations
 * - Parse request data and format responses
 * - Handle HTTP-specific concerns (status codes, headers)
 * - Translate between HTTP and business logic
 *
 * Controller Pattern (Thin Controllers):
 * - Extends BaseController for common HTTP functionality
 * - Focuses on Person-specific HTTP concerns
 * - Business logic is delegated to services
 * - Error handling is managed by base controller
 */

const { BaseController } = require('./baseController');

class PersonController extends BaseController {
  constructor(personService) {
    super();
    this.personService = personService;
  }
  /**
   * GET /api/persons
   * Get all persons
   */
  getAllPersons = async (req, res) => {
    return this.executeAction(async () => {
      const options = req.query;
      const persons = await this.personService.getAllPersons(options);

      this.sendSuccess(res, {
        count: persons.length,
        data: persons
      });
    }, res);
  };

  /**
   * GET /api/persons/:id
   * Get a single person by ID
   */
  getPersonById = async (req, res) => {
    return this.executeAction(async () => {
      const { id } = req.params;

      // HTTP validation
      const personId = this.validateId(id);
      if (!personId) {
        return this.sendError(res, 'Invalid person ID format', 400);
      }

      const person = await this.personService.getPersonById(personId);
      this.sendSuccess(res, { data: person });
    }, res);
  };

  /**
   * POST /api/persons
   * Create a new person
   */
  createPerson = async (req, res) => {
    return this.executeAction(async () => {
      const rawData = req.body;

      // HTTP layer: Basic input sanitization
      const personData = this.sanitizeInput(rawData);

      // Business logic delegated to service
      const newPerson = await this.personService.createPerson(personData);

      this.sendSuccess(res, {
        message: 'Person created successfully',
        data: newPerson
      }, 201);
    }, res);
  };

  /**
   * PUT /api/persons/:id
   * Update an existing person
   */
  updatePerson = async (req, res) => {
    return this.executeAction(async () => {
      const { id } = req.params;
      const rawData = req.body;

      // HTTP validation
      const personId = this.validateId(id);
      if (!personId) {
        return this.sendError(res, 'Invalid person ID format', 400);
      }

      // HTTP layer: Basic input sanitization
      const personData = this.sanitizeInput(rawData);

      // Business logic delegated to service
      const updatedPerson = await this.personService.updatePerson(personId, personData);

      this.sendSuccess(res, {
        message: 'Person updated successfully',
        data: updatedPerson
      });
    }, res);
  };

  /**
   * DELETE /api/persons/:id
   * Delete a person
   */
  deletePerson = async (req, res) => {
    return this.executeAction(async () => {
      const { id } = req.params;

      // HTTP validation
      const personId = this.validateId(id);
      if (!personId) {
        return this.sendError(res, 'Invalid person ID format', 400);
      }

      // Business logic delegated to service
      const deleted = await this.personService.deletePerson(personId);

      if (!deleted) {
        return this.sendError(res, 'Person not found', 404);
      }

      this.sendSuccess(res, {
        message: 'Person deleted successfully'
      });
    }, res);
  };

  /**
   * GET /api/persons/search
   * Search and filter persons
   */
  searchPersons = async (req, res) => {
    return this.executeAction(async () => {
      const filters = {};
      const options = {};

      // Parse query parameters (HTTP layer concern)
      const { name, email, phone, address, createdAfter, createdBefore, page, limit } = req.query;

      if (name) filters.name = name;
      if (email) filters.email = email;
      if (phone) filters.phone = phone;
      if (address) filters.address = address;
      if (createdAfter) filters.createdAfter = createdAfter;
      if (createdBefore) filters.createdBefore = createdBefore;

      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      // Business logic delegated to service
      const results = await this.personService.searchPersons(filters, options);

      // Format response based on result type
      if (results.pagination) {
        return this.sendSuccess(res, {
          data: results.data,
          pagination: results.pagination,
          filters: filters
        });
      }

      this.sendSuccess(res, {
        count: results.length,
        data: results,
        filters: filters
      });
    }, res);
  };

  /**
   * GET /api/persons/incomplete
   * Get persons with incomplete profiles
   */
  getIncompleteProfiles = async (req, res) => {
    return this.executeAction(async () => {
      const persons = await this.personService.getIncompleteProfiles();

      this.sendSuccess(res, {
        count: persons.length,
        data: persons,
        message: 'Persons with incomplete profiles (missing phone or address)'
      });
    }, res);
  };
}

module.exports = PersonController;
