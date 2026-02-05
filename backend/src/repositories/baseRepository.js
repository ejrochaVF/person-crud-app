/**
 * BASE REPOSITORY
 *
 * This file is part of the DATA ACCESS TIER
 *
 * Responsibility:
 * - Provide common CRUD operations for all entities
 * - Abstract repetitive database operations
 * - Ensure consistent error handling across repositories
 *
 * Base Repository Pattern:
 * - Contains generic CRUD methods that work with any Sequelize model
 * - Specific repositories extend this base for entity-specific operations
 * - Promotes code reuse and consistency
 */

const cacheManager = require('./cacheManager');

class BaseRepository {
  constructor(model) {
    this.model = model;
    this.transaction = null;
    this.cacheEnabled = true; // Enable caching by default
    this.cacheTTL = 300000; // 5 minutes
  }

  /**
   * Set transaction for this repository instance
   * Used by Unit of Work pattern
   *
   * @param {Object} transaction - Sequelize transaction object
   */
  setTransaction(transaction) {
    this.transaction = transaction;
  }

  /**
   * Get transaction options for Sequelize queries
   * @returns {Object} Transaction options
   */
  getTransactionOptions() {
    return this.transaction ? { transaction: this.transaction } : {};
  }

  /**
   * Find all records
   *
   * @param {Object} options - Sequelize find options
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    try {
      // Try cache first
      if (this.cacheEnabled) {
        const cacheKey = cacheManager.generateKey(`${this.model.name}:findAll`, options);
        const cachedResult = cacheManager.get(cacheKey);
        if (cachedResult) {
          return cachedResult;
        }
      }

      const defaultOptions = {
        order: [['created_at', 'DESC']],
        ...options,
        ...this.getTransactionOptions()
      };

      const records = await this.model.findAll(defaultOptions);
      const result = records.map(record => record.toJSON());

      // Cache the result
      if (this.cacheEnabled) {
        const cacheKey = cacheManager.generateKey(`${this.model.name}:findAll`, options);
        cacheManager.set(cacheKey, result, this.cacheTTL);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a record by primary key
   *
   * @param {number|string} id - Primary key value
   * @param {Object} options - Additional find options
   * @returns {Promise<Object|null>} Record or null if not found
   */
  async findById(id, options = {}) {
    try {
      // Try cache first
      if (this.cacheEnabled) {
        const cacheKey = cacheManager.generateKey(`${this.model.name}:findById`, { id, ...options });
        const cachedResult = cacheManager.get(cacheKey);
        if (cachedResult !== null) { // Cache can store null for "not found"
          return cachedResult;
        }
      }

      const record = await this.model.findByPk(id, {
        ...options,
        ...this.getTransactionOptions()
      });
      const result = record ? record.toJSON() : null;

      // Cache the result (including null for "not found")
      if (this.cacheEnabled) {
        const cacheKey = cacheManager.generateKey(`${this.model.name}:findById`, { id, ...options });
        cacheManager.set(cacheKey, result, this.cacheTTL);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find one record by conditions
   *
   * @param {Object} where - Where conditions
   * @param {Object} options - Additional find options
   * @returns {Promise<Object|null>} Record or null if not found
   */
  async findOne(where, options = {}) {
    try {
      const record = await this.model.findOne({
        where,
        ...options
      });
      return record ? record.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find records by conditions
   *
   * @param {Object} where - Where conditions
   * @param {Object} options - Additional find options
   * @returns {Promise<Array>} Array of records
   */
  async findBy(where, options = {}) {
    try {
      const records = await this.model.findAll({
        where,
        order: [['created_at', 'DESC']],
        ...options
      });
      return records.map(record => record.toJSON());
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new record
   *
   * @param {Object} data - Data to create
   * @returns {Promise<Object>} Created record
   */
  async create(data) {
    try {
      const record = await this.model.create(data, this.getTransactionOptions());
      const result = record.toJSON();

      // Invalidate related caches
      if (this.cacheEnabled) {
        this.invalidateCache();
      }

      return result;
    } catch (error) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  /**
   * Update a record by ID
   *
   * @param {number|string} id - Record ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object|null>} Updated record or null if not found
   */
  async update(id, data) {
    try {
      const [affectedRows] = await this.model.update(data, {
        where: { id }
      });

      if (affectedRows === 0) {
        return null; // Record not found
      }

      // Fetch and return the updated record
      const updatedRecord = await this.model.findByPk(id);
      return updatedRecord ? updatedRecord.toJSON() : null;
    } catch (error) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  /**
   * Delete a record by ID
   *
   * @param {number|string} id - Record ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    try {
      const deletedRows = await this.model.destroy({
        where: { id }
      });
      return deletedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count records by conditions
   *
   * @param {Object} where - Where conditions
   * @returns {Promise<number>} Count of records
   */
  async count(where = {}) {
    try {
      return await this.model.count({ where });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if record exists by conditions
   *
   * @param {Object} where - Where conditions
   * @returns {Promise<boolean>} True if exists
   */
  async exists(where) {
    try {
      const count = await this.count(where);
      return count > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Invalidate all caches related to this model
   * Called after create, update, delete operations
   */
  invalidateCache() {
    if (this.cacheEnabled) {
      // Invalidate all cache entries for this model
      cacheManager.deleteByPattern(`${this.model.name}:*`);
    }
  }

  /**
   * Handle unique constraint errors
   * Override in child classes for specific error messages
   *
   * @param {Error} error - Database error
   */
  handleUniqueConstraintError(error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = Object.keys(error.fields)[0];
      const duplicateError = new Error(`${field} already exists`);
      duplicateError.code = 'DUPLICATE_ENTRY';
      throw duplicateError;
    }
  }

  /**
   * Execute raw SQL query (use sparingly)
   *
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query results
   */
  async query(sql, params = []) {
    try {
      const sequelize = require('../config/database');
      const [results] = await sequelize.query(sql, {
        replacements: params,
        type: sequelize.QueryTypes.SELECT
      });
      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Paginate results
   *
   * @param {Object} options - Pagination options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.limit - Items per page
   * @param {Object} options.where - Where conditions
   * @param {Object} options.order - Order conditions
   * @returns {Promise<Object>} Paginated results with metadata
   */
  async paginate({ page = 1, limit = 10, where = {}, order = [['created_at', 'DESC']] }) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await this.model.findAndCountAll({
        where,
        order,
        limit,
        offset
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
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BaseRepository;