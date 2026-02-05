/**
 * PERSON MODEL (Entity Definition)
 *
 * This file is part of the DOMAIN LAYER
 *
 * Responsibility:
 * - Define the Person entity structure and relationships
 * - Represent the business object in the domain
 * - May contain business logic related to the entity itself
 *
 * Domain Model Pattern:
 * - Models represent business entities
 * - They define the structure and constraints
 * - Business logic related to the entity goes here
 * - Data access is handled by repositories
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Person model (Entity)
const Person = sequelize.define('Person', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  surname: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'persons', // Explicit table name
  timestamps: true,     // Enable automatic timestamps
  createdAt: 'created_at',
  updatedAt: 'updated_at',

  // Model-level validation
  validate: {
    // Custom validation: ensure name and surname are not just whitespace
    nameNotWhitespace() {
      if (this.name && this.name.trim() === '') {
        throw new Error('Name cannot be empty or whitespace');
      }
    },
    surnameNotWhitespace() {
      if (this.surname && this.surname.trim() === '') {
        throw new Error('Surname cannot be empty or whitespace');
      }
    }
  }
});

// Instance methods (business logic for individual entities)
Person.prototype.getFullName = function() {
  return `${this.name} ${this.surname}`;
};

Person.prototype.getInitials = function() {
  return `${this.name.charAt(0)}${this.surname.charAt(0)}`.toUpperCase();
};

Person.prototype.isValidEmail = function() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(this.email);
};

module.exports = Person;
