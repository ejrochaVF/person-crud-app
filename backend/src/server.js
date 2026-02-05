/**
 * EXPRESS SERVER
 * 
 * This is the entry point of the backend application
 * 
 * Purpose:
 * - Initialize Express application
 * - Configure middleware
 * - Set up routes
 * - Start the server
 * 
 * Key Concepts:
 * - Express: Web framework for Node.js
 * - Middleware: Functions that process requests before they reach routes
 * - CORS: Allows frontend (different port) to communicate with backend
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import DI container (commented out for manual instantiation)
// const container = require('./di/container');

// Import routes factory
const personRoutesFactory = require('./routes/personRoutes');

// Import classes for manual instantiation
const PersonController = require('./controllers/personController');
const PersonService = require('./services/personService');
const PersonRepository = require('./repositories/personRepository');
const Person = require('./models/personModel');

// Initialize Express app
const app = express();

// Middleware Configuration
// ========================

/**
 * CORS (Cross-Origin Resource Sharing)
 * 
 * Why needed:
 * - Frontend runs on http://localhost:3000
 * - Backend runs on http://localhost:5000
 * - Browsers block requests between different origins by default
 * - CORS middleware allows our frontend to make requests to backend
 */
app.use(cors());

/**
 * Body Parser Middleware
 * 
 * Purpose:
 * - Parses incoming JSON request bodies
 * - Makes data available in req.body
 * 
 * Example: When frontend sends { "name": "John" }
 * This middleware allows us to access it as req.body.name
 */
app.use(express.json());

/**
 * URL-encoded Parser
 * 
 * Purpose:
 * - Parses URL-encoded data (form submissions)
 * - extended: true allows for rich objects and arrays
 */
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes Configuration
// ===================

/**
 * API Routes
 * 
 * All person-related routes are prefixed with /api/persons
 * Example: POST /api/persons, GET /api/persons/:id, etc.
 */
const personRepository = new PersonRepository(Person);
const personService = new PersonService(personRepository);
const personController = new PersonController(personService);
const personRoutes = personRoutesFactory(personController);
app.use('/api/persons', personRoutes);

/**
 * Root Route
 * 
 * Simple route to verify server is running
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Person CRUD API is running!',
    version: '1.0.0',
    endpoints: {
      getAllPersons: 'GET /api/persons',
      getPersonById: 'GET /api/persons/:id',
      createPerson: 'POST /api/persons',
      updatePerson: 'PUT /api/persons/:id',
      deletePerson: 'DELETE /api/persons/:id'
    }
  });
});

/**
 * 404 Handler
 * 
 * Catches all requests that don't match any routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

/**
 * Global Error Handler
 * 
 * Catches any errors that occur in the application
 */
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
// ============

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/`);
  console.log('=================================');
});

module.exports = app;
