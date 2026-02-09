/**
 * APPLICATION CONFIGURATION
 *
 * Central configuration for the application
 * Uses environment variables for different environments
 */

interface Config {
  api: {
    baseURL: string;
    endpoints: {
      persons: string;
    };
    timeout: number;
    personsURL?: string;
  };
  app: {
    name: string;
    version: string;
    environment: string;
  };
  features: {
    optimisticUpdates: boolean;
    retryOnFailure: boolean;
    errorBoundary: boolean;
  };
  ui: {
    defaultLoadingMessage: string;
    successMessageDuration: number;
    retryAttempts: number;
    retryDelay: number;
  };
}

const config: Config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    endpoints: {
      persons: '/api/persons'
    },
    timeout: 10000, // 10 seconds
  },

  // Application Settings
  app: {
    name: process.env.REACT_APP_APP_NAME || 'Person CRUD Application',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  },

  // Feature Flags
  features: {
    optimisticUpdates: true,
    retryOnFailure: true,
    errorBoundary: true,
  },

  // UI Settings
  ui: {
    defaultLoadingMessage: 'Loading...',
    successMessageDuration: 3000, // ms
    retryAttempts: 2,
    retryDelay: 1000, // ms
  }
};

// Build full API URLs
config.api.personsURL = `${config.api.baseURL}${config.api.endpoints.persons}`;

export default config;