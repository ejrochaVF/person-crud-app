/**
 * UNIT OF WORK
 *
 * Manages transactions across multiple repositories
 * Ensures atomic operations and data consistency
 *
 * Unit of Work Pattern:
 * - Coordinates multiple repository operations
 * - Manages database transactions
 * - Ensures data integrity across operations
 */

const sequelize = require('../config/database');

class UnitOfWork {
  constructor() {
    this.transaction = null;
    this.repositories = {};
  }

  /**
   * Start a new transaction
   * @returns {Promise<void>}
   */
  async beginTransaction() {
    this.transaction = await sequelize.transaction();
  }

  /**
   * Commit the current transaction
   * @returns {Promise<void>}
   */
  async commit() {
    if (this.transaction) {
      await this.transaction.commit();
      this.transaction = null;
    }
  }

  /**
   * Rollback the current transaction
   * @returns {Promise<void>}
   */
  async rollback() {
    if (this.transaction) {
      await this.transaction.rollback();
      this.transaction = null;
    }
  }

  /**
   * Execute a function within a transaction
   * Automatically commits on success, rolls back on error
   *
   * @param {Function} operation - Function to execute within transaction
   * @returns {Promise<any>} Result of the operation
   * 
   * Usage example:
   * 
   * await uow.executeInTransaction(async (work) => {
   *     const userRepo = work.getRepository('users', UserRepository);
   *     const orderRepo = work.getRepository('orders', OrderRepository);
   *
   *     const user = await userRepo.create({ name: 'John' });
   *     await orderRepo.create({ userId: user.id, total: 100 });
   * });
   */
  async executeInTransaction(operation) {
    try {
      await this.beginTransaction();
      const result = await operation(this);
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  /**
   * Get a repository instance with transaction context
   *
   * @param {string} repositoryName - Name of the repository
   * @param {BaseRepository} RepositoryClass - Repository class
   * @returns {BaseRepository} Repository instance with transaction
   */
  getRepository(repositoryName, RepositoryClass) {
    if (!this.repositories[repositoryName]) {
      this.repositories[repositoryName] = new RepositoryClass();
      // Inject transaction into repository if it supports it
      if (this.transaction && this.repositories[repositoryName].setTransaction) {
        this.repositories[repositoryName].setTransaction(this.transaction);
      }
    }
    return this.repositories[repositoryName];
  }
}

module.exports = UnitOfWork;