/**
 * COMMON ERRORS
 *
 * This module contains shared error classes used across the application.
 * These are generic errors that can be used by any service or controller
 * without creating tight coupling.
 */

/**
 * Business Error - Represents business logic violations
 * Used by services to indicate business rule violations
 * Controllers can catch these and convert to appropriate HTTP responses
 */
class BusinessError extends Error {
  constructor(message, code = 'BUSINESS_ERROR') {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
  }
}

/**
 * Validation Error - Specific type of business error for validation failures
 */
class ValidationError extends BusinessError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}

/**
 * Not Found Error - For resources that don't exist
 */
class NotFoundError extends BusinessError {
  constructor(resource = 'Resource', identifier = null) {
    const message = identifier ? `${resource} with ID ${identifier} not found` : `${resource} not found`;
    super(message, 'NOT_FOUND');
    this.resource = resource;
    this.identifier = identifier;
  }
}

/**
 * Conflict Error - For resource conflicts (duplicates, etc.)
 */
class ConflictError extends BusinessError {
  constructor(message, code = 'CONFLICT') {
    super(message, code);
  }
}

/**
 * Forbidden Error - For authorization/business rule violations
 */
class ForbiddenError extends BusinessError {
  constructor(message, code = 'FORBIDDEN') {
    super(message, code);
  }
}

module.exports = {
  BusinessError,
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError
};