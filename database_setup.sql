-- ====================================================================
-- PERSON CRUD DATABASE SETUP
-- ====================================================================
-- This SQL script creates the database and table for the Person CRUD application
-- Run this in MySQL Workbench, command line, or any MySQL client

-- ====================================================================
-- STEP 1: CREATE DATABASE
-- ====================================================================

-- Drop database if it exists (CAREFUL: This deletes all data!)
-- Comment out this line if you want to keep existing data
DROP DATABASE IF EXISTS person_crud_db;

-- Create new database
CREATE DATABASE person_crud_db;

-- Select the database to use
USE person_crud_db;

-- ====================================================================
-- STEP 2: CREATE PERSONS TABLE
-- ====================================================================

CREATE TABLE persons (
  -- Primary Key (Auto-incrementing ID)
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Person Details
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,  -- UNIQUE constraint prevents duplicate emails
  address VARCHAR(255),
  phone VARCHAR(20),
  
  -- Timestamps (automatically managed by MySQL)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================================================================
-- STEP 3: INSERT SAMPLE DATA (Optional)
-- ====================================================================

INSERT INTO persons (name, surname, email, address, phone) VALUES
('John', 'Doe', 'john.doe@email.com', '123 Main Street, Springfield', '555-0101'),
('Jane', 'Smith', 'jane.smith@email.com', '456 Oak Avenue, Riverside', '555-0102'),
('Bob', 'Johnson', 'bob.johnson@email.com', '789 Pine Road, Lakeside', '555-0103'),
('Alice', 'Williams', 'alice.williams@email.com', '321 Elm Street, Hilltown', '555-0104'),
('Charlie', 'Brown', 'charlie.brown@email.com', '654 Maple Drive, Meadowview', '555-0105');

-- ====================================================================
-- STEP 4: VERIFY DATA
-- ====================================================================

-- View all persons
SELECT * FROM persons;

-- Count total persons
SELECT COUNT(*) as total_persons FROM persons;

-- ====================================================================
-- USEFUL QUERIES FOR TESTING
-- ====================================================================

-- Find person by email
-- SELECT * FROM persons WHERE email = 'john.doe@email.com';

-- Find persons by name (partial match)
-- SELECT * FROM persons WHERE name LIKE '%John%';

-- Update a person
-- UPDATE persons SET phone = '555-9999' WHERE id = 1;

-- Delete a person
-- DELETE FROM persons WHERE id = 1;

-- ====================================================================
-- TABLE STRUCTURE EXPLANATION
-- ====================================================================

/*
COLUMN DETAILS:

1. id (INT AUTO_INCREMENT PRIMARY KEY)
   - Unique identifier for each person
   - Automatically increments (1, 2, 3, ...)
   - Primary key ensures uniqueness
   - Used in all CRUD operations to identify specific persons

2. name (VARCHAR(100) NOT NULL)
   - Person's first name
   - Maximum 100 characters
   - Cannot be empty (NOT NULL)

3. surname (VARCHAR(100) NOT NULL)
   - Person's last name
   - Maximum 100 characters
   - Cannot be empty (NOT NULL)

4. email (VARCHAR(255) NOT NULL UNIQUE)
   - Person's email address
   - Maximum 255 characters
   - Cannot be empty (NOT NULL)
   - Must be unique (UNIQUE constraint)
   - MySQL will reject duplicate emails

5. address (VARCHAR(255))
   - Person's physical address
   - Maximum 255 characters
   - Can be empty (nullable)

6. phone (VARCHAR(20))
   - Person's phone number
   - Maximum 20 characters (accommodates international formats)
   - Stored as VARCHAR (not INT) to preserve formatting
   - Can be empty (nullable)

7. created_at (TIMESTAMP)
   - Automatically set when record is created
   - Never needs to be manually set
   - Useful for tracking when persons were added

8. updated_at (TIMESTAMP)
   - Automatically updated whenever record is modified
   - Useful for tracking last modification time

CONSTRAINTS:

- PRIMARY KEY (id): Ensures each person has a unique ID
- UNIQUE (email): Prevents duplicate email addresses
- NOT NULL: Ensures required fields are always filled
- AUTO_INCREMENT: Automatically generates sequential IDs

INDEXES:

- MySQL automatically creates index on PRIMARY KEY (id)
- MySQL automatically creates index on UNIQUE (email)
- These indexes make queries faster
*/

-- ====================================================================
-- EXAMPLE CRUD OPERATIONS IN SQL
-- ====================================================================

-- CREATE (Insert a new person)
/*
INSERT INTO persons (name, surname, email, address, phone) 
VALUES ('Test', 'User', 'test@email.com', '123 Test St', '555-1234');
*/

-- READ (Get all persons)
/*
SELECT * FROM persons ORDER BY created_at DESC;
*/

-- READ (Get one person by ID)
/*
SELECT * FROM persons WHERE id = 1;
*/

-- UPDATE (Modify a person)
/*
UPDATE persons 
SET name = 'Updated', surname = 'Name', email = 'updated@email.com'
WHERE id = 1;
*/

-- DELETE (Remove a person)
/*
DELETE FROM persons WHERE id = 1;
*/

-- ====================================================================
-- DATABASE BEST PRACTICES DEMONSTRATED
-- ====================================================================

/*
1. Primary Keys:
   - Every table should have a primary key
   - Auto-increment integers are efficient and simple

2. Data Types:
   - VARCHAR for text (size based on expected data)
   - INT for numbers
   - TIMESTAMP for dates/times

3. Constraints:
   - NOT NULL prevents empty required fields
   - UNIQUE prevents duplicates where needed
   - Helps maintain data integrity

4. Timestamps:
   - Track when records are created/modified
   - Useful for auditing and debugging

5. Indexes:
   - Automatically created on PRIMARY KEY and UNIQUE columns
   - Make queries faster
   - Trade-off: slightly slower inserts/updates
*/

-- ====================================================================
-- TROUBLESHOOTING
-- ====================================================================

/*
Error: "Table 'persons' already exists"
Solution: Either drop the table first or skip creation

Error: "Duplicate entry for key 'email'"
Solution: Trying to insert duplicate email (by design)

Error: "Access denied"
Solution: Check MySQL user permissions

Error: "Unknown database 'person_crud_db'"
Solution: Make sure to run CREATE DATABASE first
*/

-- ====================================================================
-- END OF SETUP SCRIPT
-- ====================================================================
