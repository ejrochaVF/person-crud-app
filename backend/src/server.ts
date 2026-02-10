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

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes factory
import personRoutesFactory from './routes/personRoutes';

// Import classes for manual instantiation
// const { PersonController } = require('./controllers/personController');
import { PersonService } from './services/personService';
import { PersonController } from './controllers/personController';
import PersonRepository from './repositories/personRepository';
import Person from './models/personModel';

// Initialize Express app
const app: Application = express();
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
const allowedOrigins: string[] = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin: string) => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: process.env.CORS_CREDENTIALS === 'true'
}));

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
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes Configuration
// ===================

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
app.get('/', (req: Request, res: Response) => {
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
app.use((req: Request, res: Response) => {
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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
// ============

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/`);
  console.log('=================================');
});

export default app;
