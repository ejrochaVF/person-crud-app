# Backend - Person CRUD API

## Overview

This is a **Node.js/Express RESTful API** that implements a **Service Layer Architecture** with clear separation of concerns across HTTP, Business Logic, and Data Access layers.

## Architecture

```
backend/
├── src/
│   ├── common/
│   │   ├── errors.js           # Shared error classes
│   │   └── README.md           # Common utilities documentation
│   ├── config/
│   │   └── database.js         # Database connection (Data Access)
│   ├── controllers/
│   │   ├── baseController.js   # Base controller with common HTTP logic
│   │   └── personController.js # Person HTTP Layer - Request/Response handling
│   ├── services/
│   │   ├── personService.js    # Person Business Logic Layer - Domain rules & workflows
│   │   └── README.md           # Service layer documentation
│   ├── repositories/
│   │   ├── baseRepository.js   # Generic data access operations
│   │   ├── personRepository.js # Person-specific data operations
│   │   ├── cacheManager.js     # Caching layer
│   │   └── unitOfWork.js       # Transaction management
│   ├── models/
│   │   └── personModel.js      # Data models & entity definitions
│   ├── routes/
│   │   └── personRoutes.js     # API route definitions
│   └── server.js               # Express app setup & entry point
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies and scripts
```

## Layer Responsibilities

### 🖥️ Controllers (HTTP Layer)
- Handle HTTP requests and responses
- Parse request data and format responses
- Basic input sanitization
- HTTP status codes and error handling

### 🏢 Services (Business Logic Layer)
- Implement business rules and domain logic
- Orchestrate operations across repositories
- Business validation and transformations
- Coordinate complex business workflows

### 🗄️ Repositories (Data Access Layer)
- Abstract database operations
- Handle data persistence and retrieval
- Implement caching and transactions
- Query optimization and data mapping

### 🔧 Common (Shared Utilities)
- Standardized error classes (`BusinessError`, `ValidationError`, etc.)
- Common utilities and helpers
- Cross-cutting concerns

### 📊 Models (Data Layer)
- Define data structures and relationships
- Sequelize model definitions
- Data validation constraints

## Technology Stack

- **Node.js**: JavaScript runtime for server-side code
- **Express.js**: Web framework for building APIs
- **MySQL2**: MySQL database driver with Promise support
- **dotenv**: Load environment variables from .env file
- **cors**: Enable Cross-Origin Resource Sharing
- **nodemon** (dev): Auto-restart server on file changes

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your MySQL credentials
   # Use any text editor, for example:
   code .env
   # or
   nano .env
   ```

4. **Configure your .env file:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_actual_password
   DB_NAME=person_crud_db
   DB_PORT=3306
   PORT=5000
   ```

5. **Make sure MySQL is running and database is created** (see main README.md for SQL script)

## Running the Server

**Development mode** (auto-restart on changes):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api/persons
```

### Endpoints

#### 1. Get All Persons
```http
GET /api/persons
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "email": "john.doe@email.com",
      "address": "123 Main St",
      "phone": "555-0101",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. Get Person by ID
```http
GET /api/persons/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@email.com",
    "address": "123 Main St",
    "phone": "555-0101"
  }
}
```

#### 3. Create New Person
```http
POST /api/persons
Content-Type: application/json

{
  "name": "Jane",
  "surname": "Smith",
  "email": "jane.smith@email.com",
  "address": "456 Oak Ave",
  "phone": "555-0102"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Person created successfully",
  "data": {
    "id": 4,
    "name": "Jane",
    "surname": "Smith",
    "email": "jane.smith@email.com",
    "address": "456 Oak Ave",
    "phone": "555-0102"
  }
}
```

#### 4. Update Person
```http
PUT /api/persons/:id
Content-Type: application/json

{
  "name": "Jane",
  "surname": "Doe",
  "email": "jane.doe@email.com",
  "address": "789 Pine Rd",
  "phone": "555-0103"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Person updated successfully",
  "data": {
    "id": 1,
    "name": "Jane",
    "surname": "Doe",
    "email": "jane.doe@email.com",
    "address": "789 Pine Rd",
    "phone": "555-0103"
  }
}
```

#### 5. Delete Person
```http
DELETE /api/persons/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Person deleted successfully"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Invalid email format"
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Person with ID 999 not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Error creating person",
  "error": "Database connection failed"
}
```

## Understanding the Code

### 3-Tier Architecture in Backend

#### 1. Data Access Tier (`models/personModel.js`)
- **Responsibility**: Database operations only
- **Methods**:
  - `findAll()` - SELECT all persons
  - `findById(id)` - SELECT one person
  - `create(data)` - INSERT new person
  - `update(id, data)` - UPDATE person
  - `delete(id)` - DELETE person
