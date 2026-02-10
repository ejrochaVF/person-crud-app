/**
 * PERSON SERVICE
 *
 * This file is part of the BUSINESS LOGIC TIER
 *
 * Responsibility:
 * - Implement business rules and domain logic
 * - Orchestrate operations across repositories
 * - Handle business validations and transformations
 * - Coordinate complex business workflows
 *
 * Service Layer Pattern:
 * - Contains business logic that doesn't belong in controllers
 * - Controllers become thin HTTP adapters
 * - Services can use multiple repositories
 * - Business rules are centralized here
 */

import { BusinessError, ValidationError, NotFoundError, ConflictError, ForbiddenError } from '../common/errors';

/**
 * Person data interface for type safety
 */
interface PersonData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
}

/**
 * Person Service - Business Logic Layer
 */
export class PersonService {
  private personRepository: any;
  private unitOfWork: any;

  constructor(personRepository: any, unitOfWork: any = null) {
    this.personRepository = personRepository;
    this.unitOfWork = unitOfWork; // Optional - for future complex operations
  }
  /**
   * Validate person data according to business rules
   * This is business logic, not just input validation
   *
   * @param {Object} data - Person data to validate
   * @throws {BusinessError} If validation fails
   */
  validateBusinessRules(data: PersonData) {
    const errors = [];

    // Business Rule: All core fields are required
    if (!data.name || data.name.trim() === '') {
      errors.push('Name is required for business operations');
    }

    if (!data.surname || data.surname.trim() === '') {
      errors.push('Surname is required for business operations');
    }

    if (!data.email || data.email.trim() === '') {
      errors.push('Email is required for business operations');
    } else {
      // Business Rule: Email must be valid format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Email must be in valid format');
      }
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.push('Phone is required for business operations');
    }

    if (!data.address || data.address.trim() === '') {
      errors.push('Address is required for business operations');
    }

    // Business Rule: Name and surname cannot be the same
    if (data.name && data.surname && data.name.trim().toLowerCase() === data.surname.trim().toLowerCase()) {
      errors.push('Name and surname cannot be identical');
    }

    // Business Rule: Email domain restrictions (example)
    if (data.email && data.email.includes('@temp.com')) {
      errors.push('Temporary email domains are not allowed');
    }

