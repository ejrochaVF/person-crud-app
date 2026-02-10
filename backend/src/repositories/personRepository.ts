/**
 * PERSON REPOSITORY
 *
 * This file is part of the DATA ACCESS TIER
 *
 * Responsibility:
 * - Handle Person-specific database operations
 * - Extend BaseRepository for common CRUD operations
 * - Provide specialized queries for Person entity
 *
 * Repository Pattern with Inheritance:
 * - Inherits common CRUD from BaseRepository
 * - Adds Person-specific methods and customizations
 * - Overrides error handling for Person-specific constraints
 */

import BaseRepository from './baseRepository';
import { Model } from 'sequelize';

interface PersonData {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  address?: string;
  displayName?: string;
}

interface SearchFilters {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

interface SearchOptions {
  order?: any[][];
  page?: number;
  limit?: number;
}

interface PaginationResult {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface PersonStatistics {
  totalPersons: number;
  withPhone: number;
  withAddress: number;
  avgNameLength: string;
}

class PersonRepository extends BaseRepository {
  constructor(PersonModel: any) {
    super(PersonModel); // Pass the injected Person model to the base class
  }

  /**
   * Handle unique constraint errors specific to Person
   * Overrides base class method for Person-specific error messages
   *
   * @param {Error} error - Database error
   */
  handleUniqueConstraintError(error: Error): void {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const duplicateError = new Error('Email already exists') as any;
      duplicateError.code = 'DUPLICATE_EMAIL';
      throw duplicateError;
    }
    // Call parent method for other errors
    super.handleUniqueConstraintError(error);
  }