- **Key Point**: Only contains SQL queries, no business logic

#### 2. Business Logic Tier (`controllers/personController.js`)
- **Responsibility**: Process requests, validate data, apply rules
- **Methods**:
  - `getAllPersons()` - Handle GET all request
  - `getPersonById()` - Handle GET one request
  - `createPerson()` - Validate and create
  - `updatePerson()` - Validate and update
  - `deletePerson()` - Handle delete request
- **Key Point**: Contains validation logic, calls model methods, sends responses

#### 3. Routes (`routes/personRoutes.js`)
- **Responsibility**: Map URLs to controller methods
- **Key Point**: Defines API structure

### Database Connection Pool

**What is it?**
A pool maintains multiple database connections that can be reused.

**Why use it?**
- Creating a new connection for each query is slow
- Connection pooling reuses existing connections
- Improves performance significantly

**How it works:**
```javascript
// In config/database.js
const pool = mysql.createPool({
  connectionLimit: 10,  // Max 10 concurrent connections
  // ... other config
});

// In model
const [rows] = await db.query('SELECT * FROM persons');
// Pool automatically assigns an available connection
// and returns it to the pool after the query
```

### Async/Await

All database operations use async/await instead of callbacks:

```javascript
// Old way (callbacks) - DON'T USE
db.query('SELECT * FROM persons', function(err, results) {
  if (err) throw err;
  console.log(results);
});

// Modern way (async/await) - USE THIS
const getAllPersons = async () => {
  try {
    const [results] = await db.query('SELECT * FROM persons');
    return results;
  } catch (error) {
    throw error;
  }
};
```

**Benefits:**
- Cleaner, more readable code
- Easier error handling
- No "callback hell"

### Middleware

Middleware functions process requests before they reach routes:

```javascript
// Executed in order:
app.use(cors());              // 1. Enable CORS
app.use(express.json());      // 2. Parse JSON bodies
app.use('/api/persons', ...); // 3. Route to person endpoints
```

### Error Handling

**Three levels of error handling:**

1. **Model Level**: Database errors
   ```javascript
   try {
     const [rows] = await db.query('SELECT...');
   } catch (error) {
     throw error;  // Pass to controller
   }
   ```

2. **Controller Level**: Business logic errors
   ```javascript
   try {
     const person = await Person.create(data);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
   ```

3. **Global Level**: Unexpected errors
   ```javascript
   app.use((err, req, res, next) => {
     res.status(500).json({ message: 'Server error' });
   });
   ```

## Testing the API

### Using Browser
Open in browser:
```
http://localhost:5000/api/persons
```

### Using curl (Command Line)

**Get all persons:**
```bash
curl http://localhost:5000/api/persons
```

**Get one person:**
```bash
curl http://localhost:5000/api/persons/1
```

**Create person:**
```bash
curl -X POST http://localhost:5000/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "surname": "User",
    "email": "test@email.com",
    "address": "123 Test St",
    "phone": "555-1234"
  }'
```

**Update person:**
```bash
curl -X PUT http://localhost:5000/api/persons/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated",
    "surname": "Name",
    "email": "updated@email.com",
    "address": "456 New Ave",
    "phone": "555-5678"
  }'
```

**Delete person:**
```bash
curl -X DELETE http://localhost:5000/api/persons/1
```

### Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Create new request
3. Set method (GET, POST, PUT, DELETE)
4. Set URL: `http://localhost:5000/api/persons`
5. For POST/PUT, add JSON body in Body tab
6. Send request

## Common Issues

### Server won't start
1. **Check if MySQL is running**: 
   ```bash
   # Windows
   net start MySQL80
   
   # Mac
   mysql.server start
   
   # Linux
   sudo service mysql start
   ```

2. **Check .env file**: Verify database credentials

3. **Check port 5000**: 
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

### Database connection error
1. Verify MySQL is running
2. Check username/password in .env
3. Ensure database `person_crud_db` exists
4. Try connecting with MySQL Workbench or command line

### CORS errors
- Make sure `cors()` middleware is enabled
- Check if frontend is on different port (it should be)

## Next Steps

1. ✅ Understand the 3-tier architecture
2. ✅ Test all CRUD operations
3. 📝 Add input validation on model level
4. 📝 Add pagination for getAllPersons
5. 📝 Add search/filter functionality
6. 📝 Add logging with Winston or Morgan
7. 📝 Add unit tests with Jest
8. 📝 Add authentication with JWT

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 NPM Package](https://www.npmjs.com/package/mysql2)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [RESTful API Design](https://restfulapi.net/)
