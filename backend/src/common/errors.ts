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
export class BusinessError extends Error {
  public code: string;

  constructor(message: string, code: string = 'BUSINESS_ERROR') {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
  }
}

/**
 * Validation Error - Specific type of business error for validation failures
 */
export class ValidationError extends BusinessError {
  public field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}

/**
 * Not Found Error - For resources that don't exist
 */
export class NotFoundError extends BusinessError {
  public resource: string;
  public identifier?: string | number;

  constructor(resource: string = 'Resource', identifier?: string | number) {
    const message = identifier ? `${resource} with ID ${identifier} not found` : `${resource} not found`;
    super(message, 'NOT_FOUND');
    this.resource = resource;
    this.identifier = identifier;
  }
}

/**
 * Conflict Error - For resource conflicts (duplicates, etc.)
 */
export class ConflictError extends BusinessError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, code);
  }
}

/**
 * Forbidden Error - For authorization/business rule violations
 */
export class ForbiddenError extends BusinessError {
  constructor(message: string, code: string = 'FORBIDDEN') {
    super(message, code);
  }
}