  /**
   * Override findAll to order by name instead of created_at
   * Demonstrates method overriding in inheritance
   *
   * @param {Object} options - Sequelize find options
   * @returns {Promise<Array>} Array of person records ordered by name
   */
  async findAll(options: any = {}): Promise<any[]> {
    try {
      // Merge options with our custom ordering
      const customOptions = {
        order: [
          ['name', 'ASC'],      // Primary: Order by name alphabetically
          ['surname', 'ASC']    // Secondary: Then by surname
        ],
        ...options  // Allow overriding via options parameter
      };

      // Call the parent method with our custom options
      return await super.findAll(customOptions);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Alternative: Override create to add Person-specific logic
   * For example: Auto-generate a display name
   *
   * @param {Object} personData - Person data to create
   * @returns {Promise<Object>} Created person object
   */
  async create(personData: PersonData): Promise<any> {
    try {
      // Add custom logic before calling parent
      const dataWithDisplayName = {
        ...personData,
        displayName: `${personData.name} ${personData.surname}`.toUpperCase()
      };

      // Call parent create method
      return await super.create(dataWithDisplayName);
    } catch (error) {
      // Custom error handling for Person creation
      if (error.message.includes('displayName')) {
        const customError = new Error('Invalid person data') as any;
        customError.code = 'PERSON_VALIDATION_ERROR';
        throw customError;
      }
      throw error;
    }
  }

  /**
   * Override update to add audit logging
   *
   * @param {number} id - Person ID to update
   * @param {Object} personData - Updated person data
   * @returns {Promise<Object|null>} Updated person or null if not found
   */
  async update(id: number, personData: Partial<PersonData>): Promise<any | null> {
    try {
      // Get the original person for audit logging
      const originalPerson = await this.findById(id);
      if (!originalPerson) {
        return null;
      }

      // Log the changes (in a real app, you'd save this to a log table)
      console.log(`Updating person ${id}:`, {
        from: originalPerson,
        to: personData,
        timestamp: new Date()
      });

      // Call parent update method
      const updatedPerson = await super.update(id, personData);

      // Additional logic after update
      if (updatedPerson && personData.email !== originalPerson.email) {
        console.log(`Email changed for person ${id} from ${originalPerson.email} to ${personData.email}`);
        // Could send verification email here
      }

      return updatedPerson;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if email exists (useful for validation)
   * Person-specific method for email uniqueness validation
   *
   * @param {string} email - Email to check
   * @param {number} excludeId - Optional ID to exclude (for updates)
   * @returns {Promise<boolean>} True if email exists
   */
  async emailExists(email: string, excludeId: number | null = null): Promise<boolean> {
    try {
      const { Op } = require('sequelize');

      const whereClause: any = { email };
      if (excludeId) {
        whereClause.id = { [Op.ne]: excludeId };
      }

      return await this.exists(whereClause);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find persons by name (search functionality)
   * Person-specific search method
   *
   * @param {string} searchTerm - Search term for name or surname
   * @returns {Promise<Array>} Array of matching person objects
   */
  async findByName(searchTerm: string): Promise<any[]> {
    try {
      const { Op } = require('sequelize');

      return await this.findBy({
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { surname: { [Op.like]: `%${searchTerm}%` } }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get persons with full name (includes computed field)
   * Demonstrates how to include model instance methods in queries
   *
   * @returns {Promise<Array>} Array of persons with full names
   */
  async findAllWithFullNames(): Promise<any[]> {
    try {
      const persons = await this.model.findAll({
        order: [['created_at', 'DESC']]
      });

      // Add computed fullName to each person
      return persons.map(person => ({
        ...person.toJSON(),
        fullName: person.getFullName()
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk create persons (for seeding or imports)
   * Person-specific bulk operation with validation
   *
   * @param {Array} personsData - Array of person data objects
   * @returns {Promise<Array>} Array of created persons
   */
  async bulkCreate(personsData: PersonData[]): Promise<any[]> {
    try {
      const persons = await this.model.bulkCreate(personsData, {
        validate: true, // Run validations
        returning: true // Return created records
      });
      return persons.map(person => person.toJSON());
    } catch (error) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  /**
   * Advanced search and filtering for persons
   * Builds Sequelize where clauses directly for flexible querying
   *
   * @param {Object} filters - Search filters
   * @param {string} filters.name - Search in name or surname
   * @param {string} filters.email - Exact email match
   * @param {string} filters.phone - Phone number search
   * @param {string} filters.address - Address search
   * @param {Date} filters.createdAfter - Created after date
   * @param {Date} filters.createdBefore - Created before date
   * @param {Object} options - Additional options (pagination, sorting)
   * @returns {Promise<Array|Object>} Search results or paginated results
   */
  async searchPersons(filters: SearchFilters = {}, options: SearchOptions = {}): Promise<any[] | PaginationResult> {
    try {
      const { Op } = require('sequelize');
      const whereConditions: any[] = [];

      // Build where conditions based on filters
      if (filters.name) {
        whereConditions.push({
          [Op.or]: [
            { name: { [Op.iLike]: `%${filters.name}%` } },
            { surname: { [Op.iLike]: `%${filters.name}%` } }
          ]
        });
      }

      if (filters.email) {
        whereConditions.push({
          email: { [Op.iLike]: `%${filters.email}%` }
        });
      }

      if (filters.phone) {
        whereConditions.push({
          phone: { [Op.like]: `%${filters.phone}%` }
        });
      }

      if (filters.address) {
        whereConditions.push({
          address: { [Op.iLike]: `%${filters.address}%` }
        });
      }

      if (filters.createdAfter) {
        whereConditions.push({
          created_at: { [Op.gte]: new Date(filters.createdAfter) }
        });
      }

      if (filters.createdBefore) {
        whereConditions.push({
          created_at: { [Op.lte]: new Date(filters.createdBefore) }
        });
      }

      // Combine all conditions with AND
      const where = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

      // Set default ordering
      const order = options.order || [['name', 'ASC'], ['surname', 'ASC']];

      // Check if pagination is requested
      if (options.page && options.limit) {
        const page = parseInt(options.page.toString()) || 1;
        const limit = parseInt(options.limit.toString()) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await this.model.findAndCountAll({
          where,
          order,
          limit,
          offset,
          ...this.getTransactionOptions()
        });

        return {
          data: rows.map(record => record.toJSON()),
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
            hasNext: page * limit < count,
            hasPrev: page > 1
          }
        };
      }

      // Return filtered results without pagination
      const records = await this.model.findAll({
        where,
        order,
        ...this.getTransactionOptions()
      });

      return records.map(record => record.toJSON());
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find persons with incomplete profiles
   * Persons missing phone or address
   *
   * @returns {Promise<Array>} Persons with incomplete profiles
   */
  async findIncompleteProfiles(): Promise<any[]> {
    try {
      const { Op } = require('sequelize');

      const records = await this.model.findAll({
        where: {
          [Op.or]: [
            { phone: null },
            { phone: '' },
            { address: null },
            { address: '' }
          ]
        },
        order: [['name', 'ASC'], ['surname', 'ASC']]
      });

      return records.map(record => record.toJSON());
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get person statistics
   * Person-specific analytics method
   *
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics(): Promise<PersonStatistics> {
    try {
      const sequelize = require('../config/database');

      const [results] = await sequelize.query(`
        SELECT
          COUNT(*) as totalPersons,
          COUNT(CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 END) as withPhone,
          COUNT(CASE WHEN address IS NOT NULL AND address != '' THEN 1 END) as withAddress,
          AVG(LENGTH(name) + LENGTH(surname)) as avgNameLength
        FROM persons
      `, { type: sequelize.QueryTypes.SELECT });

      return {
        totalPersons: parseInt(results.totalPersons),
        withPhone: parseInt(results.withPhone),
        withAddress: parseInt(results.withAddress),
        avgNameLength: parseFloat(results.avgNameLength || 0).toFixed(2)
      };
    } catch (error) {
      throw error;
    }
  }
}

export default PersonRepository;