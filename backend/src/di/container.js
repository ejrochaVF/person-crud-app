/**
 * DEPENDENCY INJECTION CONTAINER
 *
 * This file sets up the dependency injection container using Awilix
 * to manage dependencies across the application layers.
 */

const { createContainer, asClass, asFunction, asValue } = require('awilix');

// Import all dependencies
const sequelize = require('../config/database');
const Person = require('../models/personModel');

// Repositories
const BaseRepository = require('../repositories/baseRepository');
const PersonRepository = require('../repositories/personRepository');

// Services
const PersonService = require('../services/personService');

// Controllers
const PersonController = require('../controllers/personController');

// Unit of Work (optional - for future complex operations)
const UnitOfWork = require('../repositories/unitOfWork');

// Create the container
const container = createContainer();

// Register values (singletons)
container.register({
  sequelize: asValue(sequelize),
  PersonModel: asValue(Person),
});

// Register repositories with injected models
container.register({
  baseRepository: asFunction((model) => new BaseRepository(model)).singleton(),
  personRepository: asClass(PersonRepository).singleton(),
});

// Register services with injected repositories
container.register({
  personService: asClass(PersonService).singleton(),
  unitOfWork: asClass(UnitOfWork).scoped(), // Scoped for per-request transactions
});

// Register controllers with injected services
container.register({
  personController: asClass(PersonController).scoped(),
});

module.exports = container;