    if (errors.length > 0) {
      throw new ValidationError(`Business validation failed: ${errors.join(', ')}`, 'VALIDATION_ERROR');
    }
  }

  /**
   * Check if email is unique (business rule)
   *
   * @param {string} email - Email to check
   * @param {number} excludeId - Optional ID to exclude (for updates)
   * @throws {BusinessError} If email is not unique
   */
  async checkEmailUniqueness(email: string, excludeId: number | null = null) {
    try {
      const exists = await this.personRepository.emailExists(email, excludeId);
      if (exists) {
        throw new ConflictError('Email address must be unique', 'DUPLICATE_EMAIL');
      }
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError('Unable to verify email uniqueness', 'EMAIL_CHECK_ERROR');
    }
  }

  /**
   * Apply business transformations to person data
   *
   * @param {Object} data - Raw person data
   * @returns {Object} Transformed person data
   */
  applyBusinessTransformations(data: PersonData) {
    return {
      ...data,
      // Business Rule: Auto-generate display name
      displayName: `${data.name.trim()} ${data.surname.trim()}`.toUpperCase(),

      // Business Rule: Normalize phone format (remove spaces and special chars)
      phone: data.phone.replace(/[\s\-\(\)]/g, ''),

      // Business Rule: Trim and normalize text fields
      name: data.name.trim(),
      surname: data.surname.trim(),
      email: data.email.trim().toLowerCase(),
      address: data.address.trim(),

      // Business Rule: Add business metadata
      businessStatus: 'active',
      lastModified: new Date()
    };
  }

  /**
   * Create a new person (business workflow)
   *
   * @param {Object} personData - Person data from request
   * @returns {Promise<Object>} Created person
   * @throws {BusinessError} If business rules are violated
   */
  async createPerson(personData: PersonData) {
    // Step 1: Validate business rules (no transaction needed)
    this.validateBusinessRules(personData);

    // Step 2: Apply business transformations (no transaction needed)
    const transformedData = this.applyBusinessTransformations(personData);

    // Step 3: Execute database operations in transaction (if UnitOfWork available), mostyly for usage example of the UoW
    if (this.unitOfWork) {
      return await this.unitOfWork.executeInTransaction(async (work) => {
        // Get repository with transaction context
        const repo = work.getRepository('person', require('../repositories/personRepository'));

        // Check email uniqueness within transaction
        await this.checkEmailUniqueness(personData.email);

        // Create person within transaction
        const createdPerson = await repo.create(transformedData);

        // Log success
        console.log(`Business: New person created with ID ${createdPerson.id} (transactional)`);

        return createdPerson;
      });
    } else {
      // Fallback to non-transactional approach (current implementation)
      try {
        // Step 2: Check business constraints
        await this.checkEmailUniqueness(personData.email);

        // Step 3: Execute business operation
        const createdPerson = await this.personRepository.create(transformedData);

        // Step 4: Post-creation business logic
        console.log(`Business: New person created with ID ${createdPerson.id}`);

        return createdPerson;
      } catch (error) {
        // Re-throw business errors as-is
        if (error instanceof BusinessError) {
          throw error;
        }

        // Wrap technical errors in business context
        throw new BusinessError(`Failed to create person: ${error.message}`, 'CREATION_ERROR');
      }
    }
  }

  /**
   * Update an existing person (business workflow)
   *
   * @param {number} id - Person ID
   * @param {Object} personData - Updated person data
   * @returns {Promise<Object>} Updated person
   * @throws {BusinessError} If business rules are violated
   */
  async updatePerson(id: number, personData: PersonData) {
    try {
      // Step 1: Get current person for business validation
      const existingPerson = await this.personRepository.findById(id);
      if (!existingPerson) {
        throw new NotFoundError('Person', id);
      }

      // Step 2: Validate business rules for update
      this.validateBusinessRules(personData);

      // Step 3: Check email uniqueness (exclude current person)
      if (personData.email !== existingPerson.email) {
        await this.checkEmailUniqueness(personData.email, id);
      }

      // Step 4: Apply business transformations
      const transformedData = this.applyBusinessTransformations(personData);

      // Step 5: Execute business operation
      const updatedPerson = await this.personRepository.update(id, transformedData);

      if (!updatedPerson) {
        throw new BusinessError('Person update failed', 'UPDATE_FAILED');
      }

      // Step 6: Post-update business logic
      console.log(`Business: Person ${id} updated`);

      return updatedPerson;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`Failed to update person: ${error.message}`, 'UPDATE_ERROR');
    }
  }

  /**
   * Delete a person (business workflow)
   *
   * @param {number} id - Person ID
   * @returns {Promise<boolean>} True if deleted
   * @throws {BusinessError} If business rules prevent deletion
   */
  async deletePerson(id: number) {
    try {
      // Business Rule: Check if person can be deleted (example: no dependencies)
      const person = await this.personRepository.findById(id);
      if (!person) {
        throw new NotFoundError('Person', id);
      }

      // Business Rule: Prevent deletion of "system" persons (example)
      if (person.email === 'admin@system.com') {
        throw new ForbiddenError('System persons cannot be deleted', 'SYSTEM_PERSON_PROTECTION');
      }

      // Execute business operation
      const deleted = await this.personRepository.delete(id);

      if (deleted) {
        console.log(`Business: Person ${id} deleted`);
      }

      return deleted;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`Failed to delete person: ${error.message}`, 'DELETE_ERROR');
    }
  }

  /**
   * Get all persons (business operation)
   *
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Persons
   */
  async getAllPersons(options: any = {}) {
    try {
      return await this.personRepository.findAll(options);
    } catch (error) {
      throw new BusinessError(`Failed to retrieve persons: ${error.message}`, 'RETRIEVAL_ERROR');
    }
  }

  /**
   * Get person by ID (business operation)
   *
   * @param {number} id - Person ID
   * @returns {Promise<Object>} Person
   * @throws {BusinessError} If person not found
   */
  async getPersonById(id: number) {
    try {
      const person = await this.personRepository.findById(id);
      if (!person) {
        throw new NotFoundError('Person', id);
      }
      return person;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BusinessError(`Failed to retrieve person: ${error.message}`, 'RETRIEVAL_ERROR');
    }
  }

  /**
   * Search persons with business rules applied
   *
   * @param {Object} filters - Search filters
   * @param {Object} options - Search options
   * @returns {Promise<Array|Object>} Search results
   */
  async searchPersons(filters: any, options: any = {}) {
    try {
      // Business Rule: Apply search restrictions if needed
      // For example, limit search results for performance
      if (options.limit && options.limit > 100) {
        options.limit = 100; // Business rule: max 100 results
      }

      return await this.personRepository.searchPersons(filters, options);
    } catch (error) {
      throw new BusinessError(`Search failed: ${error.message}`, 'SEARCH_ERROR');
    }
  }

  /**
   * Get persons with incomplete profiles (business operation)
   *
   * @returns {Promise<Array>} Incomplete profiles
   */
  async getIncompleteProfiles() {
    try {
      return await this.personRepository.findIncompleteProfiles();
    } catch (error) {
      throw new BusinessError(`Failed to get incomplete profiles: ${error.message}`, 'INCOMPLETE_PROFILES_ERROR');
    }
  }

  /**
   * Get person statistics (business analytics)
   *
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    try {
      return await this.personRepository.getStatistics();
    } catch (error) {
      throw new BusinessError(`Failed to get statistics: ${error.message}`, 'STATISTICS_ERROR');
    }
  }
}