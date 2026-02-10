/**
 * DATABASE CONFIGURATION WITH SEQUELIZE
 *
 * This file is part of the DATA ACCESS TIER
 *
 * Purpose:
 * - Establishes connection to MySQL database using Sequelize ORM
 * - Defines database models
 * - Exports the Sequelize instance and models
 *
 * Key Concepts:
 * - Sequelize ORM: Object-Relational Mapping for Node.js
 * - Models: Represent database tables as JavaScript classes
 * - This provides a higher-level abstraction over raw SQL
 */

import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully with Sequelize');
  })
  .catch((err: Error) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

export default sequelize;
