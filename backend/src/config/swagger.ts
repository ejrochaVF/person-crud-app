/**
 * SWAGGER CONFIGURATION
 *
 * This file configures Swagger/OpenAPI documentation for the Person CRUD API
 *
 * Purpose:
 * - Define API metadata and server information
 * - Configure Swagger UI
 * - Generate OpenAPI specification from JSDoc comments
 */

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Person CRUD API',
    version: '1.0.0',
    description: 'A comprehensive REST API for managing person records with full CRUD operations',
    contact: {
      name: 'API Support',
      email: 'support@personcrud.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    },
    {
      url: 'https://api.personcrud.com',
      description: 'Production server'
    }
  ],
  components: {
    schemas: {
      Person: {
        type: 'object',
        required: ['name', 'surname', 'email', 'phone', 'address'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the person',
            example: 1
          },
          name: {
            type: 'string',
            description: 'First name of the person',
            example: 'John',
            minLength: 1,
            maxLength: 100
          },
          surname: {
            type: 'string',
            description: 'Last name of the person',
            example: 'Doe',
            minLength: 1,
            maxLength: 100
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email address (must be unique)',
            example: 'john.doe@example.com'
          },
          phone: {
            type: 'string',
            description: 'Phone number',
            example: '+1234567890'
          },
          address: {
            type: 'string',
            description: 'Physical address',
            example: '123 Main St, City, State 12345'
          },
          displayName: {
            type: 'string',
            description: 'Auto-generated display name (read-only)',
            example: 'JOHN DOE',
            readOnly: true
          },
          businessStatus: {
            type: 'string',
            description: 'Business status (read-only)',
            example: 'active',
            readOnly: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            readOnly: true
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            readOnly: true
          }
        }
      },
      PersonInput: {
        type: 'object',
        required: ['name', 'surname', 'email', 'phone', 'address'],
        properties: {
          name: {
            type: 'string',
            example: 'John',
            minLength: 1,
            maxLength: 100
          },
          surname: {
            type: 'string',
            example: 'Doe',
            minLength: 1,
            maxLength: 100
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com'
          },
          phone: {
            type: 'string',
            example: '+1234567890'
          },
          address: {
            type: 'string',
            example: '123 Main St, City, State 12345'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Error description'
          },
          error: {
            type: 'string',
            example: 'Error code or details'
          }
        }
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Operation completed successfully'
          },
          data: {
            type: 'object',
            description: 'Response data'
          }
        }
      },
      PersonsList: {
        type: 'object',
        properties: {
          count: {
            type: 'integer',
            example: 25
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Person'
            }
          }
        }
      },
      SearchFilters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Filter by name or surname'
          },
          email: {
            type: 'string',
            description: 'Filter by email'
          },
          phone: {
            type: 'string',
            description: 'Filter by phone'
          },
          address: {
            type: 'string',
            description: 'Filter by address'
          },
          createdAfter: {
            type: 'string',
            format: 'date',
            description: 'Filter persons created after this date'
          },
          createdBefore: {
            type: 'string',
            format: 'date',
            description: 'Filter persons created before this date'
          },
          page: {
            type: 'integer',
            minimum: 1,
            default: 1,
            description: 'Page number for pagination'
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
            description: 'Number of items per page'
          }
        }
      }
    },
    securitySchemes: {
      // Add security schemes if you implement authentication later
      // apiKey: {
      //   type: 'apiKey',
      //   name: 'X-API-Key',
      //   in: 'header'
      // }
    }
  },
  security: [
    // Add global security if needed
    // { apiKey: [] }
  ]
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'] // Paths to files containing OpenAPI definitions
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true,
    syntaxHighlight: {
      activate: true,
      theme: 'arta'
    },
    tryItOutEnabled: true,
    requestInterceptor: (req: any) => {
      // Add any request interceptors if needed
      return req;
    },
    responseInterceptor: (res: any) => {
      // Add any response interceptors if needed
      return res;
    }
  }
};

export { swaggerUi, swaggerUiOptions, swaggerSpec };