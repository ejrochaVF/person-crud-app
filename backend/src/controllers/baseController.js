/**
 * BASE CONTROLLER
 *
 * This file provides common functionality for all controllers
 * in the HTTP layer. It handles shared concerns like input sanitization,
 * error handling, and HTTP utilities.
 *
 * Base Controller Pattern:
 * - Contains common HTTP layer logic
 * - Specific controllers extend this base
 * - Promotes code reuse and consistency
 * - Handles cross-cutting HTTP concerns
 */

const { BusinessError, ValidationError, NotFoundError, ConflictError, ForbiddenError } = require('../common/errors');

/**
 * Sanitize input data (HTTP layer concern)
 * Basic input cleaning, not business validation
 *
 * @param {Object} data - Raw input data
 * @returns {Object} Sanitized data
 */
const sanitizeInput = (data) => {
  if (!data || typeof data !== 'object') return {};

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Handle business errors and convert to HTTP responses
 *
 * @param {Error} error - Error from service layer
 * @param {Object} res - Express response object
 */
const handleBusinessError = (error, res) => {
  if (error instanceof ValidationError) {
    // Validation errors -> HTTP 400 (Bad Request)
    return res.status(400).json({
      success: false,
      message: error.message,
      code: error.code,
      field: error.field,
      errors: error.message.includes(':') ? error.message.split(': ')[1]?.split(', ') : [error.message]
    });
  }

  if (error instanceof NotFoundError) {
    // Not found errors -> HTTP 404 (Not Found)
    return res.status(404).json({
      success: false,
      message: error.message,
      code: error.code,
      resource: error.resource,
      identifier: error.identifier
    });
  }

  if (error instanceof ConflictError) {
    // Conflict errors -> HTTP 409 (Conflict)
    return res.status(409).json({
      success: false,
      message: error.message,
      code: error.code
    });
  }

  if (error instanceof ForbiddenError) {
    // Forbidden errors -> HTTP 403 (Forbidden)
    return res.status(403).json({
      success: false,
      message: error.message,
      code: error.code
    });
  }

  if (error instanceof BusinessError) {
    // Generic business errors -> HTTP status based on error code
    const statusCode = getHttpStatusForBusinessError(error.code);
    return res.status(statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      errors: error.message.includes(':') ? error.message.split(': ')[1]?.split(', ') : [error.message]
    });
  }

  // Technical errors -> HTTP 500 (Internal Server Error)
  console.error('Controller error:', error);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

/**
 * Map business error codes to HTTP status codes
 *
 * @param {string} errorCode - Business error code
 * @returns {number} HTTP status code
 */
const getHttpStatusForBusinessError = (errorCode) => {
  const statusMap = {
    'VALIDATION_ERROR': 400,
    'DUPLICATE_EMAIL': 409,
    'NOT_FOUND': 404,
    'PERSON_NOT_FOUND': 404,
    'SYSTEM_PERSON_PROTECTION': 403,
    'FORBIDDEN': 403,
    'CONFLICT': 409,
    'CREATION_ERROR': 500,
    'UPDATE_ERROR': 500,
    'DELETE_ERROR': 500,
    'RETRIEVAL_ERROR': 500,
    'SEARCH_ERROR': 500,
    'INCOMPLETE_PROFILES_ERROR': 500,
    'STATISTICS_ERROR': 500
  };

  return statusMap[errorCode] || 400;
};

/**
 * Validate and parse ID parameter
 *
 * @param {string} id - ID parameter from request
 * @returns {number|null} Parsed ID or null if invalid
 */
const validateIdParameter = (id) => {
  const parsedId = parseInt(id);
  return isNaN(parsedId) ? null : parsedId;
};

/**
 * Send success response
 *
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccessResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    ...data
  });
};

/**
 * Send error response
 *
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} code - Error code
 */
const sendErrorResponse = (res, message, statusCode = 400, code = null) => {
  const response = {
    success: false,
    message
  };

  if (code) {
    response.code = code;
  }

  res.status(statusCode).json(response);
};

class BaseController {
  /**
   * Execute controller action with error handling
   *
   * @param {Function} action - Async controller action function
   * @param {Object} res - Express response object
   * @returns {Promise} Result of the action
   */
  async executeAction(action, res) {
    try {
      return await action();
    } catch (error) {
      handleBusinessError(error, res);
    }
  }

  /**
   * Sanitize input data
   *
   * @param {Object} data - Raw input data
   * @returns {Object} Sanitized data
   */
  sanitizeInput(data) {
    return sanitizeInput(data);
  }

  /**
   * Validate ID parameter
   *
   * @param {string} id - ID parameter
   * @returns {number|null} Validated ID or null
   */
  validateId(id) {
    return validateIdParameter(id);
  }

  /**
   * Send success response
   *
   * @param {Object} res - Express response object
   * @param {Object} data - Response data
   * @param {number} statusCode - HTTP status code
   */
  sendSuccess(res, data, statusCode = 200) {
    sendSuccessResponse(res, data, statusCode);
  }

  /**
   * Send error response
   *
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Error code
   */
  sendError(res, message, statusCode = 400, code = null) {
    sendErrorResponse(res, message, statusCode, code);
  }

  /**
   * Handle business error
   *
   * @param {Error} error - Business error
   * @param {Object} res - Express response object
   */
  handleError(error, res) {
    handleBusinessError(error, res);
  }
}

module.exports = {
  BaseController,
  sanitizeInput,
  handleBusinessError,
  getHttpStatusForBusinessError,
  validateIdParameter,
  sendSuccessResponse,
  sendErrorResponse
};