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

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the Person attributes interface
interface PersonAttributes {
  id: number;
  name: string;
  surname: string;
  email: string;
  address?: string;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Define the Person creation attributes (id is auto-generated)
interface PersonCreationAttributes extends Optional<PersonAttributes, 'id' | 'created_at' | 'updated_at'> {}

// Define the Person model class
class Person extends Model<PersonAttributes, PersonCreationAttributes> implements PersonAttributes {
  public id!: number;
  public name!: string;
  public surname!: string;
  public email!: string;
  public address?: string;
  public phone?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Instance methods (business logic for individual entities)
  public getFullName(): string {
    return `${this.name} ${this.surname}`;
  }

  public getInitials(): string {
    return `${this.name.charAt(0)}${this.surname.charAt(0)}`.toUpperCase();
  }

  public isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}

// Initialize the model
Person.init({
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
  sequelize,
  tableName: 'persons', // Explicit table name
  timestamps: true,     // Enable automatic timestamps
  createdAt: 'created_at',
  updatedAt: 'updated_at',

  // Model-level validation
  validate: {
    // Custom validation: ensure name and surname are not just whitespace
    nameNotWhitespace(this: Person) {
      if (this.name && this.name.trim() === '') {
        throw new Error('Name cannot be empty or whitespace');
      }
    },
    surnameNotWhitespace(this: Person) {
      if (this.surname && this.surname.trim() === '') {
        throw new Error('Surname cannot be empty or whitespace');
      }
    }
  }
});

export default Person;
